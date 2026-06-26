export class TelegramService {
    private readonly baseUrl: string;

    constructor(private readonly botToken: string) {
        this.baseUrl = `https://api.telegram.org/bot${this.botToken}`;
    }

    async getMe(): Promise<any> {
        const response = await fetch(`${this.baseUrl}/getMe`, { method: 'GET' });
        return await response.json();
    }

    async setWebhook(url: string, secretToken: string): Promise<boolean> {
        const response = await fetch(`${this.baseUrl}/setWebhook`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                url: url,
                secret_token: secretToken,
                drop_pending_updates: true
            })
        });
        const data = await response.json() as any;
        return data.ok;
    }

    async setMyName(name: string): Promise<boolean> {
        const response = await fetch(`${this.baseUrl}/setMyName`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name })
        });
        const data = await response.json() as any;
        return data.ok;
    }

    async setMyDescription(description: string): Promise<boolean> {
        const response = await fetch(`${this.baseUrl}/setMyDescription`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ description })
        });
        const data = await response.json() as any;
        return data.ok;
    }

    async sendMessage(chatId: string | number, text: string): Promise<boolean> {
        const response = await fetch(`${this.baseUrl}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: text,
                parse_mode: 'HTML'
            })
        });
        const data = await response.json() as any;
        return data.ok;
    }
}
