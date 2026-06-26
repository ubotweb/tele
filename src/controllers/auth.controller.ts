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

// Tambahkan endpoint ini di dalam file src/controllers/auth.controller.ts

authApp.post('/register', async (c) => {
    const { email, password, store_name } = await c.req.json();
    const db = c.env.DB;

    // 1. Validasi Input Dasar
    if (!email || !password || !store_name) {
        return c.json({ success: false, message: 'Email, password, dan nama toko wajib diisi' }, 400);
    }

    try {
        // 2. Periksa apakah email sudah terdaftar
        const existingUser = await db.prepare(`SELECT id FROM users WHERE email = ?`)
            .bind(email)
            .first();

        if (existingUser) {
            return c.json({ success: false, message: 'Email sudah terdaftar digunakan' }, 400);
        }

        // 3. Generasi UUID dan Hashing Password menggunakan Web Crypto API (V8 Native)
        const userId = crypto.randomUUID();
        const tenantId = crypto.randomUUID();
        const hashedPassword = await hashPassword(password);

        // Memberikan trial aktif selama 7 hari sejak pendaftaran secara default
        const trialEndDate = new Date();
        trialEndDate.setDate(trialEndDate.getDate() + 7);
        const subscriptionEndDateStr = trialEndDate.toISOString();

        // 4. Eksekusi Batch ke Cloudflare D1 (Menjaga Konsistensi Relasi Data)
        await db.batch([
            db.prepare(`
                INSERT INTO users (id, email, password_hash, role, created_at, updated_at)
                VALUES (?, ?, ?, 'tenant', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            `).bind(userId, email, hashedPassword),
            
            db.prepare(`
                INSERT INTO tenants (id, user_id, store_name, subscription_status, subscription_end_date, created_at)
                VALUES (?, ?, ?, 'active', ?, CURRENT_TIMESTAMP)
            `).bind(tenantId, userId, store_name, subscriptionEndDateStr)
        ]);

        return c.json({
            success: true,
            message: 'Registrasi tenant berhasil. Silakan masuk ke akun Anda.'
        });

    } catch (error) {
        console.error('Registration Error:', error);
        return c.json({ success: false, message: 'Gagal melakukan registrasi, kesalahan internal server' }, 500);
    }
});
export { authApp };
