import { Hono } from 'hono';
import { Env } from './types/index';
import { authMiddleware } from './middlewares/auth';
import { subscriptionMiddleware } from './middlewares/subscription';

import { authApp } from './controllers/auth.controller';
import { projectApp } from './controllers/project.controller';
import { botApp } from './controllers/bot.controller';
import { categoryApp } from './controllers/category.controller';
import { bannerApp } from './controllers/banner.controller';
import { commandApp } from './controllers/command.controller';
import { webhookApp } from './controllers/webhook.controller';
import { adminApp } from './controllers/admin.controller';
import { productApp } from './controllers/product.controller';
import { transactionApp } from './controllers/transaction.controller';
import { orderApp } from './controllers/order.controller';
import { cloudApp } from './controllers/cloud.controller';
import { accountApp } from './controllers/account.controller';

const apiApp = new Hono<{ Bindings: Env }>();

// Rute Publik
apiApp.route('/auth', authApp);
apiApp.route('/webhook', webhookApp);
apiApp.route('/orders', orderApp);

// Rute Super Admin
apiApp.use('/admin/*', authMiddleware);
apiApp.route('/admin', adminApp);

// Rute Level Akun (Tenant)
apiApp.use('/projects/*', authMiddleware);
apiApp.route('/projects', projectApp);

apiApp.use('/cloud/*', authMiddleware);
apiApp.route('/cloud', cloudApp);

apiApp.use('/account/*', authMiddleware);
apiApp.route('/account', accountApp);

// Rute Level Project (Proteksi Langganan)
apiApp.use('/projects/:project_id/bot/*', subscriptionMiddleware);
apiApp.use('/projects/:project_id/categories/*', subscriptionMiddleware);
apiApp.use('/projects/:project_id/banners/*', subscriptionMiddleware);
apiApp.use('/projects/:project_id/commands/*', subscriptionMiddleware);
apiApp.use('/projects/:project_id/products/*', subscriptionMiddleware);
apiApp.use('/projects/:project_id/transactions/*', subscriptionMiddleware);

apiApp.route('/projects/:project_id/bot', botApp);
apiApp.route('/projects/:project_id/categories', categoryApp);
apiApp.route('/projects/:project_id/banners', bannerApp);
apiApp.route('/projects/:project_id/commands', commandApp);
apiApp.route('/projects/:project_id/products', productApp);
apiApp.route('/projects/:project_id/transactions', transactionApp);

apiApp.get('/', (c) => c.json({ success: true, message: 'SaaS Bot API V2' }));

export default apiApp;
