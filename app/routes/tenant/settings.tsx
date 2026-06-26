import { createRoute } from 'honox/factory';

export default createRoute((c) => {
    return c.render(
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Pengaturan Akun & Keamanan</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Kelola data profil dan pantau riwayat langganan bot Anda.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* KOLOM KIRI: Ganti Password */}
                <div className="md:col-span-1 space-y-6">
                    <div className="bg-white dark:bg-darkcard border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg></div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">Profil Anda</h3>
                        </div>
                        <div className="mb-4">
                            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Email Login</label>
                            <div id="user-email" className="font-medium text-sm text-gray-900 dark:text-white px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700">Loading...</div>
                        </div>
                    </div>

                    <form id="form-password" className="bg-white dark:bg-darkcard border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-brand/10 text-brand rounded-lg"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg></div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">Ubah Password</h3>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="new_password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password Baru</label>
                            <input type="password" id="new_password" required minLength={6} placeholder="Minimal 6 karakter" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-darkbg text-gray-900 dark:text-white focus:ring-2 focus:ring-brand outline-none" />
                        </div>
                        <button type="submit" id="btn-pass" className="w-full bg-brand hover:bg-sky-600 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm">Update Password</button>
                    </form>
                </div>

                {/* KOLOM KANAN: Histori Langganan */}
                <div className="md:col-span-2">
                    <div className="bg-white dark:bg-darkcard border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm">
                        <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                            <h3 className="font-semibold text-gray-900 dark:text-white">Riwayat Langganan Project</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-800/50">
                                    <tr>
                                        <th scope="col" className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Bot/Project</th>
                                        <th scope="col" className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th scope="col" className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Berakhir Pada</th>
                                    </tr>
                                </thead>
                                <tbody id="subs-tbody" className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-transparent">
                                    <tr><td colSpan={3} className="px-5 py-8 text-center text-sm text-gray-500">Memuat data histori...</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

            </div>

            <script dangerouslySetInnerHTML={{ __html: `
                const tk = localStorage.getItem('auth_token');

                async function loadProfileData() {
                    try {
                        const res = await fetch('/api/account/profile', { headers: { 'Authorization': 'Bearer ' + tk } });
                        const result = await res.json();
                        
                        if(result.success) {
                            document.getElementById('user-email').innerText = result.data.user.email;
                            
                            const tbody = document.getElementById('subs-tbody');
                            if(result.data.projects.length === 0) {
                                tbody.innerHTML = '<tr><td colspan="3" class="px-5 py-6 text-center text-sm text-gray-500">Belum ada project yang dibuat.</td></tr>';
                                return;
                            }

                            let html = '';
                            result.data.projects.forEach(p => {
                                let badge = '';
                                if(p.subscription_status === 'active') badge = '<span class="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Aktif</span>';
                                else if(p.subscription_status === 'suspended') badge = '<span class="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">Ditangguhkan</span>';
                                else badge = '<span class="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Expired</span>';

                                const end = new Date(p.subscription_end_date).toLocaleDateString('id-ID', { year:'numeric', month:'short', day:'numeric' });
                                
                                html += \`<tr>
                                    <td class="px-5 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">\${p.store_name}</td>
                                    <td class="px-5 py-4 whitespace-nowrap">\${badge}</td>
                                    <td class="px-5 py-4 whitespace-nowrap text-sm text-gray-500">\${end}</td>
                                </tr>\`;
                            });
                            tbody.innerHTML = html;
                        }
                    } catch(e) {
                        console.error(e);
                        window.showToast('Gagal memuat profil', 'error');
                    }
                }

                document.getElementById('form-password').addEventListener('submit', async (e) => {
                    e.preventDefault();
                    const btn = document.getElementById('btn-pass');
                    const new_password = document.getElementById('new_password').value;
                    
                    btn.disabled = true;
                    btn.innerText = 'Menyimpan...';

                    try {
                        const res = await fetch('/api/account/update-password', {
                            method: 'POST',
                            headers: { 'Authorization': 'Bearer ' + tk, 'Content-Type': 'application/json' },
                            body: JSON.stringify({ new_password })
                        });
                        const data = await res.json();
                        
                        if(data.success) {
                            window.showToast(data.message, 'success');
                            document.getElementById('new_password').value = '';
                        } else {
                            window.showToast(data.message, 'error');
                        }
                    } catch(e) {
                        window.showToast('Terjadi kesalahan jaringan', 'error');
                    } finally {
                        btn.disabled = false;
                        btn.innerText = 'Update Password';
                    }
                });

                document.addEventListener('DOMContentLoaded', loadProfileData);
            `}} />
        </div>,
        { title: 'Pengaturan Akun' }
    );
});
