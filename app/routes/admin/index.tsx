import { createRoute } from 'honox/factory';

export default createRoute((c) => {
    return c.render(
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 dark:border-gray-700 pb-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tenant Management</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Monitor and manage all user projects and subscriptions globally.</p>
                </div>
            </div>

            <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Project / User</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">End Date</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody id="admin-tenants-tbody" className="bg-white dark:bg-darkcard divide-y divide-gray-200 dark:divide-gray-700">
                        <tr><td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">Loading projects data...</td></tr>
                    </tbody>
                </table>
            </div>

            {/* Modal Perpanjangan Langganan Tersembunyi */}
            <div id="extend-modal" className="hidden fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
                    <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                    <div className="inline-block align-bottom bg-white dark:bg-darkcard rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full">
                        <form id="extend-form">
                            <input type="hidden" id="ext_project_id" />
                            <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Extend Subscription</h3>
                                <p className="text-sm text-gray-500 mt-2" id="ext_project_name">Project: -</p>
                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Days to Add</label>
                                    <input type="number" id="ext_days" required defaultValue={30} min={1} className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-darkbg text-gray-900 dark:text-white" />
                                </div>
                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                                    <select id="ext_status" required className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-darkbg text-gray-900 dark:text-white">
                                        <option value="active">Active</option>
                                        <option value="suspended">Suspended</option>
                                    </select>
                                </div>
                            </div>
                            <div className="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-200 dark:border-gray-700">
                                <button type="submit" id="btn-save-ext" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-brand text-base font-medium text-white hover:bg-sky-600 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm">Apply Changes</button>
                                <button type="button" onClick="document.getElementById('extend-modal').classList.add('hidden')" className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-darkbg text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <script dangerouslySetInnerHTML={{ __html: `
                const token = localStorage.getItem('auth_token');

                async function loadAllTenants() {
                    try {
                        const res = await fetch('/api/admin/tenants', {
                            headers: { 'Authorization': 'Bearer ' + token }
                        });
                        const data = await res.json();
                        const tbody = document.getElementById('admin-tenants-tbody');
                        
                        if (data.success && data.data.length > 0) {
                            tbody.innerHTML = '';
                            data.data.forEach(t => {
                                let statusClass = 'bg-gray-100 text-gray-800';
                                if (t.subscription_status === 'active') statusClass = 'bg-green-100 text-green-800';
                                if (t.subscription_status === 'expired' || t.subscription_status === 'unpaid') statusClass = 'bg-red-100 text-red-800';
                                if (t.subscription_status === 'suspended') statusClass = 'bg-yellow-100 text-yellow-800';

                                const dateStr = new Date(t.subscription_end_date).toLocaleDateString();

                                tbody.innerHTML += \`
                                    <tr>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <div class="text-sm font-bold text-gray-900 dark:text-white">\${t.project_name}</div>
                                            <div class="text-xs text-gray-500">\${t.email}</div>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <span class="px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full \${statusClass}">
                                                \${t.subscription_status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            \${dateStr}
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button onclick="openExtendModal('\${t.id}', '\${t.project_name}')" class="text-brand hover:text-sky-700">Manage</button>
                                        </td>
                                    </tr>
                                \`;
                            });
                        } else {
                            tbody.innerHTML = '<tr><td colspan="4" class="px-6 py-4 text-center text-sm text-gray-500">No projects found in the system.</td></tr>';
                        }
                    } catch (e) {
                        document.getElementById('admin-tenants-tbody').innerHTML = '<tr><td colspan="4" class="px-6 py-4 text-center text-sm text-red-500">Failed to load system data.</td></tr>';
                    }
                }

                document.addEventListener('DOMContentLoaded', loadAllTenants);

                window.openExtendModal = function(projectId, projectName) {
                    document.getElementById('ext_project_id').value = projectId;
                    document.getElementById('ext_project_name').innerText = 'Project: ' + projectName;
                    document.getElementById('extend-modal').classList.remove('hidden');
                };

                document.getElementById('extend-form').addEventListener('submit', async (e) => {
                    e.preventDefault();
                    const btn = document.getElementById('btn-save-ext');
                    btn.disabled = true;

                    const payload = {
                        tenant_id: document.getElementById('ext_project_id').value, // Endpoint api/admin/tenants/extend masih memakai nama properti tenant_id
                        days_to_add: parseInt(document.getElementById('ext_days').value),
                        status: document.getElementById('ext_status').value
                    };

                    try {
                        const response = await fetch('/api/admin/tenants/extend', {
                            method: 'POST',
                            headers: { 
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer ' + token
                            },
                            body: JSON.stringify(payload)
                        });
                        
                        const result = await response.json();
                        
                        if (result.success) {
                            window.showToast('Subscription updated', 'success');
                            document.getElementById('extend-modal').classList.add('hidden');
                            loadAllTenants();
                        } else {
                            window.showToast(result.message, 'error');
                        }
                    } catch (error) {
                        window.showToast('Error updating subscription', 'error');
                    } finally {
                        btn.disabled = false;
                    }
                });
            `}} />
        </div>,
        { title: 'Tenant Management' }
    );
});
