import { Hono } from 'hono';
import { Env, JwtPayload } from '../types/index';
import { TelegramService } from '../services/telegram.service';

const botApp = new Hono<{ Bindings: Env, Variables: { user: JwtPayload } }>();

botApp.get('/', async (c) => {
    const projectId = c.req.param('project_id');
    const db = c.env.DB;

    const bot = await db.prepare(`
        SELECT bot_token, bot_username, webhook_url, is_active, display_name, description, admin_telegram_id, is_affiliate, affiliate_commission 
        FROM bot_configs 
        WHERE project_id = ?
    `).bind(projectId).first();

    return c.json({ success: true, data: bot || null });
});

botApp.post('/update', async (c) => {
    const projectId = c.req.param('project_id');
    const db = c.env.DB;
    const body = await c.req.json();
    const { bot_token, display_name, description, admin_telegram_id, is_affiliate, affiliate_commission } = body;
    const mainDomain = c.env.MAIN_DOMAIN;

    try {
        const telegramService = new TelegramService(bot_token);
        
        const me = await telegramService.getMe();
        if (!me.ok) {
            return c.json({ success: false, message: 'Invalid Telegram Bot Token' }, 400);
        }

        const botUsername = me.result.username;
        const webhookUrl = `https://${mainDomain}/api/webhook/telegram/${projectId}`;

        const webhookSecret = crypto.randomUUID().replace(/-/g, ''); 
        const isWebhookSet = await telegramService.setWebhook(webhookUrl, webhookSecret);

        if (!isWebhookSet) {
            return c.json({ success: false, message: 'Failed to set Telegram Webhook' }, 500);
        }

        if (display_name) await telegramService.setMyName(display_name);
        if (description) await telegramService.setMyDescription(description);

        await db.prepare(`
            INSERT INTO bot_configs (project_id, bot_token, bot_username, webhook_url, is_active, display_name, description, admin_telegram_id, is_affiliate, affiliate_commission)
            VALUES (?, ?, ?, ?, 1, ?, ?, ?, ?, ?)
            ON CONFLICT(project_id) DO UPDATE SET
            bot_token = excluded.bot_token,
            bot_username = excluded.bot_username,
            webhook_url = excluded.webhook_url,
            is_active = 1,
            display_name = excluded.display_name,
            description = excluded.description,
            admin_telegram_id = excluded.admin_telegram_id,
            is_affiliate = excluded.is_affiliate,
            affiliate_commission = excluded.affiliate_commission
        `).bind(
            projectId, bot_token, botUsername, webhookUrl, 
            display_name || '', description || '', admin_telegram_id || '', 
            is_affiliate ? 1 : 0, affiliate_commission || 0
        ).run();

        return c.json({ 
            success: true, 
            message: 'Bot successfully configured and updated',
            data: { username: botUsername }
        });
    } catch (error) {
        return c.json({ success: false, message: 'Internal Server Error' }, 500);
    }
});

export { botApp };
