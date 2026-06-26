import { Hono } from 'hono';
import { Env, JwtPayload } from '../types/index';
import { SecurityHelper } from '../utils/encryption';

const cloudApp = new Hono<{ Bindings: Env, Variables: { user: JwtPayload } }>();

// Mendapatkan konfigurasi Cloudinary pengguna (Tanpa mengembalikan secret key)
cloudApp.get('/', async (c) => {
    const user = c.get('user');
    const db = c.env.DB;

    const config = await db.prepare(`SELECT cloud_name, api_key FROM cloudinary_configs WHERE tenant_id = ?`)
        .bind(user.tenant_id)
        .first();

    return c.json({ success: true, data: config || null });
});

// Menyimpan atau memperbarui konfigurasi Cloudinary
cloudApp.post('/', async (c) => {
    const user = c.get('user');
    const db = c.env.DB;
    const secretKey = c.env.JWT_SECRET;
    const { cloud_name, api_key, api_secret } = await c.req.json();

    try {
        // Enkripsi API Secret menggunakan master key server sebelum disimpan
        const encryptedSecret = await SecurityHelper.encryptText(api_secret, secretKey);

        await db.prepare(`
            INSERT INTO cloudinary_configs (id, tenant_id, cloud_name, api_key, api_secret)
            VALUES (?, ?, ?, ?, ?)
            ON CONFLICT(tenant_id) DO UPDATE SET
            cloud_name = excluded.cloud_name,
            api_key = excluded.api_key,
            api_secret = excluded.api_secret
        `).bind(crypto.randomUUID(), user.tenant_id, cloud_name, api_key, encryptedSecret).run();

        return c.json({ success: true, message: 'Cloud configuration saved securely' });
    } catch (error) {
        return c.json({ success: false, message: 'Failed to save configuration' }, 500);
    }
});

export { cloudApp };
