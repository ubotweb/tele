import { createRoute } from 'honox/factory';

export default createRoute((c) => {
    return c.render(
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Cloud Storage Configuration</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Connect your Cloudinary account to store digital products securely.</p>
            </div>

            <form id="cloud-form" className="space-y-5 max-w-2xl">
                <div>
                    <label htmlFor="cloud_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Cloud Name</label>
                    <input type="text" id="cloud_name" required placeholder="dxyz123" className="mt-1 block w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-darkbg text-gray-900 dark:text-white focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all" />
                </div>

                <div>
                    <label htmlFor="api_key" className="block text-sm font-medium text-gray-700 dark:text-gray-300">API Key</label>
                    <input type="text" id="api_key" required placeholder="123456789012345" className="mt-1 block w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-darkbg text-gray-900 dark:text-white focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all" />
                </div>

                <div>
                    <label htmlFor="api_secret" className="block text-sm font-medium text-gray-700 dark:text-gray-300">API Secret</label>
                    <input type="password" id="api_secret" required placeholder="••••••••••••••••••••••••••" className="mt-1 block w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-darkbg text-gray-900 dark:text-white focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all" />
                </div>

                <button type="submit" id="btn-save-cloud" className="inline-flex justify-center py-2.5 px-6 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-brand hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand transition-colors">
                    Save Configuration
                </button>
            </form>

            <script dangerouslySetInnerHTML={{ __html: `
                document.getElementById('cloud-form').addEventListener('submit', async (e) => {
                    e.preventDefault();
                    const btn = document.getElementById('btn-save-cloud');
                    const cloud_name = document.getElementById('cloud_name').value;
                    const api_key = document.getElementById('api_key').value;
                    const api_secret = document.getElementById('api_secret').value;
                    const token = localStorage.getItem('auth_token');
                    
                    btn.disabled = true;
                    btn.innerText = 'Saving...';

                    try {
                        const response = await fetch('/api/tenant/cloud', {
                            method: 'POST',
                            headers: { 
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer ' + token
                            },
                            body: JSON.stringify({ cloud_name, api_key, api_secret })
                        });
                        
                        const result = await response.json();
                        
                        if (result.success) {
                            window.showToast('Cloud configuration saved successfully', 'success');
                            document.getElementById('api_secret').value = ''; // Mengosongkan form secret demi keamanan
                        } else {
                            window.showToast(result.message || 'Configuration failed', 'error');
                        }
                    } catch (error) {
                        window.showToast('Network error occurred', 'error');
                    } finally {
                        btn.disabled = false;
                        btn.innerText = 'Save Configuration';
                    }
                });
            `}} />
        </div>,
        { title: 'Cloud Configuration' }
    );
});
