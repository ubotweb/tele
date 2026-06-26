import { Hono } from 'hono';
import { createApp } from 'honox/server';
import apiApp from '../src/index';

const app = new Hono();

// 1. Memuat seluruh rute Backend API ke dalam jalur /api
app.route('/api', apiApp);

// 2. Menginisialisasi HonoX untuk Frontend Rendering
const frontendApp = createApp();

// 3. Memuat rute antarmuka pengguna di jalur root (/)
app.route('/', frontendApp);

export default app;
