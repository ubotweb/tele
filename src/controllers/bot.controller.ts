import { Hono } from 'hono';
import { Env, JwtPayload } from '../types/index';
import { TelegramService } from '../services/telegram.service';

const botApp = new Hono<{ Bindings: Env, Variables: { user: JwtPayload } }>();

// Mengambil pengaturan bot saat ini untuk project spesifik
botApp.get('/', async (c) => {
    const projectId = c.req.param('project_id');
    const db = c.env.DB;

    const bot = await db.prepare(`
        SELECT bot_token, bot_username, webhook_url, is_active 
        FROM bot_configs 
        WHERE project_id = ?
    `).bind(projectId).first();

    return c.json({ success: true, data: bot || null });
});

// Memperbarui token bot dan Webhook
botApp.post('/update', async (c) => {
    const projectId = c.req.param('project_id');
    const db = c.env.DB;
    const { bot_token, bot_name, bot_description } = await c.req.json();
    const mainDomain = c.env.MAIN_DOMAIN;

    try {
        const telegramService = new TelegramService(bot_token);
        
        // 1. Validasi Token
        const me = await telegramService.getMe();
        if (!me.ok) {
            return c.json({ success: false, message: 'Invalid Telegram Bot Token' }, 400);
        }

        const botUsername = me.result.username;
        // Webhook URL kini mengarah ke spesifik project_id
        const webhookUrl = `https://${mainDomain}/api/webhook/telegram/${projectId}`;

        // 2. Terapkan Webhook ke Telegram
        const webhookSecret = crypto.randomUUID().replace(/-/g, ''); 
        const isWebhookSet = await telegramService.setWebhook(webhookUrl, webhookSecret);

        if (!isWebhookSet) {
            return c.json({ success: false, message: 'Failed to set Telegram Webhook' }, 500);
        }

        // 3. Opsional: Update Nama dan Deskripsi
        if (bot_name) await telegramService.setMyName(bot_name);
        if (bot_description) await telegramService.setMyDescription(bot_description);

        // 4. Simpan ke D1 Database
        await db.prepare(`
            INSERT INTO bot_configs (project_id, bot_token, bot_username, webhook_url, is_active)
            VALUES (?, ?, ?, ?, 1)
            ON CONFLICT(project_id) DO UPDATE SET
            bot_token = excluded.bot_token,
            bot_username = excluded.bot_username,
            webhook_url = excluded.webhook_url,
            is_active = 1
        `).bind(projectId, bot_token, botUsername, webhookUrl).run();

        return c.json({ 
            success: true, 
            message: 'Bot successfully configured for this project',
            data: { username: botUsername }
        });
    } catch (error) {
        return c.json({ success: false, message: 'Internal Server Error' }, 500);
    }
});

export { botApp };
