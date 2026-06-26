import { createRoute } from 'honox/factory';

export default createRoute((c) => {
    return c.render(
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Overview</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Welcome to your SaaS Telegram Bot control panel.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4" id="stats-container">
                <div className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700">
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Products</div>
                    <div className="mt-2 text-3xl font-bold text-gray-900 dark:text-white" id="stat-products">-</div>
                </div>
                <div className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700">
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Bot Status</div>
                    <div className="mt-2 text-lg font-bold text-gray-900 dark:text-white" id="stat-bot">-</div>
                </div>
            </div>

            <script dangerouslySetInnerHTML={{ __html: `
                async function fetchDashboardStats() {
                    const token = localStorage.getItem('auth_token');
                    if(!token) return;

                    try {
                        // Memuat status bot
                        const botRes = await fetch('/api/tenant/bots', {
                            headers: { 'Authorization': 'Bearer ' + token }
                        });
                        const botData = await botRes.json();
                        
                        const botStatEl = document.getElementById('stat-bot');
                        if (botData.success && botData.data && botData.data.is_active) {
                            botStatEl.innerHTML = '<span class="text-green-600 dark:text-green-400">Active</span>';
                        } else {
                            botStatEl.innerHTML = '<span class="text-red-500">Not Configured</span>';
                        }

                        // Memuat jumlah produk
                        const prodRes = await fetch('/api/tenant/products', {
                            headers: { 'Authorization': 'Bearer ' + token }
                        });
                        const prodData = await prodRes.json();
                        
                        const prodStatEl = document.getElementById('stat-products');
                        if (prodData.success && prodData.data) {
                            prodStatEl.innerText = prodData.data.length;
                        } else {
                            prodStatEl.innerText = '0';
                        }

                    } catch (error) {
                        console.error('Failed to load stats');
                    }
                }
                
                // Menjalankan fungsi setelah DOM siap
                document.addEventListener('DOMContentLoaded', fetchDashboardStats);
            `}} />
        </div>,
        { title: 'Dashboard' }
    );
});
