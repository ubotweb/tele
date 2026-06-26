import { Hono } from 'hono';
import { Env, JwtPayload } from '../types/index';

const productApp = new Hono<{ Bindings: Env, Variables: { user: JwtPayload } }>();

// Mendapatkan daftar produk milik tenant
productApp.get('/', async (c) => {
    const user = c.get('user');
    const db = c.env.DB;

    const products = await db.prepare(`SELECT * FROM products WHERE tenant_id = ? ORDER BY created_at DESC`)
        .bind(user.tenant_id)
        .all();

    return c.json({ success: true, data: products.results });
});

// Menambahkan produk baru
productApp.post('/', async (c) => {
    const user = c.get('user');
    const db = c.env.DB;
    const body = await c.req.json();
    
    const productId = crypto.randomUUID();

    try {
        await db.prepare(`
            INSERT INTO products (id, tenant_id, type, title, description, price, stock, h2h_api_url, h2h_api_key, is_active)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
            productId,
            user.tenant_id,
            body.type,
            body.title,
            body.description,
            body.price,
            body.stock || 0,
            body.h2h_api_url || null,
            body.h2h_api_key || null,
            body.is_active !== undefined ? body.is_active : 1
        ).run();

        return c.json({ success: true, message: 'Product created successfully', data: { id: productId } });
    } catch (error) {
        return c.json({ success: false, message: 'Failed to create product' }, 500);
    }
});

// Menghapus produk
productApp.delete('/:id', async (c) => {
    const user = c.get('user');
    const db = c.env.DB;
    const productId = c.req.param('id');

    // Filter tenant_id memastikan tenant hanya bisa menghapus produknya sendiri
    const result = await db.prepare(`DELETE FROM products WHERE id = ? AND tenant_id = ?`)
        .bind(productId, user.tenant_id)
        .run();

    if (result.meta.changes === 0) {
        return c.json({ success: false, message: 'Product not found or unauthorized' }, 404);
    }

    return c.json({ success: true, message: 'Product deleted successfully' });
});

export { productApp };
