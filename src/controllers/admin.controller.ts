import { Hono } from 'hono';
import { Env, JwtPayload } from '../types/index';

const adminApp = new Hono<{ Bindings: Env, Variables: { user: JwtPayload } }>();

// Middleware Proteksi Super Admin
adminApp.use('*', async (c, next) => {
    const user = c.get('user');
    if (user.role !== 'admin') {
        return c.json({ success: false, message: 'Forbidden: Super Admin access required' }, 403);
    }
    await next();
});

// Mendapatkan daftar seluruh tenant beserta status langganannya
adminApp.get('/tenants', async (c) => {
    const db = c.env.DB;

    const tenants = await db.prepare(`
        SELECT t.id, t.store_name, t.subscription_status, t.subscription_end_date, u.email, t.created_at
        FROM tenants t
        JOIN users u ON t.user_id = u.id
        ORDER BY t.created_at DESC
    `).all();

    return c.json({ success: true, data: tenants.results });
});

// Memperpanjang atau mengubah status langganan tenant
adminApp.post('/tenants/extend', async (c) => {
    const db = c.env.DB;
    const { tenant_id, days_to_add, status } = await c.req.json();

    try {
        const tenant = await db.prepare(`SELECT subscription_end_date FROM tenants WHERE id = ?`)
            .bind(tenant_id)
            .first<{ subscription_end_date: string }>();

        if (!tenant) {
            return c.json({ success: false, message: 'Tenant not found' }, 404);
        }

        // Kalkulasi tanggal baru
        let currentEndDate = new Date(tenant.subscription_end_date);
        const now = new Date();
        
        // Jika sudah kedaluwarsa, mulai dari hari ini
        if (currentEndDate < now) {
            currentEndDate = now;
        }

        currentEndDate.setDate(currentEndDate.getDate() + (days_to_add || 30));
        const newEndDateStr = currentEndDate.toISOString();
        const newStatus = status || 'active';

        await db.prepare(`
            UPDATE tenants 
            SET subscription_status = ?, subscription_end_date = ? 
            WHERE id = ?
        `).bind(newStatus, newEndDateStr, tenant_id).run();

        return c.json({ success: true, message: 'Subscription updated successfully', data: { new_end_date: newEndDateStr } });
    } catch (error) {
        return c.json({ success: false, message: 'Failed to update subscription' }, 500);
    }
});

export { adminApp };
