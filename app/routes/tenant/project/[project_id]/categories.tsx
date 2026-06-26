import { createRoute } from 'honox/factory';

export default createRoute((c) => {
    return c.render(
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 dark:border-gray-700 pb-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Product Categories</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Organize your products efficiently.</p>
                </div>
            </div>

            <form id="category-form" className="flex flex-col sm:flex-row gap-4 items-end bg-gray-50 dark:bg-gray-800/50 p-5 rounded-xl border border-gray-100 dark:border-gray-700">
                <div className="flex-1 w-full">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category Name</label>
                    <input type="text" id="cat_name" required placeholder="e.g. E-Books" className="mt-1 block w-full px-3 py-2.5 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-darkbg text-gray-900 dark:text-white" />
                </div>
                <div className="flex-1 w-full">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Icon URL (Optional)</label>
                    <input type="url" id="cat_icon" placeholder="https://example.com/icon.png" className="mt-1 block w-full px-3 py-2.5 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-darkbg text-gray-900 dark:text-white" />
                </div>
                <button type="submit" id="btn-save-cat" className="w-full sm:w-auto px-6 py-2.5 text-sm font-medium text-white bg-brand hover:bg-sky-600 rounded-lg shadow-sm">
                    Add Category
                </button>
            </form>

            <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Icon URL</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Action</th>
                        </tr>
                    </thead>
                    <tbody id="categories-tbody" className="bg-white dark:bg-darkcard divide-y divide-gray-200 dark:divide-gray-700">
                        <tr><td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">Loading categories...</td></tr>
                    </tbody>
                </table>
            </div>

            <script dangerouslySetInnerHTML={{ __html: `
                const token = localStorage.getItem('auth_token');
                
                async function loadCategories() {
                    const projectId = window.CURRENT_PROJECT_ID;
                    try {
                        const res = await fetch('/api/projects/' + projectId + '/categories', {
                            headers: { 'Authorization': 'Bearer ' + token }
                        });
                        const data = await res.json();
                        const tbody = document.getElementById('categories-tbody');
                        
                        if (data.success && data.data.length > 0) {
                            tbody.innerHTML = '';
                            data.data.forEach(c => {
                                tbody.innerHTML += \`
                                    <tr>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 dark:text-white">\${c.name}</td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">\${c.icon_url || '-'}</td>
                                        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button onclick="deleteCategory('\${c.id}')" class="text-red-600 hover:text-red-900 dark:hover:text-red-400">Delete</button>
                                        </td>
                                    </tr>
                                \`;
                            });
                        } else {
                            tbody.innerHTML = '<tr><td colspan="3" class="px-6 py-4 text-center text-sm text-gray-500">No categories found.</td></tr>';
                        }
                    } catch (e) {
                        document.getElementById('categories-tbody').innerHTML = '<tr><td colspan="3" class="px-6 py-4 text-center text-sm text-red-500">Failed to load categories.</td></tr>';
                    }
                }

                document.addEventListener('DOMContentLoaded', loadCategories);

                document.getElementById('category-form').addEventListener('submit', async (e) => {
                    e.preventDefault();
                    const btn = document.getElementById('btn-save-cat');
                    btn.disabled = true;

                    const payload = {
                        name: document.getElementById('cat_name').value,
                        icon_url: document.getElementById('cat_icon').value
                    };

                    try {
                        const response = await fetch('/api/projects/' + window.CURRENT_PROJECT_ID + '/categories', {
                            method: 'POST',
                            headers: { 
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer ' + token
                            },
                            body: JSON.stringify(payload)
                        });
                        
                        const result = await response.json();
                        
                        if (result.success) {
                            window.showToast('Category added successfully', 'success');
                            document.getElementById('category-form').reset();
                            loadCategories();
                        } else {
                            window.showToast(result.message, 'error');
                        }
                    } catch (error) {
                        window.showToast('Error saving category', 'error');
                    } finally {
                        btn.disabled = false;
                    }
                });

                window.deleteCategory = async function(id) {
                    if(!confirm('Are you sure you want to delete this category? (Products within this category might be affected)')) return;
                    
                    try {
                        const response = await fetch('/api/projects/' + window.CURRENT_PROJECT_ID + '/categories/' + id, {
                            method: 'DELETE',
                            headers: { 'Authorization': 'Bearer ' + token }
                        });
                        const result = await response.json();
                        if (result.success) {
                            window.showToast('Category deleted', 'success');
                            loadCategories();
                        } else {
                            window.showToast(result.message, 'error');
                        }
                    } catch (e) {
                        window.showToast('Error deleting category', 'error');
                    }
                };
            `}} />
        </div>,
        { title: 'Categories' }
    );
});
