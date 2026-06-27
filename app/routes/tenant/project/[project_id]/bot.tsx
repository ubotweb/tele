import { createRoute } from 'honox/factory';

export default createRoute((c) => {
    // Tarik APP_KEY yang bersifat publik dari Environment Variables untuk disuntikkan ke script
    const tiktokAppKey = c.env.TIKTOK_APP_KEY || '';

    return c.render(
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Channel Integrations</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Configure your Telegram bot credentials and TikTok Shop connection.</p>
            </div>

            <form id="bot-form" className="space-y-6 max-w-3xl bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-100 dark:border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* BAGIAN TELEGRAM */}
                    <div className="md:col-span-2 border-b border-gray-200 dark:border-gray-700 pb-4 mb-2">
                        <h3 className="font-bold text-brand flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
                            Telegram Setup
                        </h3>
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Bot Token API</label>
                        <input type="text" id="bot_token" placeholder="1234567890:AAH_XXXXXXXXXXXX_XXXXXX" className="mt-1 block w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-darkbg text-gray-900 dark:text-white focus:ring-2 focus:ring-brand outline-none transition-all" />
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

                    {/* BAGIAN TIKTOK */}
                    <div className="md:col-span-2 border-b border-t pt-4 border-gray-200 dark:border-gray-700 pb-4 mt-2 mb-2">
                        <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.53 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
                            TikTok Setup
                        </h3>
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">TikTok Shop Connection</label>
                        <div className="mt-2 flex items-center gap-4">
                            <input type="text" id="tiktok_shop_id" readOnly placeholder="Not Connected" className="block w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-500 cursor-not-allowed outline-none" />
                            
                            <button type="button" id="btn-tiktok-login" className="px-6 py-2.5 bg-black hover:bg-gray-800 text-white font-medium rounded-lg whitespace-nowrap transition-colors">
                                Connect TikTok
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">Click the button to securely authorize this project with your TikTok Shop via OAuth.</p>
                    </div>

                    {/* AFFILIATE */}
                    <div className="bg-white dark:bg-darkcard p-4 rounded-lg border border-gray-200 dark:border-gray-700 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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
                        Save Channels
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
                            
                            // Menampilkan tiktok_shop_id dari database jika sudah terkoneksi
                            if (data.data.tiktok_shop_id) {
                                document.getElementById('tiktok_shop_id').value = data.data.tiktok_shop_id;
                                document.getElementById('btn-tiktok-login').innerText = 'Reconnect';
                            }
                            
                            document.getElementById('is_affiliate').value = data.data.is_affiliate || 0;
                            document.getElementById('affiliate_commission').value = data.data.affiliate_commission || 0;
                        }
                    } catch (e) {
                        console.error('Failed to load channel config');
                    }
                }

                document.addEventListener('DOMContentLoaded', loadBotConfig);

                // Event listener untuk tombol Connect TikTok
                document.getElementById('btn-tiktok-login').addEventListener('click', () => {
                    const projectId = window.CURRENT_PROJECT_ID;
                    const appId = "${tiktokAppKey}"; // Disuntikkan otomatis dari server Environment Variables
                    
                    if (!appId) {
                        alert('Sistem belum dikonfigurasi untuk TikTok. Mohon hubungi administrator untuk menyetel TIKTOK_APP_KEY.');
                        return;
                    }

                    const redirectUri = encodeURIComponent(window.location.origin + "/api/projects/" + projectId + "/bot/tiktok/callback");
                    
                    // URL OAuth TikTok (Project ID disisipkan di state)
                    const tiktokAuthUrl = \`https://auth.tiktok-us.com/v2/auth/authorize?client_id=\${appId}&response_type=code&redirect_uri=\${redirectUri}&state=\${projectId}\`;
                    
                    window.location.href = tiktokAuthUrl;
                });

                document.getElementById('bot-form').addEventListener('submit', async (e) => {
                    e.preventDefault();
                    const btn = document.getElementById('btn-save-bot');
                    const projectId = window.CURRENT_PROJECT_ID;
                    
                    const payload = {
                        bot_token: document.getElementById('bot_token').value,
                        display_name: document.getElementById('display_name').value,
                        description: document.getElementById('description').value,
                        admin_telegram_id: document.getElementById('admin_telegram_id').value,
                        tiktok_shop_id: document.getElementById('tiktok_shop_id').value,
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
                        btn.innerText = 'Save Channels';
                    }
                });
            `}} />
        </div>,
        { title: 'Channel Configuration' }
    );
});
