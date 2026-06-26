import { Hono } from 'hono';
import { Env, JwtPayload } from '../types/index';

const accountApp = new Hono<{ Bindings: Env, Variables: { user: JwtPayload } }>();

// Fungsi helper hash bawaan V8
const hashPassword = async (password: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

accountApp.get('/profile', async (c) => {
    const db = c.env.DB;
    const userId = c.get('user').id;

    const user = await db.prepare(`SELECT email, created_at FROM users WHERE id = ?`).bind(userId).first();
    const projects = await db.prepare(`
        SELECT id, project_name as store_name, subscription_status, subscription_end_date, created_at 
        FROM projects 
        WHERE user_id = ? 
        ORDER BY created_at DESC
    `).bind(userId).all();

    return c.json({ success: true, data: { user, projects: projects.results } });
});

accountApp.post('/update-password', async (c) => {
    const { new_password } = await c.req.json();
    const userId = c.get('user').id;

    if (!new_password || new_password.length < 6) {
        return c.json({ success: false, message: 'Password baru minimal 6 karakter' }, 400);
    }

    try {
        const hashedPassword = await hashPassword(new_password);
        await c.env.DB.prepare(`UPDATE users SET password_hash = ? WHERE id = ?`).bind(hashedPassword, userId).run();
        return c.json({ success: true, message: 'Password berhasil diperbarui. Silakan gunakan password baru pada login berikutnya.' });
    } catch (error) {
        return c.json({ success: false, message: 'Terjadi kesalahan sistem' }, 500);
    }
});

export { accountApp };
