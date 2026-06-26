import { SecurityHelper } from '../utils/encryption';

export class H2hService {
    /**
     * Memproses transaksi H2H ke server vendor pihak ketiga
     */
    static async processOrder(
        apiUrl: string, 
        encryptedApiKey: string, 
        masterSecret: string, 
        targetData: string // Contoh: Nomor HP atau ID Game pembeli
    ): Promise<boolean> {
        try {
            // 1. Dekripsi API Key H2H menggunakan Master Secret
            const apiKey = await SecurityHelper.decryptText(encryptedApiKey, masterSecret);

            // 2. Memanggil API Vendor (Contoh implementasi standar industri)
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    target: targetData,
                    timestamp: new Date().toISOString()
                })
            });

            if (!response.ok) {
                console.error(`H2H API Error: ${response.statusText}`);
                return false;
            }

            const data = await response.json() as any;
            
            // Asumsi vendor mengembalikan status 'success'
            return data.status === 'success';
        } catch (error) {
            console.error('H2H Processing Failed:', error);
            return false;
        }
    }
}
