import { Hono } from 'hono';
import { Env, JwtPayload } from '../types/index';
import { CloudinaryService } from '../services/cloudinary.service';
import { SecurityHelper } from '../utils/encryption';

const productApp = new Hono<{ Bindings: Env, Variables: { user: JwtPayload } }>();

async function handleImageUpload(c: any, projectId: string, file: File | null): Promise<string | null> {
    if (!file || typeof file === 'string') return null;
    
    const db = c.env.DB;
    const cloudConfig = await db.prepare(`SELECT cloud_name, api_key, api_secret FROM cloud_configs WHERE project_id = ?`).bind(projectId).first<any>();
    
    if (!cloudConfig) return null;

    try {
        const secret = c.env.JWT_SECRET;
        const decryptedSecret = await SecurityHelper.decryptText(cloudConfig.api_secret, secret);
        const uploader = new CloudinaryService(cloudConfig.cloud_name, cloudConfig.api_key, decryptedSecret);
        return await uploader.uploadFile(file as Blob, `products/${projectId}`);
    } catch (e) {
        return null;
    }
}

// 1. Read
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

// 2. Create
productApp.post('/', async (c) => {
    const projectId = c.req.param('project_id');
    const db = c.env.DB;
    
    const body = await c.req.parseBody();
    const productId = crypto.randomUUID();
    
    const imageFile = body['image'] as File | null;
    const iconUrl = await handleImageUpload(c, projectId, imageFile);

    try {
        await db.prepare(`
            INSERT INTO products (id, project_id, category_id, type, title, description, price, stock, icon_url, h2h_api_url, h2h_api_key, is_active)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
            productId,
            projectId,
            body['category_id'],
            body['type'],
            body['title'],
            body['description'] || '',
            parseFloat(body['price'] as string),
            parseInt((body['stock'] as string) || '0'),
            iconUrl, // Menyimpan hasil upload ke field icon_url
            body['h2h_api_url'] || null,
            body['h2h_api_key'] || null,
            1
        ).run();

        return c.json({ success: true, message: 'Product created successfully' });
    } catch (error) {
        return c.json({ success: false, message: 'Failed to create product' }, 500);
    }
});

// 3. Update
productApp.put('/:id', async (c) => {
    const projectId = c.req.param('project_id');
    const productId = c.req.param('id');
    const db = c.env.DB;
    
    const body = await c.req.parseBody();
    const imageFile = body['image'] as File | null;
    
    // Upload gambar baru jika ada
    const newIconUrl = await handleImageUpload(c, projectId, imageFile);

    let query = `UPDATE products SET category_id = ?, type = ?, title = ?, description = ?, price = ?, stock = ? WHERE id = ? AND project_id = ?`;
    let binds: any[] = [
        body['category_id'], body['type'], body['title'], body['description'] || '', 
        parseFloat(body['price'] as string), parseInt((body['stock'] as string) || '0'), 
        productId, projectId
    ];

    if (newIconUrl) {
        query = `UPDATE products SET category_id = ?, type = ?, title = ?, description = ?, price = ?, stock = ?, icon_url = ? WHERE id = ? AND project_id = ?`;
        binds = [
            body['category_id'], body['type'], body['title'], body['description'] || '', 
            parseFloat(body['price'] as string), parseInt((body['stock'] as string) || '0'), 
            newIconUrl, productId, projectId
        ];
    }

    try {
        const result = await db.prepare(query).bind(...binds).run();
        if (result.meta.changes === 0) return c.json({ success: false, message: 'Product not found' }, 404);
        return c.json({ success: true, message: 'Product updated successfully' });
    } catch (error) {
        return c.json({ success: false, message: 'Failed to update product' }, 500);
    }
});

// 4. Delete
productApp.delete('/:id', async (c) => {
    const projectId = c.req.param('project_id');
    const productId = c.req.param('id');
    const db = c.env.DB;

    const result = await db.prepare(`DELETE FROM products WHERE id = ? AND project_id = ?`).bind(productId, projectId).run();
    if (result.meta.changes === 0) return c.json({ success: false, message: 'Product not found' }, 404);
    return c.json({ success: true, message: 'Product deleted successfully' });
});

export { productApp };
