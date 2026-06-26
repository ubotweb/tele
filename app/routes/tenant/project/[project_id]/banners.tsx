import { createRoute } from 'honox/factory';

export default createRoute((c) => {
    return c.render(
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 dark:border-gray-700 pb-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Store Banners</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage promotional banners for your MiniApp interface.</p>
                </div>
            </div>

            <form id="banner-form" className="bg-gray-50 dark:bg-gray-800/50 p-5 rounded-xl border border-gray-100 dark:border-gray-700 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Banner Title (Optional)</label>
                        <input type="text" id="b_title" placeholder="Special Promo" className="mt-1 block w-full px-3 py-2.5 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-darkbg text-gray-900 dark:text-white" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Image URL</label>
                        <input type="url" id="b_image" required placeholder="https://example.com/promo.jpg" className="mt-1 block w-full px-3 py-2.5 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-darkbg text-gray-900 dark:text-white" />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Target Link URL (Optional)</label>
                        <input type="url" id="b_target" placeholder="https://..." className="mt-1 block w-full px-3 py-2.5 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-darkbg text-gray-900 dark:text-white" />
                        <p className="text-xs text-gray-500 mt-1">URL to open when the banner is clicked.</p>
                    </div>
                </div>
                <div className="flex justify-end pt-2">
                    <button type="submit" id="btn-save-banner" className="px-6 py-2.5 text-sm font-medium text-white bg-brand hover:bg-sky-600 rounded-lg shadow-sm">
                        Upload Banner
                    </button>
                </div>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="banners-container">
                <p className="text-gray-500 text-sm">Loading banners...</p>
            </div>

            <script dangerouslySetInnerHTML={{ __html: `
                const token = localStorage.getItem('auth_token');
                
                async function loadBanners() {
                    const projectId = window.CURRENT_PROJECT_ID;
                    try {
                        const res = await fetch('/api/projects/' + projectId + '/banners', {
                            headers: { 'Authorization': 'Bearer ' + token }
                        });
                        const data = await res.json();
                        const container = document.getElementById('banners-container');
                        
                        if (data.success && data.data.length > 0) {
                            container.innerHTML = '';
                            data.data.forEach(b => {
                                container.innerHTML += \`
                                    <div class="bg-white dark:bg-darkcard border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm flex flex-col">
                                        <div class="h-32 bg-gray-200 dark:bg-gray-700 w-full bg-cover bg-center" style="background-image: url('\${b.image_url}')"></div>
                                        <div class="p-4 flex-grow flex flex-col justify-between">
                                            <div>
                                                <h3 class="font-bold text-gray-900 dark:text-white text-sm truncate">\${b.title || 'Untitled Banner'}</h3>
                                                \${b.target_url ? \`<a href="\${b.target_url}" target="_blank" class="text-xs text-brand hover:underline truncate block mt-1">Link attached</a>\` : ''}
                                            </div>
                                            <button onclick="deleteBanner('\${b.id}')" class="mt-4 text-xs font-medium text-red-600 hover:text-red-800 self-start">Delete Banner</button>
                                        </div>
                                    </div>
                                \`;
                            });
                        } else {
                            container.innerHTML = '<p class="text-gray-500 text-sm col-span-full py-8 text-center bg-white dark:bg-darkcard rounded-lg border border-gray-100 dark:border-gray-800">No banners active.</p>';
                        }
                    } catch (e) {
                        document.getElementById('banners-container').innerHTML = '<p class="text-red-500 text-sm col-span-full">Failed to load banners.</p>';
                    }
                }

                document.addEventListener('DOMContentLoaded', loadBanners);

                document.getElementById('banner-form').addEventListener('submit', async (e) => {
                    e.preventDefault();
                    const btn = document.getElementById('btn-save-banner');
                    btn.disabled = true;

                    const payload = {
                        title: document.getElementById('b_title').value,
                        image_url: document.getElementById('b_image').value,
                        target_url: document.getElementById('b_target').value
                    };

                    try {
                        const response = await fetch('/api/projects/' + window.CURRENT_PROJECT_ID + '/banners', {
                            method: 'POST',
                            headers: { 
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer ' + token
                            },
                            body: JSON.stringify(payload)
                        });
                        
                        const result = await response.json();
                        
                        if (result.success) {
                            window.showToast('Banner uploaded', 'success');
                            document.getElementById('banner-form').reset();
                            loadBanners();
                        } else {
                            window.showToast(result.message, 'error');
                        }
                    } catch (error) {
                        window.showToast('Error saving banner', 'error');
                    } finally {
                        btn.disabled = false;
                    }
                });

                window.deleteBanner = async function(id) {
                    if(!confirm('Remove this banner?')) return;
                    
                    try {
                        const response = await fetch('/api/projects/' + window.CURRENT_PROJECT_ID + '/banners/' + id, {
                            method: 'DELETE',
                            headers: { 'Authorization': 'Bearer ' + token }
                        });
                        const result = await response.json();
                        if (result.success) {
                            window.showToast('Banner removed', 'success');
                            loadBanners();
                        } else {
                            window.showToast(result.message, 'error');
                        }
                    } catch (e) {
                        window.showToast('Error deleting banner', 'error');
                    }
                };
            `}} />
        </div>,
        { title: 'Banner Management' }
    );
});
