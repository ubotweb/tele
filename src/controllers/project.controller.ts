import { Hono } from 'hono';
import { Env, JwtPayload } from '../types/index';

const projectApp = new Hono<{ Bindings: Env, Variables: { user: JwtPayload } }>();

// 1. Mendapatkan daftar seluruh project milik user
projectApp.get('/', async (c) => {
    const user = c.get('user');
    const db = c.env.DB;

    const projects = await db.prepare(`
        SELECT id, project_name, template_type, subscription_status, subscription_end_date, created_at 
        FROM projects 
        WHERE user_id = ? 
        ORDER BY created_at DESC
    `).bind(user.id).all();

    return c.json({ success: true, data: projects.results });
});

// 2. Mendapatkan detail satu spesifik project
projectApp.get('/:project_id', async (c) => {
    const user = c.get('user');
    const projectId = c.req.param('project_id');
    const db = c.env.DB;

    const project = await db.prepare(`
        SELECT id, project_name, template_type, subscription_status, subscription_end_date, created_at 
        FROM projects 
        WHERE id = ? AND user_id = ?
    `).bind(projectId, user.id).first();

    if (!project) {
        return c.json({ success: false, message: 'Project not found or unauthorized' }, 404);
    }

    return c.json({ success: true, data: project });
});

// 3. Membuat Project Bot Baru
projectApp.post('/', async (c) => {
    const user = c.get('user');
    const db = c.env.DB;
    const { project_name, template_type } = await c.req.json();
    
    if (!project_name) {
        return c.json({ success: false, message: 'Project name is required' }, 400);
    }

    const projectId = crypto.randomUUID();
    
    // Memberikan masa uji coba gratis (Trial) 7 Hari untuk setiap project baru
    const trialEndDate = new Date();
    trialEndDate.setDate(trialEndDate.getDate() + 7);
    const subscriptionEndDateStr = trialEndDate.toISOString();
    const finalTemplate = template_type || 'product_store';

    try {
        await db.prepare(`
            INSERT INTO projects (id, user_id, project_name, template_type, subscription_status, subscription_end_date, created_at)
            VALUES (?, ?, ?, ?, 'active', ?, CURRENT_TIMESTAMP)
        `).bind(projectId, user.id, project_name, finalTemplate, subscriptionEndDateStr).run();

        return c.json({ 
            success: true, 
            message: 'Project created successfully (7 Days Free Trial Active)', 
            data: { id: projectId } 
        });
    } catch (error) {
        return c.json({ success: false, message: 'Failed to create project' }, 500);
    }
});

// 4. Menghapus Project
projectApp.delete('/:project_id', async (c) => {
    const user = c.get('user');
    const projectId = c.req.param('project_id');
    const db = c.env.DB;

    const result = await db.prepare(`DELETE FROM projects WHERE id = ? AND user_id = ?`)
        .bind(projectId, user.id)
        .run();

    if (result.meta.changes === 0) {
        return c.json({ success: false, message: 'Project not found or unauthorized' }, 404);
    }

    return c.json({ success: true, message: 'Project deleted successfully' });
});

export { projectApp };
