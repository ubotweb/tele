import { createRoute } from 'honox/factory';

export default createRoute((c) => {
    return c.render(
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 dark:border-gray-700 pb-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Users Management</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your bot users, affiliate status, and commission balances.</p>
                </div>
            </div>

            {/* Form Edit User (Hidden by default) */}
            <div id="user-form-container" className="hidden p-5 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 transition-all">
                <form id="user-form" className="space-y-4">
                    <input type="hidden" id="edit_id" value="" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Affiliate Status</label>
                            <select id="u_affiliate" className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-darkbg text-gray-900 dark:text-white">
                                <option value="0">Not Affiliate</option>
                                <option value="1">Active Affiliate</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Commission Balance (IDR)</label>
                            <input type="number" id="u_commission" required min="0" step="0.01" className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-darkbg text-gray-900 dark:text-white" />
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-3 border-t border-gray-200 dark:border-gray-700 mt-4">
                        <button type="button" id="btn-cancel-edit" className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">Cancel</button>
                        <button type="submit" id="btn-save-user" className="px-6 py-2 text-sm font-medium text-white bg-brand hover:bg-sky-600 rounded-lg shadow-sm">Update User</button>
                    </div>
                </form>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">User Info</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Telegram ID</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Affiliate & Commission</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Action</th>
                        </tr>
                    </thead>
                    <tbody id="users-tbody" className="bg-white dark:bg-darkcard divide-y divide-gray-200 dark:divide-gray-700">
                        <tr><td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">Loading users...</td></tr>
                    </tbody>
                </table>
            </div>

            <script dangerouslySetInnerHTML={{ __html: `
                const token = localStorage.getItem('auth_token');
                
                async function loadUsers() {
                    try {
                        const res = await fetch('/api/projects/' + window.CURRENT_PROJECT_ID + '/users', {
                            headers: { 'Authorization': 'Bearer ' + token }
                        });
                        const data = await res.json();
                        const tbody = document.getElementById('users-tbody');
                        
                        if (data.success && data.data.length > 0) {
                            tbody.innerHTML = '';
                            data.data.forEach(u => {
                                const affiliateBadge = u.is_affiliate 
                                    ? '<span class="px-2 py-1 text-[10px] font-semibold rounded-full bg-green-100 text-green-800">Affiliate</span>' 
                                    : '<span class="px-2 py-1 text-[10px] font-semibold rounded-full bg-gray-100 text-gray-600">Regular</span>';
                                
                                const uData = JSON.stringify(u).replace(/'/g, "&apos;").replace(/"/g, "&quot;");
                                
                                tbody.innerHTML += \`
                                    <tr>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <div class="text-sm font-bold text-gray-900 dark:text-white">\${u.first_name || 'No Name'}</div>
                                            <div class="text-xs text-gray-500">@\${u.username || 'unknown'}</div>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500 dark:text-gray-400">\${u.telegram_id}</td>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <div class="flex items-center gap-2 mb-1">\${affiliateBadge}</div>
                                            <div class="text-xs font-medium text-gray-900 dark:text-white">Rp \${u.commission_balance.toLocaleString('id-ID')}</div>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button onclick="editUser('\${uData}')" class="text-brand hover:text-sky-700 mr-3">Manage</button>
                                            <button onclick="deleteUser('\${u.id}')" class="text-red-600 hover:text-red-900">Remove</button>
                                        </td>
                                    </tr>
                                \`;
                            });
                        } else {
                            tbody.innerHTML = '<tr><td colspan="4" class="px-6 py-4 text-center text-sm text-gray-500">No users have interacted with your bot yet.</td></tr>';
                        }
                    } catch (e) {
                        document.getElementById('users-tbody').innerHTML = '<tr><td colspan="4" class="px-6 py-4 text-center text-sm text-red-500">Failed to load users.</td></tr>';
                    }
                }

                document.addEventListener('DOMContentLoaded', loadUsers);

                window.editUser = function(userStr) {
                    const u = JSON.parse(userStr.replace(/&quot;/g, '"').replace(/&apos;/g, "'"));
                    document.getElementById('edit_id').value = u.id;
                    document.getElementById('u_affiliate').value = u.is_affiliate ? "1" : "0";
                    document.getElementById('u_commission').value = u.commission_balance;
                    
                    document.getElementById('user-form-container').classList.remove('hidden');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                };

                document.getElementById('btn-cancel-edit').addEventListener('click', () => {
                    document.getElementById('user-form').reset();
                    document.getElementById('edit_id').value = '';
                    document.getElementById('user-form-container').classList.add('hidden');
                });

                document.getElementById('user-form').addEventListener('submit', async (e) => {
                    e.preventDefault();
                    const btn = document.getElementById('btn-save-user');
                    btn.disabled = true;
                    btn.innerText = 'Updating...';

                    const id = document.getElementById('edit_id').value;
                    const payload = {
                        is_affiliate: parseInt(document.getElementById('u_affiliate').value),
                        commission_balance: parseFloat(document.getElementById('u_commission').value)
                    };

                    try {
                        const response = await fetch(\`/api/projects/\${window.CURRENT_PROJECT_ID}/users/\${id}\`, { 
                            method: 'PUT', 
                            headers: { 
                                'Authorization': 'Bearer ' + token,
                                'Content-Type': 'application/json'
                            }, 
                            body: JSON.stringify(payload) 
                        });
                        
                        const result = await response.json();
                        
                        if (result.success) {
                            window.showToast('User updated successfully', 'success');
                            document.getElementById('btn-cancel-edit').click();
                            loadUsers();
                        } else {
                            window.showToast(result.message, 'error');
                        }
                    } catch (error) {
                        window.showToast('Error updating user', 'error');
                    } finally { 
                        btn.disabled = false; 
                        btn.innerText = 'Update User';
                    }
                });

                window.deleteUser = async function(id) {
                    if(!confirm('Are you sure you want to remove this user from the system?')) return;
                    try {
                        const response = await fetch(\`/api/projects/\${window.CURRENT_PROJECT_ID}/users/\${id}\`, { 
                            method: 'DELETE', 
                            headers: { 'Authorization': 'Bearer ' + token }
                        });
                        const result = await response.json();
                        if (result.success) {
                            window.showToast('User removed', 'success');
                            loadUsers();
                        } else {
                            window.showToast(result.message, 'error');
                        }
                    } catch (error) {
                        window.showToast('Error removing user', 'error');
                    }
                };
            `}} />
        </div>,
        { title: 'Users Management' }
    );
});
