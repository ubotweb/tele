import { Hono } from 'hono';
import { Env, JwtPayload } from '../types/index';

const orderApp = new Hono<{ Bindings: Env, Variables: { user: JwtPayload } }>();

// Membuat Transaksi Baru (Simulasi untuk API / Bot Pembeli)
orderApp.post('/create', async (c) => {
    const db = c.env.DB;
    const { tenant_id, product_id, buyer_telegram_id, amount } = await c.req.json();
    const transactionId = crypto.randomUUID();

    // 1. Pengecekan Ketersediaan Produk
    const product = await db.prepare(`SELECT type, stock FROM products WHERE id = ? AND tenant_id = ? AND is_active = 1`)
        .bind(product_id, tenant_id)
        .first<{ type: string, stock: number }>();

    if (!product) {
        return c.json({ success: false, message: 'Product not found or inactive' }, 404);
    }

    // Pembuatan payload QRIS dinamis (Di dunia nyata integrasi dengan Xendit/Midtrans API disini)
    const qrisPayload = `QRIS_MOCK_PAYLOAD_${transactionId}_AMOUNT_${amount}`;

    try {
        await db.prepare(`
            INSERT INTO transactions (id, tenant_id, product_id, buyer_telegram_id, amount, qris_payload, status)
            VALUES (?, ?, ?, ?, ?, ?, 'pending')
        `).bind(transactionId, tenant_id, product_id, buyer_telegram_id, amount, qrisPayload).run();

        return c.json({ success: true, data: { transaction_id: transactionId, qris_payload: qrisPayload } });
    } catch (error) {
        return c.json({ success: false, message: 'Transaction creation failed' }, 500);
    }
});

// Simulasi Webhook Pembayaran Berhasil (Anti Race-Condition Lock)
orderApp.post('/webhook/payment', async (c) => {
    const db = c.env.DB;
    const { transaction_id } = await c.req.json();

    const trx = await db.prepare(`SELECT id, product_id, tenant_id FROM transactions WHERE id = ? AND status = 'pending'`)
        .bind(transaction_id)
        .first<{ id: string, product_id: string, tenant_id: string }>();

    if (!trx) return c.json({ success: false, message: 'Invalid or processed transaction' }, 400);

    const product = await db.prepare(`SELECT type FROM products WHERE id = ?`).bind(trx.product_id).first<{ type: string }>();

    let digitalAssetId = null;

    // ANTI RACE CONDITION LOGIC UNTUK PRODUK UNIK
    if (product && product.type === 'unique') {
        const asset = await db.prepare(`
            UPDATE digital_assets 
            SET is_used = 1 
            WHERE id = (
                SELECT id FROM digital_assets 
                WHERE product_id = ? AND is_used = 0 
                LIMIT 1
            ) 
            RETURNING id, license_code
        `).bind(trx.product_id).first<{ id: string, license_code: string }>();

        if (!asset) {
            // Refund logic diletakkan disini karena stok habis saat pengguna membayar
            await db.prepare(`UPDATE transactions SET status = 'failed' WHERE id = ?`).bind(transaction_id).run();
            return c.json({ success: false, message: 'Out of stock at the exact moment of payment' }, 409);
        }
        digitalAssetId = asset.id;
    }

    // Mengunci Transaksi sebagai 'paid'
    await db.prepare(`
        UPDATE transactions 
        SET status = 'paid', paid_at = CURRENT_TIMESTAMP, digital_asset_id = ? 
        WHERE id = ?
    `).bind(digitalAssetId, transaction_id).run();

    return c.json({ success: true, message: 'Payment processed successfully' });
});

export { orderApp };
