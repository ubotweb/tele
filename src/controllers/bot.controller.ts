import { Hono } from 'hono';
import { Env, JwtPayload } from '../types/index';
import { TelegramService } from '../services/telegram.service';

const botApp = new Hono<{ Bindings: Env, Variables: { user: JwtPayload } }>();

// GET: Mengambil pengaturan bot saat ini
botApp.get('/', async (c) => {
    const projectId = c.req.param('project_id');
    const db = c.env.DB;

    const bot = await db.prepare(`
        SELECT bot_token, bot_username, webhook_url, is_active, display_name, description, admin_telegram_id 
        FROM bot_configs 
        WHERE project_id = ?
    `).bind(projectId).first();

    return c.json({ success: true, data: bot || null });
});

// POST: Memperbarui token, Webhook, dan konfigurasi bot
botApp.post('/', async (c) => {
    const projectId = c.req.param('project_id');
    const db = c.env.DB;
    const { bot_token, display_name, description, admin_telegram_id } = await c.req.json();
    const mainDomain = c.env.MAIN_DOMAIN;

    try {
        const telegramService = new TelegramService(bot_token);
        
        // 1. Validasi Token ke Telegram API
        const me = await telegramService.getMe();
        if (!me.ok) {
            return c.json({ success: false, message: 'Invalid Telegram Bot Token' }, 400);
        }

        const botUsername = me.result.username;
        const webhookUrl = `https://${mainDomain}/api/webhook/telegram/${projectId}`;

        // 2. Terapkan Webhook ke Telegram
        // Menggunakan secret untuk keamanan webhook
        const webhookSecret = crypto.randomUUID().replace(/-/g, ''); 
        const isWebhookSet = await telegramService.setWebhook(webhookUrl, webhookSecret);

        if (!isWebhookSet) {
            return c.json({ success: false, message: 'Failed to set Telegram Webhook' }, 500);
        }

        // 3. Update Nama dan Deskripsi via Telegram API
        if (display_name) await telegramService.setMyName(display_name);
        if (description) await telegramService.setMyDescription(description);

        // 4. Simpan ke D1 Database (dengan field baru)
        await db.prepare(`
            INSERT INTO bot_configs (
                project_id, bot_token, bot_username, webhook_url, is_active, 
                display_name, description, admin_telegram_id
            )
            VALUES (?, ?, ?, ?, 1, ?, ?, ?)
            ON CONFLICT(project_id) DO UPDATE SET
            bot_token = excluded.bot_token,
            bot_username = excluded.bot_username,
            webhook_url = excluded.webhook_url,
            is_active = 1,
            display_name = excluded.display_name,
            description = excluded.description,
            admin_telegram_id = excluded.admin_telegram_id
        `).bind(
            projectId, 
            bot_token, 
            botUsername, 
            webhookUrl, 
            display_name, 
            description, 
            admin_telegram_id
        ).run();

        return c.json({ 
            success: true, 
            message: 'Bot configuration saved successfully', 
            data: { username: botUsername }
        });
    } catch (error) {
        console.error('Bot Config Error:', error);
        return c.json({ success: false, message: 'Internal Server Error' }, 500);
    }
});

export { botApp };
