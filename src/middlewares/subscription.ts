import { Context, Next } from 'hono';
import { Env, JwtPayload } from '../types/index';

export const subscriptionMiddleware = async (c: Context<{ Bindings: Env }>, next: Next) => {
    const user = c.get('user') as JwtPayload;
    
    if (!user || !user.tenant_id) {
        return c.json({ 
            success: false, 
            message: 'Forbidden: Tenant ID not found in token context' 
        }, 403);
    }

    try {
        const db = c.env.DB;
        const query = `SELECT subscription_status, subscription_end_date FROM tenants WHERE id = ?`;
        
        const tenant = await db.prepare(query)
            .bind(user.tenant_id)
            .first<{ subscription_status: string, subscription_end_date: string }>();

        if (!tenant) {
            return c.json({ success: false, message: 'Forbidden: Tenant record not found' }, 404);
        }

        if (tenant.subscription_status !== 'active') {
            return c.json({ success: false, message: 'Forbidden: Subscription is not active' }, 403);
        }

        const endDate = new Date(tenant.subscription_end_date);
        const now = new Date();

        if (endDate < now) {
            // Melakukan pembaruan otomatis ke status expired jika waktu terlewati
            await db.prepare(`UPDATE tenants SET subscription_status = 'expired' WHERE id = ?`)
                .bind(user.tenant_id)
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
