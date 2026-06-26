import { createRoute } from 'honox/factory';

export default createRoute((c) => {
    return c.render(
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 dark:border-gray-700 pb-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Product Categories</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Organize your products with images and icons.</p>
                </div>
            </div>

            <form id="category-form" className="flex flex-col md:flex-row gap-4 items-end bg-gray-50 dark:bg-gray-800/50 p-5 rounded-xl border border-gray-100 dark:border-gray-700">
                <input type="hidden" id="edit_id" value="" />
                <div className="flex-1 w-full">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category Name</label>
                    <input type="text" id="cat_name" required placeholder="e.g. E-Books" className="mt-1 block w-full px-3 py-2.5 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-darkbg text-gray-900 dark:text-white" />
                </div>
                <div className="flex-1 w-full">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Image Upload <span className="text-xs text-gray-400">(Cloudinary required)</span></label>
                    <input type="file" id="cat_image" accept="image/*" className="mt-1 block w-full px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-md cursor-pointer bg-white dark:text-gray-400 focus:outline-none dark:bg-darkbg dark:border-gray-600 dark:placeholder-gray-400" />
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <button type="button" id="btn-cancel-edit" className="hidden px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg">Cancel</button>
                    <button type="submit" id="btn-save-cat" className="flex-1 px-6 py-2.5 text-sm font-medium text-white bg-brand hover:bg-sky-600 rounded-lg shadow-sm">
                        Save Category
                    </button>
                </div>
            </form>

            <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Image</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category Name</th>
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
                                const imgHtml = c.image_url ? \`<img src="\${c.image_url}" class="h-10 w-10 rounded object-cover border" />\` : \`<div class="h-10 w-10 rounded bg-gray-100 flex items-center justify-center text-xs text-gray-400 border">No Img</div>\`;
                                tbody.innerHTML += \`
                                    <tr>
                                        <td class="px-6 py-4 whitespace-nowrap">\${imgHtml}</td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 dark:text-white">\${c.name}</td>
                                        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button onclick="editCategory('\${c.id}', '\${c.name}')" class="text-brand hover:text-sky-700 mr-3">Edit</button>
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

                window.editCategory = function(id, name) {
                    document.getElementById('edit_id').value = id;
                    document.getElementById('cat_name').value = name;
                    document.getElementById('btn-save-cat').innerText = 'Update Category';
                    document.getElementById('btn-cancel-edit').classList.remove('hidden');
                };

                document.getElementById('btn-cancel-edit').addEventListener('click', () => {
                    document.getElementById('category-form').reset();
                    document.getElementById('edit_id').value = '';
                    document.getElementById('btn-save-cat').innerText = 'Save Category';
                    document.getElementById('btn-cancel-edit').classList.add('hidden');
                });

                document.getElementById('category-form').addEventListener('submit', async (e) => {
                    e.preventDefault();
                    const btn = document.getElementById('btn-save-cat');
                    btn.disabled = true;

                    const id = document.getElementById('edit_id').value;
                    const isUpdate = id !== '';
                    const url = isUpdate ? '/api/projects/' + window.CURRENT_PROJECT_ID + '/categories/' + id : '/api/projects/' + window.CURRENT_PROJECT_ID + '/categories';
                    const method = isUpdate ? 'PUT' : 'POST';

                    const formData = new FormData();
                    formData.append('name', document.getElementById('cat_name').value);
                    
                    const fileInput = document.getElementById('cat_image');
                    if (fileInput.files.length > 0) {
                        formData.append('image', fileInput.files[0]);
                    }

                    try {
                        const response = await fetch(url, {
                            method: method,
                            headers: { 'Authorization': 'Bearer ' + token },
                            body: formData // Fetch API sets boundary automatically for FormData
                        });
                        
                        const result = await response.json();
                        
                        if (result.success) {
                            window.showToast(isUpdate ? 'Category updated' : 'Category added', 'success');
                            document.getElementById('btn-cancel-edit').click();
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
                    if(!confirm('Are you sure you want to delete this category?')) return;
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
