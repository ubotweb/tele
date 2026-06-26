import { Hono } from 'hono';
import { Env, JwtPayload } from '../types/index';

const productApp = new Hono<{ Bindings: Env, Variables: { user: JwtPayload } }>();

// Mendapatkan daftar produk milik suatu project spesifik
productApp.get('/', async (c) => {
    const projectId = c.req.param('project_id');
    const db = c.env.DB;

    const products = await db.prepare(`
        SELECT p.*, c.name as category_name
        FROM products p
        LEFT JOIN product_categories c ON p.category_id = c.id
        WHERE p.project_id = ? 
        ORDER BY p.created_at DESC
    `).bind(projectId).all();

    return c.json({ success: true, data: products.results });
});

// Menambahkan produk baru ke project
productApp.post('/', async (c) => {
    const projectId = c.req.param('project_id');
    const db = c.env.DB;
    const body = await c.req.json();
    
    const productId = crypto.randomUUID();

    try {
        await db.prepare(`
            INSERT INTO products (id, project_id, category_id, type, title, description, price, stock, icon_url, h2h_api_url, h2h_api_key, is_active)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
            productId,
            projectId,
            body.category_id,
            body.type,
            body.title,
            body.description,
            body.price,
            body.stock || 0,
            body.icon_url || null,
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
    const projectId = c.req.param('project_id');
    const db = c.env.DB;
    const productId = c.req.param('id');

    // Filter project_id memastikan tenant hanya bisa menghapus produk di project miliknya
    const result = await db.prepare(`DELETE FROM products WHERE id = ? AND project_id = ?`)
        .bind(productId, projectId)
        .run();

    if (result.meta.changes === 0) {
        return c.json({ success: false, message: 'Product not found or unauthorized' }, 404);
    }

    return c.json({ success: true, message: 'Product deleted successfully' });
});

export { productApp };
