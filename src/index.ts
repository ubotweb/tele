import { Hono } from 'hono';
import { Env } from './types/index';
import { authMiddleware } from './middlewares/auth';
import { subscriptionMiddleware } from './middlewares/subscription';

// Import Controllers
import { authApp } from './controllers/auth.controller';
import { projectApp } from './controllers/project.controller';
import { botApp } from './controllers/bot.controller';
import { categoryApp } from './controllers/category.controller';
import { bannerApp } from './controllers/banner.controller';
import { commandApp } from './controllers/command.controller';

// Hono Instance Utama untuk API
const apiApp = new Hono<{ Bindings: Env }>();

// 1. Rute Publik (Tanpa Autentikasi)
apiApp.route('/auth', authApp);

// 2. Rute Privat Tingkat Pengguna (Hanya butuh Login)
apiApp.use('/projects/*', authMiddleware);
apiApp.route('/projects', projectApp);

// 3. Rute Privat Tingkat Project (Butuh Login DAN Langganan Aktif per Project)
apiApp.use('/projects/:project_id/bot/*', subscriptionMiddleware);
apiApp.use('/projects/:project_id/categories/*', subscriptionMiddleware);
apiApp.use('/projects/:project_id/banners/*', subscriptionMiddleware);
apiApp.use('/projects/:project_id/commands/*', subscriptionMiddleware);
// (Product dan Order controller akan disesuaikan di file berikutnya)

// 4. Mounting Rute Spesifik Project
apiApp.route('/projects/:project_id/bot', botApp);
apiApp.route('/projects/:project_id/categories', categoryApp);
apiApp.route('/projects/:project_id/banners', bannerApp);
apiApp.route('/projects/:project_id/commands', commandApp);

// Fallback endpoint
apiApp.get('/', (c) => c.json({ success: true, message: 'SaaS Bot Panel API V2 running smoothly' }));

export default apiApp;
