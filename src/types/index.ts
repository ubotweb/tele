export interface Env {
    DB: D1Database;
    JWT_SECRET: string;
    ENVIRONMENT: string;
    MAIN_DOMAIN: string;
    TIKTOK_APP_KEY: string;
    TIKTOK_APP_SECRET: string;
}

export interface JwtPayload {
    id: string;        // ID Pengguna Utama (User ID)
    role: 'admin' | 'tenant';
    exp: number;       // Waktu kedaluwarsa token
    iat: number;       // Waktu token diterbitkan
}
