import { Context, Next } from 'hono';
import { Env, JwtPayload } from '../types/index';

export const subscriptionMiddleware = async (c: Context<{ Bindings: Env }>, next: Next) => {
    const user = c.get('user') as JwtPayload;
    
    // Mengambil project_id spesifik dari parameter URL
    const projectId = c.req.param('project_id');
    
    if (!projectId) {
        return c.json({ 
            success: false, 
            message: 'Bad Request: project_id is required in URL parameters' 
        }, 400);
    }

    try {
        const db = c.env.DB;
        
        // Memastikan project ada dan benar-benar milik user yang memiliki token JWT ini
        const project = await db.prepare(`SELECT subscription_status, subscription_end_date FROM projects WHERE id = ? AND user_id = ?`)
            .bind(projectId, user.id)
            .first<{ subscription_status: string, subscription_end_date: string }>();

        if (!project) {
            return c.json({ success: false, message: 'Forbidden: Project not found or unauthorized access' }, 403);
        }

        if (project.subscription_status !== 'active') {
            return c.json({ success: false, message: 'Forbidden: Project subscription is not active. Please renew.' }, 403);
        }

        const endDate = new Date(project.subscription_end_date);
        const now = new Date();

        if (endDate < now) {
            // Melakukan pembaruan otomatis ke status expired jika batas waktu terlewati
            await db.prepare(`UPDATE projects SET subscription_status = 'expired' WHERE id = ?`)
                .bind(projectId)
                .run();
                
            return c.json({ 
                success: false, 
                message: 'Forbidden: Subscription has expired. Please renew your plan.' 
            }, 403);
        }

        await next();
    } catch (error) {
        return c.json({ 
            success: false, 
            message: 'Internal Server Error during subscription validation' 
        }, 500);
    }
};
