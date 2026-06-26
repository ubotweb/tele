import { createRoute } from 'honox/factory';

export default createRoute((c) => {
    return c.render(
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Tenant Subscriptions</h3>
                <button className="px-4 py-2 text-sm font-medium text-white bg-brand hover:bg-sky-600 rounded-lg shadow-sm transition-colors">
                    Add New Tenant
                </button>
            </div>

            <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Store Name</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">End Date</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody id="tenants-tbody" className="bg-white dark:bg-darkcard divide-y divide-gray-200 dark:divide-gray-700">
                        <tr><td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">Loading tenants data...</td></tr>
                    </tbody>
                </table>
            </div>

            <script dangerouslySetInnerHTML={{ __html: `
                const token = localStorage.getItem('auth_token');

                async function loadTenants() {
                    try {
                        // Mengakses endpoint khusus admin (asumsi endpoint telah dibuat di src/controllers)
                        const res = await fetch('/api/admin/tenants', {
                            headers: { 'Authorization': 'Bearer ' + token }
                        });
                        
                        // Fallback UI simulasi jika API belum dikaitkan
                        const tbody = document.getElementById('tenants-tbody');
                        tbody.innerHTML = \`
                            <tr>
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">Sample Store A</td>
                                <td class="px-6 py-4 whitespace-nowrap"><span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Active</span></td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">2026-12-31</td>
                                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button class="text-brand hover:text-sky-700 mr-3">Extend</button>
                                    <button class="text-red-600 hover:text-red-900">Suspend</button>
                                </td>
                            </tr>
                        \`;
                    } catch (e) {
                        document.getElementById('tenants-tbody').innerHTML = '<tr><td colspan="4" class="px-6 py-4 text-center text-sm text-red-500">Failed to load data.</td></tr>';
                    }
                }

                document.addEventListener('DOMContentLoaded', loadTenants);
            `}} />
        </div>,
        { title: 'Tenant Management' }
    );
});
