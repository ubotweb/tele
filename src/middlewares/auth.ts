import { Context, Next } from 'hono';
import { verify } from 'hono/jwt';
import { Env, JwtPayload } from '../types/index';

export const authMiddleware = async (c: Context<{ Bindings: Env }>, next: Next) => {
    const secret = c.env.JWT_SECRET;
    
    if (!secret) {
        return c.json({ 
            success: false, 
            message: 'Server Configuration Error: Missing JWT_SECRET' 
        }, 500);
    }
    
    const authHeader = c.req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return c.json({ 
            success: false, 
            message: 'Unauthorized: Missing or invalid authentication token' 
        }, 401);
    }

    const token = authHeader.split(' ')[1];

    try {
        // Verifikasi ketat menggunakan algoritma HS256 secara eksplisit
        const payload = await verify(token, secret, 'HS256') as JwtPayload;
        
        // Memasukkan data pengguna ke dalam context untuk diakses oleh controller
        c.set('user', payload);
        
        await next();
    } catch (error) {
        return c.json({ 
            success: false, 
            message: 'Unauthorized: Token is invalid, tampered, or expired' 
        }, 401);
    }
};
