import { Hono } from 'hono';
import { Env, JwtPayload } from '../types/index';

const accountApp = new Hono<{ Bindings: Env, Variables: { user: JwtPayload } }>();

// 1. Ambil Profil & Riwayat Langganan
accountApp.get('/profile', async (c) => {
    const db = c.env.DB;
    const userId = c.get('user').id;

    const user = await db.prepare(`SELECT email FROM users WHERE id = ?`).bind(userId).first();
    const projects = await db.prepare(`
        SELECT id, project_name, subscription_status, subscription_end_date, created_at 
        FROM projects WHERE user_id = ?
    `).bind(userId).all();

    return c.json({ success: true, data: { user, projects: projects.results } });
});

// 2. Update Password
accountApp.post('/update-password', async (c) => {
    const { new_password } = await c.req.json();
    const userId = c.get('user').id;
    // Gunakan fungsi hashPassword yang sudah Anda miliki
    const hashedPassword = await hashPassword(new_password);
    
    await c.env.DB.prepare(`UPDATE users SET password_hash = ? WHERE id = ?`)
        .bind(hashedPassword, userId).run();

    return c.json({ success: true, message: 'Password berhasil diubah' });
});

export { accountApp };
