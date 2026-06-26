export class CloudinaryService {
    constructor(
        private readonly cloudName: string,
        private readonly apiKey: string,
        private readonly apiSecret: string
    ) {}

    async uploadFile(file: Blob, folder: string): Promise<string | null> {
        const url = `https://api.cloudinary.com/v1_1/${this.cloudName}/upload`;
        const timestamp = Math.round((new Date()).getTime() / 1000).toString();
        
        // Membangun signature menggunakan Web Crypto API untuk Cloudflare Workers
        const encoder = new TextEncoder();
        const dataToSign = `folder=${folder}&timestamp=${timestamp}${this.apiSecret}`;
        const data = encoder.encode(dataToSign);
        
        const hashBuffer = await crypto.subtle.digest('SHA-1', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const signature = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

        const formData = new FormData();
        formData.append('file', file);
        formData.append('api_key', this.apiKey);
        formData.append('timestamp', timestamp);
        formData.append('signature', signature);
        formData.append('folder', folder);

        try {
            const response = await fetch(url, {
                method: 'POST',
                body: formData
            });
            
            if (!response.ok) {
                return null;
            }
            
            const result = await response.json() as any;
            return result.secure_url;
        } catch (error) {
            return null;
        }
    }
}
