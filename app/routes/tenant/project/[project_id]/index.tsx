import { createRoute } from 'honox/factory';

export default createRoute((c) => {
    return c.render(
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Project Overview</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Status and summary of your current bot project.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4" id="stats-container">
                <div className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700">
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Bot Webhook Status</div>
                    <div className="mt-2 text-lg font-bold text-gray-900 dark:text-white" id="stat-bot">Loading...</div>
                </div>
                <div className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700">
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Categories</div>
                    <div className="mt-2 text-3xl font-bold text-gray-900 dark:text-white" id="stat-categories">-</div>
                </div>
                <div className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700">
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Products</div>
                    <div className="mt-2 text-3xl font-bold text-gray-900 dark:text-white" id="stat-products">-</div>
                </div>
            </div>

            <script dangerouslySetInnerHTML={{ __html: `
                async function fetchProjectStats() {
                    const token = localStorage.getItem('auth_token');
                    const projectId = window.CURRENT_PROJECT_ID;
                    if(!token || !projectId) return;

                    try {
                        // Load Bot Status
                        const botRes = await fetch('/api/projects/' + projectId + '/bot', {
                            headers: { 'Authorization': 'Bearer ' + token }
                        });
                        const botData = await botRes.json();
                        const botStatEl = document.getElementById('stat-bot');
                        if (botData.success && botData.data && botData.data.is_active) {
                            botStatEl.innerHTML = '<span class="text-green-600 dark:text-green-400">Active</span>';
                        } else {
                            botStatEl.innerHTML = '<span class="text-red-500">Not Configured</span>';
                        }

                        // Load Categories Count
                        const catRes = await fetch('/api/projects/' + projectId + '/categories', {
                            headers: { 'Authorization': 'Bearer ' + token }
                        });
                        const catData = await catRes.json();
                        document.getElementById('stat-categories').innerText = catData.success ? catData.data.length : '0';

                        // Load Products Count
                        const prodRes = await fetch('/api/projects/' + projectId + '/products', { // Asumsi route products dibuat
                            headers: { 'Authorization': 'Bearer ' + token }
                        });
                        const prodData = await prodRes.json();
                        document.getElementById('stat-products').innerText = prodData.success ? prodData.data.length : '0';

                    } catch (error) {
                        console.error('Failed to load project stats');
                    }
                }
                
                document.addEventListener('DOMContentLoaded', fetchProjectStats);
            `}} />
        </div>,
        { title: 'Project Overview' }
    );
});
