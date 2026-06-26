import { createRoute } from 'honox/factory';

export default createRoute((c) => {
    return c.render(
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Telegram Bot Setup</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Configure the bot specifically for this project.</p>
            </div>

            <form id="bot-form" className="space-y-5 max-w-2xl bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-100 dark:border-gray-700">
                <div>
                    <label htmlFor="bot_token" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Bot Token API</label>
                    <input type="text" id="bot_token" required placeholder="1234567890:AAH_XXXXXXXXXXXX_XXXXXX" className="mt-1 block w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-darkbg text-gray-900 dark:text-white focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all" />
                    <p className="text-xs text-gray-500 mt-1">Obtained from @BotFather in Telegram.</p>
                </div>

                <div>
                    <label htmlFor="bot_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Bot Display Name</label>
                    <input type="text" id="bot_name" placeholder="My Store Bot" className="mt-1 block w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-darkbg text-gray-900 dark:text-white focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all" />
                </div>

                <div>
                    <label htmlFor="bot_description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Bot Description</label>
                    <textarea id="bot_description" rows={3} placeholder="Welcome to our automated digital store!" className="mt-1 block w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-darkbg text-gray-900 dark:text-white focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all"></textarea>
                </div>

                <button type="submit" id="btn-save-bot" className="inline-flex justify-center py-2.5 px-6 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-brand hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand transition-colors">
                    Save & Activate Webhook
                </button>
            </form>

            <script dangerouslySetInnerHTML={{ __html: `
                async function loadBotConfig() {
                    const token = localStorage.getItem('auth_token');
                    const projectId = window.CURRENT_PROJECT_ID;
                    try {
                        const res = await fetch('/api/projects/' + projectId + '/bot', {
                            headers: { 'Authorization': 'Bearer ' + token }
                        });
                        const data = await res.json();
                        if (data.success && data.data) {
                            document.getElementById('bot_token').value = data.data.bot_token || '';
                        }
                    } catch (e) {
                        console.error('Failed to load bot config');
                    }
                }

                document.addEventListener('DOMContentLoaded', loadBotConfig);

                document.getElementById('bot-form').addEventListener('submit', async (e) => {
                    e.preventDefault();
                    const btn = document.getElementById('btn-save-bot');
                    const bot_token = document.getElementById('bot_token').value;
                    const bot_name = document.getElementById('bot_name').value;
                    const bot_description = document.getElementById('bot_description').value;
                    const token = localStorage.getItem('auth_token');
                    const projectId = window.CURRENT_PROJECT_ID;
                    
                    btn.disabled = true;
                    btn.innerText = 'Applying Configuration...';

                    try {
                        const response = await fetch('/api/projects/' + projectId + '/bot/update', {
                            method: 'POST',
                            headers: { 
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer ' + token
                            },
                            body: JSON.stringify({ bot_token, bot_name, bot_description })
                        });
                        
                        const result = await response.json();
                        
                        if (result.success) {
                            window.showToast(result.message, 'success');
                        } else {
                            window.showToast(result.message || 'Configuration failed', 'error');
                        }
                    } catch (error) {
                        window.showToast('Network error occurred', 'error');
                    } finally {
                        btn.disabled = false;
                        btn.innerText = 'Save & Activate Webhook';
                    }
                });
            `}} />
        </div>,
        { title: 'Bot Configuration' }
    );
});
