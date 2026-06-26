import { createRoute } from 'honox/factory';

export default createRoute((c) => {
    return c.render(
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Product Catalog</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage products, pricing, and images.</p>
                </div>
                <button onClick="document.getElementById('product-form-container').classList.toggle('hidden')" className="inline-flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-brand hover:bg-sky-600 transition-colors">
                    + Add Product
                </button>
            </div>

            <div id="product-form-container" className="hidden p-5 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
                <form id="product-form" className="space-y-4">
                    <input type="hidden" id="edit_id" value="" />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="lg:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Product Title</label>
                            <input type="text" id="p_title" required className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-darkbg text-gray-900 dark:text-white" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                            <select id="p_category" required className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-darkbg text-gray-900 dark:text-white">
                                <option value="">Select Category...</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Product Type</label>
                            <select id="p_type" required className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-darkbg text-gray-900 dark:text-white">
                                <option value="regular">Regular (Ebook/Video)</option>
                                <option value="unique">Unique (Voucher/License)</option>
                                <option value="h2h">H2H (Third-party API)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Price (IDR)</label>
                            <input type="number" id="p_price" required className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-darkbg text-gray-900 dark:text-white" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Stock</label>
                            <input type="number" id="p_stock" defaultValue={0} className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-darkbg text-gray-900 dark:text-white" />
                        </div>
                        <div className="lg:col-span-3">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Image Upload <span className="text-xs text-gray-400">(Cloudinary required)</span></label>
                            <input type="file" id="p_image" accept="image/*" className="mt-1 block w-full px-3 py-1.5 text-sm text-gray-900 border border-gray-300 rounded-md cursor-pointer bg-white dark:text-gray-400 focus:outline-none dark:bg-darkbg dark:border-gray-600" />
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-3 border-t border-gray-200 dark:border-gray-700 mt-4">
                        <button type="button" id="btn-cancel-edit" className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg hidden">Cancel Edit</button>
                        <button type="submit" id="btn-save-product" className="px-6 py-2 text-sm font-medium text-white bg-brand hover:bg-sky-600 rounded-lg">Save Product</button>
                    </div>
                </form>
            </div>

            <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price & Stock</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Action</th>
                        </tr>
                    </thead>
                    <tbody id="products-tbody" className="bg-white dark:bg-darkcard divide-y divide-gray-200 dark:divide-gray-700">
                        <tr><td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">Loading products...</td></tr>
                    </tbody>
                </table>
            </div>

            <script dangerouslySetInnerHTML={{ __html: `
                const token = localStorage.getItem('auth_token');
                
                async function loadDependencies() {
                    const res = await fetch('/api/projects/' + window.CURRENT_PROJECT_ID + '/categories', { headers: { 'Authorization': 'Bearer ' + token }});
                    const data = await res.json();
                    const select = document.getElementById('p_category');
                    if (data.success) {
                        data.data.forEach(c => { select.innerHTML += \`<option value="\${c.id}">\${c.name}</option>\`; });
                    }
                }

                async function loadProducts() {
                    const res = await fetch('/api/projects/' + window.CURRENT_PROJECT_ID + '/products', { headers: { 'Authorization': 'Bearer ' + token }});
                    const data = await res.json();
                    const tbody = document.getElementById('products-tbody');
                    
                    if (data.success && data.data.length > 0) {
                        tbody.innerHTML = '';
                        data.data.forEach(p => {
                            const imgHtml = p.icon_url ? \`<img src="\${p.icon_url}" class="h-10 w-10 rounded object-cover border mr-3" />\` : \`<div class="h-10 w-10 rounded bg-gray-100 border mr-3 flex items-center justify-center text-xs text-gray-400">No Img</div>\`;
                            // Escape quotes to prevent JSON parsing errors in inline onClick
                            const pData = JSON.stringify(p).replace(/'/g, "&apos;").replace(/"/g, "&quot;");
                            tbody.innerHTML += \`
                                <tr>
                                    <td class="px-6 py-4 whitespace-nowrap flex items-center">
                                        \${imgHtml}
                                        <div>
                                            <div class="text-sm font-bold text-gray-900 dark:text-white">\${p.title}</div>
                                            <div class="text-xs text-gray-500 uppercase">\${p.type}</div>
                                        </div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">\${p.category_name || '-'}</td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="text-sm text-gray-900 dark:text-white font-medium">Rp \${p.price.toLocaleString('id-ID')}</div>
                                        <div class="text-xs text-gray-500">Stock: \${p.stock}</div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onclick="editProduct('\${pData}')" class="text-brand hover:text-sky-700 mr-3">Edit</button>
                                        <button onclick="deleteProduct('\${p.id}')" class="text-red-600 hover:text-red-900">Delete</button>
                                    </td>
                                </tr>
                            \`;
                        });
                    } else {
                        tbody.innerHTML = '<tr><td colspan="4" class="px-6 py-4 text-center text-sm text-gray-500">No products found.</td></tr>';
                    }
                }

                document.addEventListener('DOMContentLoaded', () => { loadDependencies(); loadProducts(); });

                window.editProduct = function(productStr) {
                    const p = JSON.parse(productStr.replace(/&quot;/g, '"').replace(/&apos;/g, "'"));
                    document.getElementById('edit_id').value = p.id;
                    document.getElementById('p_title').value = p.title;
                    document.getElementById('p_category').value = p.category_id;
                    document.getElementById('p_type').value = p.type;
                    document.getElementById('p_price').value = p.price;
                    document.getElementById('p_stock').value = p.stock;
                    
                    document.getElementById('product-form-container').classList.remove('hidden');
                    document.getElementById('btn-save-product').innerText = 'Update Product';
                    document.getElementById('btn-cancel-edit').classList.remove('hidden');
                };

                document.getElementById('btn-cancel-edit').addEventListener('click', () => {
                    document.getElementById('product-form').reset();
                    document.getElementById('edit_id').value = '';
                    document.getElementById('btn-save-product').innerText = 'Save Product';
                    document.getElementById('btn-cancel-edit').classList.add('hidden');
                    document.getElementById('product-form-container').classList.add('hidden');
                });

                document.getElementById('product-form').addEventListener('submit', async (e) => {
                    e.preventDefault();
                    const btn = document.getElementById('btn-save-product');
                    btn.disabled = true;

                    const id = document.getElementById('edit_id').value;
                    const isUpdate = id !== '';
                    const url = isUpdate ? \`/api/projects/\${window.CURRENT_PROJECT_ID}/products/\${id}\` : \`/api/projects/\${window.CURRENT_PROJECT_ID}/products\`;
                    const method = isUpdate ? 'PUT' : 'POST';

                    const formData = new FormData();
                    formData.append('title', document.getElementById('p_title').value);
                    formData.append('category_id', document.getElementById('p_category').value);
                    formData.append('type', document.getElementById('p_type').value);
                    formData.append('price', document.getElementById('p_price').value);
                    formData.append('stock', document.getElementById('p_stock').value);

                    const fileInput = document.getElementById('p_image');
                    if (fileInput.files.length > 0) formData.append('image', fileInput.files[0]);

                    try {
                        const response = await fetch(url, { method: method, headers: { 'Authorization': 'Bearer ' + token }, body: formData });
                        const result = await response.json();
                        if (result.success) {
                            window.showToast(isUpdate ? 'Product updated' : 'Product added', 'success');
                            document.getElementById('btn-cancel-edit').click();
                            loadProducts();
                        } else {
                            window.showToast(result.message, 'error');
                        }
                    } catch (error) {
                        window.showToast('Error saving product', 'error');
                    } finally { btn.disabled = false; }
                });

                window.deleteProduct = async function(id) {
                    if(!confirm('Delete this product permanently?')) return;
                    await fetch('/api/projects/' + window.CURRENT_PROJECT_ID + '/products/' + id, { method: 'DELETE', headers: { 'Authorization': 'Bearer ' + token }});
                    loadProducts();
                };
            `}} />
        </div>,
        { title: 'Products' }
    );
});
