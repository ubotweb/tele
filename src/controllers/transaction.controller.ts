import { Hono } from 'hono';
import { Env, JwtPayload } from '../types/index';

const transactionApp = new Hono<{ Bindings: Env, Variables: { user: JwtPayload } }>();

transactionApp.get('/', async (c) => {
    const projectId = c.req.param('project_id');
    const db = c.env.DB;

    const transactions = await db.prepare(`
        SELECT t.id, t.amount, t.status, t.created_at, t.paid_at, p.title as product_title, p.type as product_type
        FROM transactions t
        JOIN products p ON t.product_id = p.id
        WHERE t.project_id = ?
        ORDER BY t.created_at DESC
        LIMIT 50
    `).bind(projectId).all();

    return c.json({ success: true, data: transactions.results });
});

transactionApp.get('/stats', async (c) => {
    const projectId = c.req.param('project_id');
    const db = c.env.DB;

    const stats = await db.prepare(`
        SELECT 
            COUNT(id) as total_sales,
            SUM(amount) as total_revenue
        FROM transactions 
        WHERE project_id = ? AND status = 'paid'
    `).bind(projectId).first();

    return c.json({ 
        success: true, 
        data: {
            total_sales: stats?.total_sales || 0,
            total_revenue: stats?.total_revenue || 0
        }
    });
});

export { transactionApp };
