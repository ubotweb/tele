import { createRoute } from 'honox/factory';

export default createRoute((c) => {
    return c.render(
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Store Banners</h1>

            <form id="banner-form" className="bg-gray-50 dark:bg-gray-800/50 p-5 rounded-xl border border-gray-100 dark:border-gray-700 space-y-4">
                <input type="hidden" id="edit_id" value="" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Banner Title (Optional)</label>
                        <input type="text" id="b_title" placeholder="Special Promo" className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-darkbg text-gray-900 dark:text-white" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Target Link URL (Optional)</label>
                        <input type="url" id="b_target" placeholder="https://..." className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-darkbg text-gray-900 dark:text-white" />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Banner Image Upload</label>
                        <input type="file" id="b_image" accept="image/*" className="mt-1 block w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md cursor-pointer bg-white dark:text-gray-400 focus:outline-none dark:bg-darkbg dark:border-gray-600" />
                        <p className="text-xs text-gray-500 mt-1" id="img-help">Required for new banners.</p>
                    </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                    <button type="button" id="btn-cancel-edit" className="hidden px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg">Cancel</button>
                    <button type="submit" id="btn-save-banner" className="px-6 py-2 text-sm font-medium text-white bg-brand hover:bg-sky-600 rounded-lg shadow-sm">Upload Banner</button>
                </div>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="banners-container">
                <p className="text-gray-500 text-sm">Loading banners...</p>
            </div>

            <script dangerouslySetInnerHTML={{ __html: `
                const token = localStorage.getItem('auth_token');
                
                async function loadBanners() {
                    const res = await fetch('/api/projects/' + window.CURRENT_PROJECT_ID + '/banners', { headers: { 'Authorization': 'Bearer ' + token }});
                    const data = await res.json();
                    const container = document.getElementById('banners-container');
                    
                    if (data.success && data.data.length > 0) {
                        container.innerHTML = '';
                        data.data.forEach(b => {
                            const bData = JSON.stringify(b).replace(/'/g, "&apos;").replace(/"/g, "&quot;");
                            container.innerHTML += \`
                                <div class="bg-white dark:bg-darkcard border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm flex flex-col">
                                    <div class="h-32 bg-gray-200 dark:bg-gray-700 w-full bg-cover bg-center" style="background-image: url('\${b.image_url}')"></div>
                                    <div class="p-4 flex-grow flex flex-col justify-between">
                                        <div>
                                            <h3 class="font-bold text-gray-900 dark:text-white text-sm truncate">\${b.title || 'Untitled Banner'}</h3>
                                            \${b.target_url ? \`<a href="\${b.target_url}" target="_blank" class="text-xs text-brand hover:underline truncate block mt-1">Link attached</a>\` : ''}
                                        </div>
                                        <div class="mt-4 flex gap-3">
                                            <button onclick="editBanner('\${bData}')" class="text-xs font-medium text-brand hover:text-sky-700">Edit</button>
                                            <button onclick="deleteBanner('\${b.id}')" class="text-xs font-medium text-red-600 hover:text-red-800">Delete</button>
                                        </div>
                                    </div>
                                </div>
                            \`;
                        });
                    } else {
                        container.innerHTML = '<p class="text-gray-500 text-sm col-span-full">No banners active.</p>';
                    }
                }

                document.addEventListener('DOMContentLoaded', loadBanners);

                window.editBanner = function(bStr) {
                    const b = JSON.parse(bStr.replace(/&quot;/g, '"').replace(/&apos;/g, "'"));
                    document.getElementById('edit_id').value = b.id;
                    document.getElementById('b_title').value = b.title || '';
                    document.getElementById('b_target').value = b.target_url || '';
                    
                    document.getElementById('btn-save-banner').innerText = 'Update Banner';
                    document.getElementById('btn-cancel-edit').classList.remove('hidden');
                    document.getElementById('img-help').innerText = 'Leave empty to keep current image.';
                    window.scrollTo(0,0);
                };

                document.getElementById('btn-cancel-edit').addEventListener('click', () => {
                    document.getElementById('banner-form').reset();
                    document.getElementById('edit_id').value = '';
                    document.getElementById('btn-save-banner').innerText = 'Upload Banner';
                    document.getElementById('btn-cancel-edit').classList.add('hidden');
                    document.getElementById('img-help').innerText = 'Required for new banners.';
                });

                document.getElementById('banner-form').addEventListener('submit', async (e) => {
                    e.preventDefault();
                    const btn = document.getElementById('btn-save-banner');
                    btn.disabled = true;

                    const id = document.getElementById('edit_id').value;
                    const isUpdate = id !== '';
                    const url = isUpdate ? \`/api/projects/\${window.CURRENT_PROJECT_ID}/banners/\${id}\` : \`/api/projects/\${window.CURRENT_PROJECT_ID}/banners\`;
                    const method = isUpdate ? 'PUT' : 'POST';

                    const formData = new FormData();
                    formData.append('title', document.getElementById('b_title').value);
                    formData.append('target_url', document.getElementById('b_target').value);

                    const fileInput = document.getElementById('b_image');
                    if (fileInput.files.length > 0) {
                        formData.append('image', fileInput.files[0]);
                    } else if (!isUpdate) {
                        window.showToast('Please select an image', 'error');
                        btn.disabled = false;
                        return;
                    }

                    try {
                        const response = await fetch(url, { method: method, headers: { 'Authorization': 'Bearer ' + token }, body: formData });
                        const result = await response.json();
                        if (result.success) {
                            window.showToast(isUpdate ? 'Banner updated' : 'Banner uploaded', 'success');
                            document.getElementById('btn-cancel-edit').click();
                            loadBanners();
                        } else { window.showToast(result.message, 'error'); }
                    } catch (error) { window.showToast('Error saving banner', 'error'); } 
                    finally { btn.disabled = false; }
                });

                window.deleteBanner = async function(id) {
                    if(!confirm('Remove this banner?')) return;
                    await fetch('/api/projects/' + window.CURRENT_PROJECT_ID + '/banners/' + id, { method: 'DELETE', headers: { 'Authorization': 'Bearer ' + token }});
                    loadBanners();
                };
            `}} />
        </div>,
        { title: 'Banners' }
    );
});
