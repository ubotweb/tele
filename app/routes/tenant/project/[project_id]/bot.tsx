import { createRoute } from 'honox/factory';

export default createRoute((c) => {
    return c.render(
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Telegram Bot Setup</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Configure bot credentials, admin access, and affiliate system.</p>
            </div>

            <form id="bot-form" className="space-y-6 max-w-3xl bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-100 dark:border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Bot Token API</label>
                        <input type="text" id="bot_token" required placeholder="1234567890:AAH_XXXXXXXXXXXX_XXXXXX" className="mt-1 block w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-darkbg text-gray-900 dark:text-white focus:ring-2 focus:ring-brand outline-none transition-all" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Bot Display Name</label>
                        <input type="text" id="display_name" placeholder="My Store Bot" className="mt-1 block w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-darkbg text-gray-900 dark:text-white focus:ring-2 focus:ring-brand outline-none transition-all" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Admin Telegram ID</label>
                        <input type="text" id="admin_telegram_id" placeholder="e.g. 5466079572" className="mt-1 block w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-darkbg text-gray-900 dark:text-white focus:ring-2 focus:ring-brand outline-none transition-all" />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Bot Description</label>
                        <textarea id="description" rows={2} placeholder="Welcome to our automated digital store!" className="mt-1 block w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-darkbg text-gray-900 dark:text-white focus:ring-2 focus:ring-brand outline-none transition-all"></textarea>
                    </div>

                    <div className="bg-white dark:bg-darkcard p-4 rounded-lg border border-gray-200 dark:border-gray-700 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Enable Affiliate System</label>
                            <select id="is_affiliate" className="mt-1 block w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-darkbg text-gray-900 dark:text-white outline-none">
                                <option value="0">Disabled</option>
                                <option value="1">Enabled</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Affiliate Commission (%)</label>
                            <input type="number" id="affiliate_commission" min="0" max="100" defaultValue="0" className="mt-1 block w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-darkbg text-gray-900 dark:text-white outline-none" />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button type="submit" id="btn-save-bot" className="px-8 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-brand hover:bg-sky-600 focus:outline-none transition-colors">
                        Save & Deploy
                    </button>
                </div>
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
                            document.getElementById('display_name').value = data.data.display_name || '';
                            document.getElementById('description').value = data.data.description || '';
                            document.getElementById('admin_telegram_id').value = data.data.admin_telegram_id || '';
                            document.getElementById('is_affiliate').value = data.data.is_affiliate || 0;
                            document.getElementById('affiliate_commission').value = data.data.affiliate_commission || 0;
                        }
                    } catch (e) {
                        console.error('Failed to load bot config');
                    }
                }

                document.addEventListener('DOMContentLoaded', loadBotConfig);

                document.getElementById('bot-form').addEventListener('submit', async (e) => {
                    e.preventDefault();
                    const btn = document.getElementById('btn-save-bot');
                    const projectId = window.CURRENT_PROJECT_ID;
                    
                    const payload = {
                        bot_token: document.getElementById('bot_token').value,
                        display_name: document.getElementById('display_name').value,
                        description: document.getElementById('description').value,
                        admin_telegram_id: document.getElementById('admin_telegram_id').value,
                        is_affiliate: parseInt(document.getElementById('is_affiliate').value),
                        affiliate_commission: parseFloat(document.getElementById('affiliate_commission').value)
                    };
                    
                    btn.disabled = true;
                    btn.innerText = 'Saving...';

                    try {
                        const response = await fetch('/api/projects/' + projectId + '/bot/update', {
                            method: 'POST',
                            headers: { 
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer ' + localStorage.getItem('auth_token')
                            },
                            body: JSON.stringify(payload)
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
                        btn.innerText = 'Save & Deploy';
                    }
                });
            `}} />
        </div>,
        { title: 'Bot Configuration' }
    );
});
