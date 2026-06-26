import { Hono } from 'hono';
import { Env, JwtPayload } from '../types/index';

const userApp = new Hono<{ Bindings: Env, Variables: { user: JwtPayload } }>();

// Read: Mendapatkan seluruh daftar pengguna yang berinteraksi dengan Bot Project ini
userApp.get('/', async (c) => {
    const projectId = c.req.param('project_id');
    const db = c.env.DB;

    const users = await db.prepare(`
        SELECT id, telegram_id, username, first_name, is_affiliate, commission_balance, created_at
        FROM bot_users 
        WHERE project_id = ? 
        ORDER BY created_at DESC
    `).bind(projectId).all();

    return c.json({ success: true, data: users.results });
});

// Update: Mengubah status pengguna (misal menjadikannya affiliate atau menambah komisi manual)
userApp.put('/:id', async (c) => {
    const projectId = c.req.param('project_id');
    const botUserId = c.req.param('id');
    const db = c.env.DB;
    const body = await c.req.json();

    const isAffiliate = body.is_affiliate ? 1 : 0;
    const commissionBalance = parseFloat(body.commission_balance || '0');

    try {
        const result = await db.prepare(`
            UPDATE bot_users 
            SET is_affiliate = ?, commission_balance = ?
            WHERE id = ? AND project_id = ?
        `).bind(isAffiliate, commissionBalance, botUserId, projectId).run();

        if (result.meta.changes === 0) {
            return c.json({ success: false, message: 'User not found' }, 404);
        }

        return c.json({ success: true, message: 'User updated successfully' });
    } catch (error) {
        return c.json({ success: false, message: 'Failed to update user' }, 500);
    }
});

// Delete: Menghapus data/memblokir akses pengguna dari sistem bot (opsional)
userApp.delete('/:id', async (c) => {
    const projectId = c.req.param('project_id');
    const botUserId = c.req.param('id');
    const db = c.env.DB;

    const result = await db.prepare(`DELETE FROM bot_users WHERE id = ? AND project_id = ?`)
        .bind(botUserId, projectId)
        .run();

    if (result.meta.changes === 0) {
        return c.json({ success: false, message: 'User not found' }, 404);
    }

    return c.json({ success: true, message: 'User removed from system' });
});

export { userApp };
