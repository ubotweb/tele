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

        // Pembuatan Token JWT (HS256) (Tanpa project_id karena 1 user = banyak project)
        const payload = {
            id: user.id,
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

authApp.post('/register', async (c) => {
    const { email, password } = await c.req.json();
    const db = c.env.DB;

    // 1. Validasi Input Dasar
    if (!email || !password) {
        return c.json({ success: false, message: 'Email dan password wajib diisi' }, 400);
    }

    try {
        // 2. Periksa apakah email sudah terdaftar
        const existingUser = await db.prepare(`SELECT id FROM users WHERE email = ?`)
            .bind(email)
            .first();

        if (existingUser) {
            return c.json({ success: false, message: 'Email sudah terdaftar digunakan' }, 400);
        }

        // 3. Generasi UUID dan Hashing Password
        const userId = crypto.randomUUID();
        const hashedPassword = await hashPassword(password);

        // 4. Masukkan data User baru
        await db.prepare(`
            INSERT INTO users (id, email, password_hash, role, created_at, updated_at)
            VALUES (?, ?, ?, 'tenant', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        `).bind(userId, email, hashedPassword).run();

        return c.json({
            success: true,
            message: 'Registrasi akun berhasil. Silakan masuk untuk membuat project.'
        });

    } catch (error) {
        console.error('Registration Error:', error);
        return c.json({ success: false, message: 'Gagal melakukan registrasi, kesalahan internal server' }, 500);
    }
});

export { authApp };
