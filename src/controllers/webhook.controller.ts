import { Hono } from 'hono';
import { Env } from '../types/index';
import { TelegramService } from '../services/telegram.service';

const webhookApp = new Hono<{ Bindings: Env }>();

// Menangani Webhook yang dikirim oleh server Telegram resmi
webhookApp.post('/telegram/:tenant_id', async (c) => {
    const tenantId = c.req.param('tenant_id');
    const db = c.env.DB;
    const body = await c.req.json();

    // Pastikan ini adalah pesan obrolan
    if (!body.message || !body.message.text) {
        return c.json({ success: true, message: 'Ignored non-text message' });
    }

    const chatId = body.message.chat.id;
    const text = body.message.text.trim();

    try {
        // 1. Dapatkan Token Bot pengguna dari D1 Database
        const botConfig = await db.prepare(`SELECT bot_token FROM telegram_bots WHERE tenant_id = ? AND is_active = 1`)
            .bind(tenantId)
            .first<{ bot_token: string }>();

        if (!botConfig) {
            return c.json({ success: false, message: 'Bot not configured or inactive' }, 404);
        }

        const telegramService = new TelegramService(botConfig.bot_token);

        // 2. Routing Perintah Bot Sederhana
        if (text === '/start') {
            await telegramService.sendMessage(
                chatId, 
                "<b>Welcome to our Store!</b>\n\nType /products to see our available catalog."
            );
            return c.json({ success: true });
        }

        if (text === '/products') {
            // Ambil daftar produk yang aktif dari D1 Database
            const products = await db.prepare(`SELECT title, price FROM products WHERE tenant_id = ? AND is_active = 1 LIMIT 10`)
                .bind(tenantId)
                .all();

            if (products.results.length === 0) {
                await telegramService.sendMessage(chatId, "Sorry, we don't have any products available right now.");
                return c.json({ success: true });
            }

            let msg = "<b>Available Products:</b>\n\n";
            products.results.forEach((p: any, index: number) => {
                msg += `${index + 1}. ${p.title} - <b>Rp ${p.price.toLocaleString('id-ID')}</b>\n`;
            });
            msg += "\n<i>To purchase, please reply with the product number (feature in development).</i>";

            await telegramService.sendMessage(chatId, msg);
            return c.json({ success: true });
        }

        // Tanggapan bawaan jika perintah tidak dikenali
        await telegramService.sendMessage(chatId, "Command not recognized. Type /products to view catalog.");
        return c.json({ success: true });
        
    } catch (error) {
        return c.json({ success: false, message: 'Webhook processing failed' }, 500);
    }
});

export { webhookApp };
