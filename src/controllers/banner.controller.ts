import { Hono } from 'hono';
import { Env, JwtPayload } from '../types/index';
import { CloudinaryService } from '../services/cloudinary.service';
import { SecurityHelper } from '../utils/encryption';

const bannerApp = new Hono<{ Bindings: Env, Variables: { user: JwtPayload } }>();

async function handleBannerUpload(c: any, projectId: string, file: File | null): Promise<string | null> {
    if (!file || typeof file === 'string') return null;
    const db = c.env.DB;
    const cloudConfig = await db.prepare(`SELECT cloud_name, api_key, api_secret FROM cloud_configs WHERE project_id = ?`).bind(projectId).first<any>();
    if (!cloudConfig) return null;

    try {
        const secret = c.env.JWT_SECRET;
        const decryptedSecret = await SecurityHelper.decryptText(cloudConfig.api_secret, secret);
        const uploader = new CloudinaryService(cloudConfig.cloud_name, cloudConfig.api_key, decryptedSecret);
        return await uploader.uploadFile(file as Blob, `banners/${projectId}`);
    } catch (e) {
        return null;
    }
}

bannerApp.get('/', async (c) => {
    const projectId = c.req.param('project_id');
    const banners = await c.env.DB.prepare(`SELECT * FROM banners WHERE project_id = ? ORDER BY created_at DESC`).bind(projectId).all();
    return c.json({ success: true, data: banners.results });
});

bannerApp.post('/', async (c) => {
    const projectId = c.req.param('project_id');
    const db = c.env.DB;
    const body = await c.req.parseBody();
    
    const imageFile = body['image'] as File | null;
    if (!imageFile) return c.json({ success: false, message: 'Image file is required' }, 400);

    const imageUrl = await handleBannerUpload(c, projectId, imageFile);
    if (!imageUrl) return c.json({ success: false, message: 'Failed to upload image. Check Cloudinary settings.' }, 500);

    const bannerId = crypto.randomUUID();

    try {
        await db.prepare(`
            INSERT INTO banners (id, project_id, title, image_url, target_url, is_active)
            VALUES (?, ?, ?, ?, ?, 1)
        `).bind(bannerId, projectId, body['title'] || '', imageUrl, body['target_url'] || null).run();

        return c.json({ success: true, message: 'Banner added successfully' });
    } catch (error) {
        return c.json({ success: false, message: 'Database error' }, 500);
    }
});

bannerApp.put('/:id', async (c) => {
    const projectId = c.req.param('project_id');
    const bannerId = c.req.param('id');
    const db = c.env.DB;
    const body = await c.req.parseBody();
    
    const imageFile = body['image'] as File | null;
    const newImageUrl = await handleBannerUpload(c, projectId, imageFile);

    let query = `UPDATE banners SET title = ?, target_url = ? WHERE id = ? AND project_id = ?`;
    let binds: any[] = [body['title'] || '', body['target_url'] || null, bannerId, projectId];

    if (newImageUrl) {
        query = `UPDATE banners SET title = ?, target_url = ?, image_url = ? WHERE id = ? AND project_id = ?`;
        binds = [body['title'] || '', body['target_url'] || null, newImageUrl, bannerId, projectId];
    }

    await db.prepare(query).bind(...binds).run();
    return c.json({ success: true, message: 'Banner updated successfully' });
});

bannerApp.delete('/:id', async (c) => {
    const projectId = c.req.param('project_id');
    const bannerId = c.req.param('id');
    await c.env.DB.prepare(`DELETE FROM banners WHERE id = ? AND project_id = ?`).bind(bannerId, projectId).run();
    return c.json({ success: true, message: 'Banner deleted' });
});

export { bannerApp };
