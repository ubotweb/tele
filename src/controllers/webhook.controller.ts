import { Hono } from 'hono';
import { Env } from '../types/index';
import { TelegramService } from '../services/telegram.service';

const webhookApp = new Hono<{ Bindings: Env }>();

// Ubah parameter menjadi project_id
webhookApp.post('/telegram/:project_id', async (c) => {
    const projectId = c.req.param('project_id');
    const db = c.env.DB;
    const body = await c.req.json();

    if (!body.message || !body.message.text) {
        return c.json({ success: true, message: 'Ignored non-text message' });
    }

    const chatId = body.message.chat.id;
    const text = body.message.text.trim();

    try {
        // 1. Query ke tabel bot_configs yang baru
        const botConfig = await db.prepare(`SELECT bot_token FROM bot_configs WHERE project_id = ? AND is_active = 1`)
            .bind(projectId)
            .first<{ bot_token: string }>();

        if (!botConfig) {
            return c.json({ success: false, message: 'Bot not configured' }, 404);
        }

        const telegramService = new TelegramService(botConfig.bot_token);

        // 2. CEK CUSTOM COMMANDS TERLEBIH DAHULU (Fitur Baru)
        const customCommand = await db.prepare(`SELECT reply_text FROM bot_commands WHERE project_id = ? AND command = ? AND is_active = 1`)
            .bind(projectId, text)
            .first<{ reply_text: string }>();

        if (customCommand) {
            await telegramService.sendMessage(chatId, customCommand.reply_text);
            return c.json({ success: true });
        }

        // 3. Fallback ke perintah default (contoh: /products)
        if (text === '/products') {
            // Ubah query filter menggunakan project_id
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

        // Tanggapan bawaan
        await telegramService.sendMessage(chatId, "Perintah tidak dikenali. Ketik /products untuk melihat katalog.");
        return c.json({ success: true });
        
    } catch (error) {
        return c.json({ success: false, message: 'Webhook error' }, 500);
    }
});

export { webhookApp };
