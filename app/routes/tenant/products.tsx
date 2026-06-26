import { createRoute } from 'honox/factory';

export default createRoute((c) => {
    return c.render(
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Products Management</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your digital assets, vouchers, and H2H products.</p>
                </div>
                <button onClick="document.getElementById('product-form-container').classList.toggle('hidden')" className="inline-flex items-center gap-2 py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-brand hover:bg-sky-600 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    Add Product
                </button>
            </div>

            {/* Container Form Tambah Produk (Default Hidden) */}
            <div id="product-form-container" className="hidden p-5 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                <form id="product-form" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Product Title</label>
                            <input type="text" id="p_title" required className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-darkbg text-gray-900 dark:text-white" />
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
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Initial Stock</label>
                            <input type="number" id="p_stock" defaultValue={0} className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-darkbg text-gray-900 dark:text-white" />
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-3">
                        <button type="button" onClick="document.getElementById('product-form-container').classList.add('hidden')" className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">Cancel</button>
                        <button type="submit" id="btn-save-product" className="px-4 py-2 text-sm font-medium text-white bg-brand hover:bg-sky-600 rounded-lg">Save Product</button>
                    </div>
                </form>
            </div>

            {/* Tabel Produk */}
            <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Title</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Price</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Stock</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Action</th>
                        </tr>
                    </thead>
                    <tbody id="products-tbody" className="bg-white dark:bg-darkcard divide-y divide-gray-200 dark:divide-gray-700">
                        <tr><td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">Loading products...</td></tr>
                    </tbody>
                </table>
            </div>

            <script dangerouslySetInnerHTML={{ __html: `
                const token = localStorage.getItem('auth_token');

                async function loadProducts() {
                    try {
                        const res = await fetch('/api/tenant/products', {
                            headers: { 'Authorization': 'Bearer ' + token }
                        });
                        const data = await res.json();
                        const tbody = document.getElementById('products-tbody');
                        
                        if (data.success && data.data.length > 0) {
                            tbody.innerHTML = '';
                            data.data.forEach(p => {
                                tbody.innerHTML += \`
                                    <tr>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">\${p.title}</td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 capitalize">\${p.type}</td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">Rp \${p.price.toLocaleString('id-ID')}</td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">\${p.stock}</td>
                                        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button onclick="deleteProduct('\${p.id}')" class="text-red-600 hover:text-red-900 dark:hover:text-red-400">Delete</button>
                                        </td>
                                    </tr>
                                \`;
                            });
                        } else {
                            tbody.innerHTML = '<tr><td colspan="5" class="px-6 py-4 text-center text-sm text-gray-500">No products found. Add one above.</td></tr>';
                        }
                    } catch (e) {
                        document.getElementById('products-tbody').innerHTML = '<tr><td colspan="5" class="px-6 py-4 text-center text-sm text-red-500">Failed to load products.</td></tr>';
                    }
                }

                document.addEventListener('DOMContentLoaded', loadProducts);

                document.getElementById('product-form').addEventListener('submit', async (e) => {
                    e.preventDefault();
                    const btn = document.getElementById('btn-save-product');
                    btn.disabled = true;

                    const payload = {
                        title: document.getElementById('p_title').value,
                        type: document.getElementById('p_type').value,
                        price: parseFloat(document.getElementById('p_price').value),
                        stock: parseInt(document.getElementById('p_stock').value)
                    };

                    try {
                        const response = await fetch('/api/tenant/products', {
                            method: 'POST',
                            headers: { 
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer ' + token
                            },
                            body: JSON.stringify(payload)
                        });
                        
                        const result = await response.json();
                        
                        if (result.success) {
                            window.showToast('Product added successfully', 'success');
                            document.getElementById('product-form').reset();
                            document.getElementById('product-form-container').classList.add('hidden');
                            loadProducts();
                        } else {
                            window.showToast(result.message, 'error');
                        }
                    } catch (error) {
                        window.showToast('Error saving product', 'error');
                    } finally {
                        btn.disabled = false;
                    }
                });

                window.deleteProduct = async function(id) {
                    if(!confirm('Are you sure you want to delete this product?')) return;
                    
                    try {
                        const response = await fetch('/api/tenant/products/' + id, {
                            method: 'DELETE',
                            headers: { 'Authorization': 'Bearer ' + token }
                        });
                        const result = await response.json();
                        if (result.success) {
                            window.showToast('Product deleted', 'success');
                            loadProducts();
                        } else {
                            window.showToast(result.message, 'error');
                        }
                    } catch (e) {
                        window.showToast('Error deleting product', 'error');
                    }
                };
            `}} />
        </div>,
        { title: 'Products' }
    );
});
