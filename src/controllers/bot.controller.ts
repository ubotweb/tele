import { Hono } from 'hono';
import { Env, JwtPayload } from '../types/index';
import { TelegramService } from '../services/telegram.service';

const botApp = new Hono<{ Bindings: Env, Variables: { user: JwtPayload } }>();

// Mengambil pengaturan bot saat ini
botApp.get('/', async (c) => {
    const user = c.get('user');
    const db = c.env.DB;

    const bot = await db.prepare(`SELECT bot_token, bot_username, webhook_url, is_active FROM telegram_bots WHERE tenant_id = ?`)
        .bind(user.tenant_id)
        .first();

    return c.json({ success: true, data: bot || null });
});

// Memperbarui atau menyimpan token bot dan mengatur Webhook
botApp.post('/update', async (c) => {
    const user = c.get('user');
    const db = c.env.DB;
    const { bot_token, bot_name, bot_description } = await c.req.json();
    const mainDomain = c.env.MAIN_DOMAIN;

    try {
        const telegramService = new TelegramService(bot_token);
        
        // 1. Validasi Token dengan getMe
        const me = await telegramService.getMe();
        if (!me.ok) {
            return c.json({ success: false, message: 'Invalid Telegram Bot Token' }, 400);
        }

        const botUsername = me.result.username;
        const webhookUrl = `https://${mainDomain}/api/webhook/telegram/${user.tenant_id}`;

        // 2. Terapkan Webhook
        const webhookSecret = crypto.randomUUID().replace(/-/g, ''); // Secret dinamis
        const isWebhookSet = await telegramService.setWebhook(webhookUrl, webhookSecret);

        if (!isWebhookSet) {
            return c.json({ success: false, message: 'Failed to set Telegram Webhook' }, 500);
        }

        // 3. Opsional: Update Nama dan Deskripsi jika diberikan
        if (bot_name) await telegramService.setMyName(bot_name);
        if (bot_description) await telegramService.setMyDescription(bot_description);

        // 4. Simpan ke D1 Database (Upsert)
        await db.prepare(`
            INSERT INTO telegram_bots (id, tenant_id, bot_token, bot_username, webhook_url, is_active)
            VALUES (?, ?, ?, ?, ?, 1)
            ON CONFLICT(tenant_id) DO UPDATE SET
            bot_token = excluded.bot_token,
            bot_username = excluded.bot_username,
            webhook_url = excluded.webhook_url,
            is_active = 1
        `).bind(crypto.randomUUID(), user.tenant_id, bot_token, botUsername, webhookUrl).run();

        return c.json({ 
            success: true, 
            message: 'Bot successfully configured and webhook is active',
            data: { username: botUsername }
        });
    } catch (error) {
        return c.json({ success: false, message: 'Internal Server Error' }, 500);
    }
});

export { botApp };
