import { Hono } from 'hono';
import { Env, JwtPayload } from '../types/index';
import { TelegramService } from '../services/telegram.service';

const botApp = new Hono<{ Bindings: Env, Variables: { user: JwtPayload } }>();

botApp.get('/', async (c) => {
    const projectId = c.req.param('project_id');
    const db = c.env.DB;

    const bot = await db.prepare(`
        SELECT bot_token, bot_username, webhook_url, is_active, display_name, description, admin_telegram_id, is_affiliate, affiliate_commission, tiktok_shop_id 
        FROM bot_configs 
        WHERE project_id = ?
    `).bind(projectId).first();

    return c.json({ success: true, data: bot || null });
});

botApp.post('/update', async (c) => {
    const projectId = c.req.param('project_id');
    const db = c.env.DB;
    const body = await c.req.json();
    const { bot_token, display_name, description, admin_telegram_id, is_affiliate, affiliate_commission, tiktok_shop_id } = body;
    const mainDomain = c.env.MAIN_DOMAIN;

    try {
        let botUsername = '';
        let webhookUrl = '';

        // Validasi Telegram hanya dilakukan jika bot_token diisi
        if (bot_token && bot_token.trim() !== '') {
            const telegramService = new TelegramService(bot_token);
            const me = await telegramService.getMe();
            
            if (!me.ok) {
                return c.json({ success: false, message: 'Invalid Telegram Bot Token' }, 400);
            }

            botUsername = me.result.username;
            webhookUrl = `https://${mainDomain}/api/webhook/telegram/${projectId}`;
            const webhookSecret = crypto.randomUUID().replace(/-/g, ''); 
            
            const isWebhookSet = await telegramService.setWebhook(webhookUrl, webhookSecret);
            if (!isWebhookSet) {
                return c.json({ success: false, message: 'Failed to set Telegram Webhook' }, 500);
            }

            if (display_name) await telegramService.setMyName(display_name);
            if (description) await telegramService.setMyDescription(description);
        }

        await db.prepare(`
            INSERT INTO bot_configs (
                project_id, bot_token, bot_username, webhook_url, is_active, display_name, 
                description, admin_telegram_id, is_affiliate, affiliate_commission, tiktok_shop_id
            )
            VALUES (?, ?, ?, ?, 1, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(project_id) DO UPDATE SET
                bot_token = excluded.bot_token,
                bot_username = excluded.bot_username,
                webhook_url = excluded.webhook_url,
                is_active = 1,
                display_name = excluded.display_name,
                description = excluded.description,
                admin_telegram_id = excluded.admin_telegram_id,
                is_affiliate = excluded.is_affiliate,
                affiliate_commission = excluded.affiliate_commission,
                tiktok_shop_id = excluded.tiktok_shop_id
        `).bind(
            projectId, bot_token || '', botUsername, webhookUrl, 
            display_name || '', description || '', admin_telegram_id || '', 
            is_affiliate ? 1 : 0, affiliate_commission || 0, tiktok_shop_id || null
        ).run();

        return c.json({ 
            success: true, 
            message: 'Integration successfully configured and updated',
            data: { username: botUsername }
        });
    } catch (error) {
        return c.json({ success: false, message: 'Internal Server Error' }, 500);
    }
});

// ============================================================================
// [BARU] TIKTOK OAUTH CALLBACK
// Menangkap data 'code' dari TikTok setelah user berhasil login
// ============================================================================
botApp.get('/tiktok/callback', async (c) => {
    const code = c.req.query('code');
    const projectId = c.req.query('state'); // Kita menyisipkan project_id di state saat memanggil URL otorisasi
    const db = c.env.DB;

    if (!code || !projectId) {
        return c.text('Otorisasi gagal: Data otentikasi atau ID Project tidak lengkap', 400);
    }

    try {
        // DI MASA DEPAN: Buka komentar ini dan sesuaikan dengan API resmi TikTok
        /*
        const tokenRes = await fetch('https://auth.tiktok-us.com/api/v2/token/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                app_key: 'APP_KEY_TIKTOK_ANDA',
                app_secret: 'APP_SECRET_TIKTOK_ANDA',
                auth_code: code,
                grant_type: 'authorized_code'
            })
        });
        const tokenData = await tokenRes.json();
        const sellerId = tokenData.data.seller_id; // Identitas toko tiktok
        */
       
        // Untuk saat ini: Simulasi mendapatkan seller_id dari TikTok
        const sellerId = "DUMMY_TIKTOK_SHOP_ID_" + code.substring(0, 5); 

        // Simpan ID TikTok Shop tersebut ke database sesuai project-nya
        await db.prepare(`
            UPDATE bot_configs SET tiktok_shop_id = ? WHERE project_id = ?
        `).bind(sellerId, projectId).run();

        // Kembalikan pengguna ke halaman dashboard dengan notifikasi sukses
        return c.html(`
            <html>
                <head>
                    <title>TikTok Connected</title>
                </head>
                <body>
                    <script>
                        alert('TikTok Shop Berhasil Dihubungkan ke sistem!');
                        window.location.href = '/tenant/project/${projectId}/bot';
                    </script>
                </body>
            </html>
        `);
    } catch (e) {
        console.error('TikTok Auth Error:', e);
        return c.text('Terjadi kesalahan saat menghubungkan TikTok. Silakan coba lagi.', 500);
    }
});

export { botApp };
