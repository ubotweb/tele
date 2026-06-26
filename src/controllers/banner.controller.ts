import { Hono } from 'hono';
import { Env, JwtPayload } from '../types/index';

const bannerApp = new Hono<{ Bindings: Env, Variables: { user: JwtPayload } }>();

bannerApp.get('/', async (c) => {
    const projectId = c.req.param('project_id');
    const db = c.env.DB;

    const banners = await db.prepare(`
        SELECT id, title, image_url, target_url, is_active 
        FROM banners 
        WHERE project_id = ? 
        ORDER BY created_at DESC
    `).bind(projectId).all();

    return c.json({ success: true, data: banners.results });
});

bannerApp.post('/', async (c) => {
    const projectId = c.req.param('project_id');
    const db = c.env.DB;
    const { title, image_url, target_url } = await c.req.json();
    
    if (!image_url) {
        return c.json({ success: false, message: 'Image URL is required' }, 400);
    }

    const bannerId = crypto.randomUUID();

    try {
        await db.prepare(`
            INSERT INTO banners (id, project_id, title, image_url, target_url, is_active)
            VALUES (?, ?, ?, ?, ?, 1)
        `).bind(bannerId, projectId, title || null, image_url, target_url || null).run();

        return c.json({ success: true, message: 'Banner added successfully' });
    } catch (error) {
        return c.json({ success: false, message: 'Failed to add banner' }, 500);
    }
});

bannerApp.delete('/:id', async (c) => {
    const projectId = c.req.param('project_id');
    const bannerId = c.req.param('id');
    const db = c.env.DB;

    const result = await db.prepare(`DELETE FROM banners WHERE id = ? AND project_id = ?`)
        .bind(bannerId, projectId)
        .run();

    if (result.meta.changes === 0) {
        return c.json({ success: false, message: 'Banner not found or unauthorized' }, 404);
    }

    return c.json({ success: true, message: 'Banner deleted successfully' });
});

export { bannerApp };
