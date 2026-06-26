export interface Env {
    DB: D1Database;
    JWT_SECRET: string;
    ENVIRONMENT: string;
    MAIN_DOMAIN: string;
}

export interface JwtPayload {
    id: string;        // ID Pengguna (User ID)
    tenant_id: string; // ID Toko/Tenant
    role: 'admin' | 'tenant';
    exp: number;       // Waktu kedaluwarsa token
    iat: number;       // Waktu token diterbitkan
}
