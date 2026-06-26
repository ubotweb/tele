import { Hono } from 'hono';
import { sign } from 'hono/jwt';
import { Env } from '../types/index';

const authApp = new Hono<{ Bindings: Env }>();

// Fungsi helper untuk hashing password di V8 Isolates
const hashPassword = async (password: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

authApp.post('/login', async (c) => {
    const { email, password } = await c.req.json();
    const db = c.env.DB;
    const secret = c.env.JWT_SECRET;

    try {
        const hashedPassword = await hashPassword(password);
        
        // Cek kredensial pengguna
        const user = await db.prepare(`SELECT id, role FROM users WHERE email = ? AND password_hash = ?`)
            .bind(email, hashedPassword)
            .first<{ id: string, role: 'admin' | 'tenant' }>();

        if (!user) {
            return c.json({ success: false, message: 'Invalid email or password' }, 401);
        }

        // Ambil data tenant jika role adalah tenant
        let tenantId = '';
        if (user.role === 'tenant') {
            const tenant = await db.prepare(`SELECT id FROM tenants WHERE user_id = ?`)
                .bind(user.id)
                .first<{ id: string }>();
                
            if (tenant) {
                tenantId = tenant.id;
            }
        }

        // Pembuatan Token JWT (HS256)
        const payload = {
            id: user.id,
            tenant_id: tenantId,
            role: user.role,
            exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // Kedaluwarsa 24 Jam
            iat: Math.floor(Date.now() / 1000)
        };

        const token = await sign(payload, secret, 'HS256');

        return c.json({
            success: true,
            message: 'Login successful',
            data: {
                token: token,
                role: user.role
            }
        });
    } catch (error) {
        return c.json({ success: false, message: 'Internal Server Error' }, 500);
    }
});

export { authApp };
