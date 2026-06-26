import { Hono } from 'hono';
import { Env, JwtPayload } from '../types/index';

const transactionApp = new Hono<{ Bindings: Env, Variables: { user: JwtPayload } }>();

// Mendapatkan riwayat transaksi tenant
transactionApp.get('/', async (c) => {
    const user = c.get('user');
    const db = c.env.DB;

    const transactions = await db.prepare(`
        SELECT t.id, t.amount, t.status, t.created_at, t.paid_at, p.title as product_title, p.type as product_type
        FROM transactions t
        JOIN products p ON t.product_id = p.id
        WHERE t.tenant_id = ?
        ORDER BY t.created_at DESC
        LIMIT 50
    `).bind(user.tenant_id).all();

    return c.json({ success: true, data: transactions.results });
});

// Mendapatkan statistik pendapatan
transactionApp.get('/stats', async (c) => {
    const user = c.get('user');
    const db = c.env.DB;

    const stats = await db.prepare(`
        SELECT 
            COUNT(id) as total_sales,
            SUM(amount) as total_revenue
        FROM transactions 
        WHERE tenant_id = ? AND status = 'paid'
    `).bind(user.tenant_id).first();

    return c.json({ 
        success: true, 
        data: {
            total_sales: stats?.total_sales || 0,
            total_revenue: stats?.total_revenue || 0
        }
    });
});

export { transactionApp };
