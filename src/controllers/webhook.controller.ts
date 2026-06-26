import { Hono } from 'hono';
import { Env } from '../types/index';
import { TelegramService } from '../services/telegram.service';

const webhookApp = new Hono<{ Bindings: Env }>();

webhookApp.post('/telegram/:project_id', async (c) => {
    const projectId = c.req.param('project_id');
    const db = c.env.DB;
    const body = await c.req.json();

    if (!body.message || !body.message.text) {
        return c.json({ success: true, message: 'Ignored non-text message' });
    }

    const chatId = body.message.chat.id;
    const text = body.message.text.trim();

    // 1. RECORD USER DATA (Logika Baru)
    // Mendapatkan data pengguna dari payload Telegram
    const from = body.message.from;
    if (from) {
        const telegramId = from.id.toString();
        const username = from.username || null;
        const firstName = from.first_name || 'User';

        try {
            // Cek apakah user sudah pernah berinteraksi sebelumnya di project ini
            const existingUser = await db.prepare(`SELECT id FROM bot_users WHERE project_id = ? AND telegram_id = ?`)
                .bind(projectId, telegramId)
                .first<{ id: string }>();

            if (!existingUser) {
                // Jika belum ada, masukkan sebagai user baru
                await db.prepare(`
                    INSERT INTO bot_users (id, project_id, telegram_id, username, first_name, is_affiliate, commission_balance)
                    VALUES (?, ?, ?, ?, ?, 0, 0)
                `).bind(crypto.randomUUID(), projectId, telegramId, username, firstName).run();
            } else {
                // Jika sudah ada, update nama dan username-nya (berjaga-jaga jika mereka mengganti profil di Telegram)
                await db.prepare(`
                    UPDATE bot_users SET username = ?, first_name = ? WHERE id = ?
                `).bind(username, firstName, existingUser.id).run();
            }
        } catch (e) {
            console.error('Failed to save/update user info:', e);
            // Jangan hentikan eksekusi webhook jika sekadar gagal menyimpan data user
        }
    }

    // 2. PROSES MEMBALAS PESAN BOT
    try {
        const botConfig = await db.prepare(`SELECT bot_token FROM bot_configs WHERE project_id = ? AND is_active = 1`)
            .bind(projectId)
            .first<{ bot_token: string }>();

        if (!botConfig) {
            return c.json({ success: false, message: 'Bot not configured' }, 404);
        }

        const telegramService = new TelegramService(botConfig.bot_token);

        // Cek Custom Commands terlebih dahulu
        const customCommand = await db.prepare(`SELECT reply_text FROM bot_commands WHERE project_id = ? AND command = ? AND is_active = 1`)
            .bind(projectId, text)
            .first<{ reply_text: string }>();

        if (customCommand) {
            await telegramService.sendMessage(chatId, customCommand.reply_text);
            return c.json({ success: true });
        }

        // Fallback ke perintah default: /products
        if (text === '/products') {
            const products = await db.prepare(`SELECT title, price FROM products WHERE project_id = ? AND is_active = 1 LIMIT 10`)
                .bind(projectId)
                .all();

            if (products.results.length === 0) {
                await telegramService.sendMessage(chatId, "Maaf, belum ada produk yang tersedia saat ini.");
                return c.json({ success: true });
            }

            let msg = "<b>Katalog Produk Kami:</b>\n\n";
            products.results.forEach((p: any, index: number) => {
                msg += `${index + 1}. ${p.title} - <b>Rp ${p.price.toLocaleString('id-ID')}</b>\n`;
            });
            await telegramService.sendMessage(chatId, msg);
            return c.json({ success: true });
        }

        // Tanggapan bawaan jika teks sama sekali tidak dikenali
        await telegramService.sendMessage(chatId, "Perintah tidak dikenali. Ketik /products untuk melihat katalog.");
        return c.json({ success: true });
        
    } catch (error) {
        return c.json({ success: false, message: 'Webhook error processing command' }, 500);
    }
});

export { webhookApp };
