export class SecurityHelper {
    /**
     * Mengenkripsi teks menggunakan AES-GCM (Web Crypto API)
     * Sangat direkomendasikan untuk menyimpan token/secret di database
     */
    static async encryptText(text: string, secretKey: string): Promise<string> {
        const encoder = new TextEncoder();
        const data = encoder.encode(text);
        
        // Memastikan panjang kunci tepat 32 byte (256 bit) untuk AES-256
        const paddedSecret = secretKey.padEnd(32, '0').slice(0, 32);
        const keyMaterial = await crypto.subtle.importKey(
            "raw",
            encoder.encode(paddedSecret),
            { name: "AES-GCM" },
            false,
            ["encrypt", "decrypt"]
        );

        // Vector Inisialisasi (IV) acak untuk keamanan tambahan
        const iv = crypto.getRandomValues(new Uint8Array(12));
        const encrypted = await crypto.subtle.encrypt(
            { name: "AES-GCM", iv: iv },
            keyMaterial,
            data
        );

        // Menggabungkan IV dan Ciphertext menjadi format string Hex
        const ivHex = Array.from(iv).map(b => b.toString(16).padStart(2, '0')).join('');
        const cipherHex = Array.from(new Uint8Array(encrypted)).map(b => b.toString(16).padStart(2, '0')).join('');
        
        return `${ivHex}:${cipherHex}`;
    }

    /**
     * Mendekripsi teks yang sebelumnya dienkripsi menggunakan AES-GCM
     */
    static async decryptText(encryptedText: string, secretKey: string): Promise<string> {
        try {
            const [ivHex, cipherHex] = encryptedText.split(':');
            if (!ivHex || !cipherHex) {
                throw new Error('Format teks terenkripsi tidak valid');
            }

            const iv = new Uint8Array(ivHex.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));
            const ciphertext = new Uint8Array(cipherHex.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));

            const encoder = new TextEncoder();
            const paddedSecret = secretKey.padEnd(32, '0').slice(0, 32);
            const keyMaterial = await crypto.subtle.importKey(
                "raw",
                encoder.encode(paddedSecret),
                { name: "AES-GCM" },
                false,
                ["encrypt", "decrypt"]
            );

            const decrypted = await crypto.subtle.decrypt(
                { name: "AES-GCM", iv: iv },
                keyMaterial,
                ciphertext
            );

            const decoder = new TextDecoder();
            return decoder.decode(decrypted);
        } catch (error) {
            console.error("Proses dekripsi gagal:", error);
            throw new Error("Gagal membuka data rahasia");
        }
    }
}
