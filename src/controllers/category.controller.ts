import { Hono } from 'hono';
import { Env, JwtPayload } from '../types/index';

const categoryApp = new Hono<{ Bindings: Env, Variables: { user: JwtPayload } }>();

// Mendapatkan daftar kategori milik suatu project
categoryApp.get('/', async (c) => {
    const projectId = c.req.param('project_id');
    const db = c.env.DB;

    const categories = await db.prepare(`
        SELECT id, name, icon_url, is_active 
        FROM product_categories 
        WHERE project_id = ? 
        ORDER BY name ASC
    `).bind(projectId).all();

    return c.json({ success: true, data: categories.results });
});

// Menambahkan kategori baru
categoryApp.post('/', async (c) => {
    const projectId = c.req.param('project_id');
    const db = c.env.DB;
    const { name, icon_url } = await c.req.json();
    
    if (!name) {
        return c.json({ success: false, message: 'Category name is required' }, 400);
    }

    const categoryId = crypto.randomUUID();

    try {
        await db.prepare(`
            INSERT INTO product_categories (id, project_id, name, icon_url, is_active)
            VALUES (?, ?, ?, ?, 1)
        `).bind(categoryId, projectId, name, icon_url || null).run();

        return c.json({ success: true, message: 'Category created successfully', data: { id: categoryId } });
    } catch (error) {
        return c.json({ success: false, message: 'Failed to create category' }, 500);
    }
});

// Menghapus kategori
categoryApp.delete('/:id', async (c) => {
    const projectId = c.req.param('project_id');
    const categoryId = c.req.param('id');
    const db = c.env.DB;

    // Filter project_id memastikan isolasi data ketat
    const result = await db.prepare(`DELETE FROM product_categories WHERE id = ? AND project_id = ?`)
        .bind(categoryId, projectId)
        .run();

    if (result.meta.changes === 0) {
        return c.json({ success: false, message: 'Category not found or unauthorized' }, 404);
    }

    return c.json({ success: true, message: 'Category deleted successfully' });
});

export { categoryApp };
