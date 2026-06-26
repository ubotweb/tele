import { Hono } from 'hono';
import { Env } from './types/index';
import { authMiddleware } from './middlewares/auth';
import { subscriptionMiddleware } from './middlewares/subscription';

// Import Controllers
import { authApp } from './controllers/auth.controller';
import { botApp } from './controllers/bot.controller';
import { productApp } from './controllers/product.controller';
import { orderApp } from './controllers/order.controller';

// Hono Instance Utama untuk API
const apiApp = new Hono<{ Bindings: Env }>();

// 1. Rute Publik (Tanpa Autentikasi)
apiApp.route('/auth', authApp);

// Rute Webhook (Publik, diproteksi menggunakan token secret dari provider / Telegram)
apiApp.route('/orders', orderApp);

// 2. Rute Privat (Membutuhkan Login)
apiApp.use('/tenant/*', authMiddleware);

// 3. Rute Super Ketat (Membutuhkan Login DAN Langganan Aktif)
apiApp.use('/tenant/bots/*', subscriptionMiddleware);
apiApp.use('/tenant/products/*', subscriptionMiddleware);

// 4. Mounting Rute Privat
apiApp.route('/tenant/bots', botApp);
apiApp.route('/tenant/products', productApp);

// Fallback endpoint
apiApp.get('/', (c) => c.json({ success: true, message: 'SaaS Bot Panel API v1.0 running smoothly' }));

export default apiApp;
