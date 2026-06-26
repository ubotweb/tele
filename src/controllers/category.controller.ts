import { Hono } from 'hono';
import { Env, JwtPayload } from '../types/index';
import { CloudinaryService } from '../services/cloudinary.service';
import { SecurityHelper } from '../utils/encryption';

const categoryApp = new Hono<{ Bindings: Env, Variables: { user: JwtPayload } }>();

categoryApp.get('/', async (c) => {
    const projectId = c.req.param('project_id');
    const db = c.env.DB;

    const categories = await db.prepare(`
        SELECT id, name, icon_url, image_url, is_active 
        FROM product_categories 
        WHERE project_id = ? 
        ORDER BY name ASC
    `).bind(projectId).all();

    return c.json({ success: true, data: categories.results });
});

// Helper untuk Upload Cloudinary
async function handleImageUpload(c: any, projectId: string, file: File | null): Promise<string | null> {
    if (!file || typeof file === 'string') return null;
    
    const db = c.env.DB;
    const cloudConfig = await db.prepare(`SELECT cloud_name, api_key, api_secret FROM cloud_configs WHERE project_id = ?`).bind(projectId).first<any>();
    
    if (!cloudConfig) return null; // Jika tenant belum set cloudinary, skip upload

    try {
        const secret = c.env.JWT_SECRET;
        const decryptedSecret = await SecurityHelper.decryptText(cloudConfig.api_secret, secret);
        const uploader = new CloudinaryService(cloudConfig.cloud_name, cloudConfig.api_key, decryptedSecret);
        return await uploader.uploadFile(file as Blob, `categories/${projectId}`);
    } catch (e) {
        return null;
    }
}

// Create Category (Mendukung Form Data)
categoryApp.post('/', async (c) => {
    const projectId = c.req.param('project_id');
    const db = c.env.DB;
    
    const body = await c.req.parseBody();
    const name = body['name'] as string;
    const imageFile = body['image'] as File | null;
    
    if (!name) return c.json({ success: false, message: 'Category name is required' }, 400);

    const categoryId = crypto.randomUUID();
    const imageUrl = await handleImageUpload(c, projectId, imageFile);

    try {
        await db.prepare(`
            INSERT INTO product_categories (id, project_id, name, image_url, is_active)
            VALUES (?, ?, ?, ?, 1)
        `).bind(categoryId, projectId, name, imageUrl).run();

        return c.json({ success: true, message: 'Category created' });
    } catch (error) {
        return c.json({ success: false, message: 'Failed to create category' }, 500);
    }
});

// Update Category
categoryApp.put('/:id', async (c) => {
    const projectId = c.req.param('project_id');
    const categoryId = c.req.param('id');
    const db = c.env.DB;
    
    const body = await c.req.parseBody();
    const name = body['name'] as string;
    const imageFile = body['image'] as File | null;

    if (!name) return c.json({ success: false, message: 'Category name is required' }, 400);

    let query = `UPDATE product_categories SET name = ? WHERE id = ? AND project_id = ?`;
    let binds: any[] = [name, categoryId, projectId];

    const imageUrl = await handleImageUpload(c, projectId, imageFile);
    if (imageUrl) {
        query = `UPDATE product_categories SET name = ?, image_url = ? WHERE id = ? AND project_id = ?`;
        binds = [name, imageUrl, categoryId, projectId];
    }

    try {
        const result = await db.prepare(query).bind(...binds).run();
        if (result.meta.changes === 0) return c.json({ success: false, message: 'Not found' }, 404);
        return c.json({ success: true, message: 'Category updated' });
    } catch (error) {
        return c.json({ success: false, message: 'Failed to update category' }, 500);
    }
});

categoryApp.delete('/:id', async (c) => {
    const projectId = c.req.param('project_id');
    const categoryId = c.req.param('id');
    const db = c.env.DB;

    const result = await db.prepare(`DELETE FROM product_categories WHERE id = ? AND project_id = ?`).bind(categoryId, projectId).run();
    if (result.meta.changes === 0) return c.json({ success: false, message: 'Category not found' }, 404);
    return c.json({ success: true, message: 'Category deleted successfully' });
});

export { categoryApp };
