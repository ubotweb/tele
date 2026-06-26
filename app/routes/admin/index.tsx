import { createRoute } from 'honox/factory';

export default createRoute((c) => {
    return c.render(
        <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-4">
                <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Project Subscriptions Management</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Pantau dan kelola langganan bot untuk setiap project.</p>
                </div>
            </div>

            <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Project / User Email</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">End Date</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody id="projects-tbody" className="bg-white dark:bg-darkcard divide-y divide-gray-200 dark:divide-gray-700">
                        <tr><td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">Loading projects data...</td></tr>
                    </tbody>
                </table>
            </div>

            <script dangerouslySetInnerHTML={{ __html: `
                const token = localStorage.getItem('auth_token');

                async function loadProjects() {
                    try {
                        const res = await fetch('/api/admin/projects', {
                            headers: { 'Authorization': 'Bearer ' + token }
                        });
                        const data = await res.json();
                        const tbody = document.getElementById('projects-tbody');
                        
                        if (data.success && data.data.length > 0) {
                            tbody.innerHTML = '';
                            data.data.forEach(p => {
                                let statusHtml = '';
                                if (p.subscription_status === 'active') {
                                    statusHtml = '<span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Active</span>';
                                } else if (p.subscription_status === 'suspended') {
                                    statusHtml = '<span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">Suspended</span>';
                                } else {
                                    statusHtml = '<span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">' + p.subscription_status.charAt(0).toUpperCase() + p.subscription_status.slice(1) + '</span>';
                                }
                                
                                const endDate = new Date(p.subscription_end_date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });

                                tbody.innerHTML += \`
                                    <tr>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <div class="text-sm font-bold text-gray-900 dark:text-white">\${p.store_name}</div>
                                            <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">\${p.email}</div>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap">\${statusHtml}</td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">\${endDate}</td>
                                        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button onclick="extendProject('\${p.id}')" class="text-brand hover:text-sky-700 mr-4 transition-colors">Extend 30 Days</button>
                                            <button onclick="suspendProject('\${p.id}')" class="text-red-600 hover:text-red-900 transition-colors">Suspend</button>
                                        </td>
                                    </tr>
                                \`;
                            });
                        } else {
                            tbody.innerHTML = '<tr><td colspan="4" class="px-6 py-4 text-center text-sm text-gray-500">No projects found in the system.</td></tr>';
                        }
                    } catch (e) {
                        document.getElementById('projects-tbody').innerHTML = '<tr><td colspan="4" class="px-6 py-4 text-center text-sm text-red-500">Failed to load data from server.</td></tr>';
                    }
                }

                // Fungsi untuk memperpanjang langganan project
                window.extendProject = async function(projectId) {
                    if (!confirm('Apakah Anda yakin ingin memperpanjang project ini selama 30 hari?')) return;
                    
                    try {
                        const response = await fetch('/api/admin/projects/extend', {
                            method: 'POST',
                            headers: { 
                                'Authorization': 'Bearer ' + token,
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ project_id: projectId, days_to_add: 30, status: 'active' })
                        });
                        
                        const result = await response.json();
                        if (result.success) {
                            window.showToast('Project extended successfully', 'success');
                            loadProjects(); // Muat ulang tabel
                        } else {
                            window.showToast(result.message || 'Failed to extend project', 'error');
                        }
                    } catch (error) {
                        window.showToast('Network error occurred', 'error');
                    }
                };

                // Fungsi untuk menangguhkan langganan project
                window.suspendProject = async function(projectId) {
                    if (!confirm('Apakah Anda yakin ingin menangguhkan (suspend) project ini? Bot akan mati.')) return;
                    
                    try {
                        const response = await fetch('/api/admin/projects/extend', {
                            method: 'POST',
                            headers: { 
                                'Authorization': 'Bearer ' + token,
                                'Content-Type': 'application/json'
                            },
                            // days_to_add 0 karena kita hanya merubah statusnya saja
                            body: JSON.stringify({ project_id: projectId, days_to_add: 0, status: 'suspended' })
                        });
                        
                        const result = await response.json();
                        if (result.success) {
                            window.showToast('Project suspended', 'success');
                            loadProjects(); // Muat ulang tabel
                        } else {
                            window.showToast(result.message || 'Failed to suspend project', 'error');
                        }
                    } catch (error) {
                        window.showToast('Network error occurred', 'error');
                    }
                };

                // Jalankan fungsi load data setelah komponen dimuat
                document.addEventListener('DOMContentLoaded', loadProjects);
            \`}} />
        </div>,
        { title: 'Super Admin - Projects Management' }
    );
});
