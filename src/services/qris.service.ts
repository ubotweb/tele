export class QrisService {
    private readonly apiKey: string;
    private readonly apiUrl: string;

    constructor(apiKey: string, provider: 'xendit' | 'midtrans' | 'mock' = 'mock') {
        this.apiKey = apiKey;
        
        if (provider === 'xendit') {
            this.apiUrl = 'https://api.xendit.co/qr_codes';
        } else if (provider === 'midtrans') {
            this.apiUrl = 'https://api.midtrans.com/v2/charge';
        } else {
            this.apiUrl = 'mock';
        }
    }

    /**
     * Membangun muatan QRIS dinamis.
     * Mengembalikan String/URL gambar QR Code untuk diberikan kepada pembeli di Telegram.
     */
    async generateQris(transactionId: string, amount: number, storeName: string): Promise<string> {
        if (this.apiUrl === 'mock') {
            // Pengembalian mock untuk keperluan testing panel tanpa payment gateway nyata
            return `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=MOCK_QRIS_${transactionId}_AMOUNT_${amount}`;
        }

        try {
            // Implementasi Xendit sebagai contoh arsitektur H2H yang benar
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${btoa(this.apiKey + ':')}`
                },
                body: JSON.stringify({
                    reference_id: transactionId,
                    type: 'DYNAMIC',
                    currency: 'IDR',
                    amount: amount,
                    expires_at: new Date(Date.now() + 15 * 60000).toISOString(), // Kedaluwarsa dalam 15 menit
                })
            });

            if (!response.ok) {
                throw new Error('Payment Gateway Error');
            }

            const data = await response.json() as any;
            // Mengembalikan string QR string yang dapat dirender atau URL gambar dari Xendit
            return data.qr_string; 
        } catch (error) {
            console.error('QRIS Generation Failed:', error);
            throw new Error('Failed to generate QRIS');
        }
    }
}
