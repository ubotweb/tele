import { createRoute } from 'honox/factory';

export default createRoute((c) => {
    const projectId = c.req.param('project_id');

    return c.render(
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Pengaturan Bot Telegram</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Konfigurasi token bot, identitas, dan Admin pengelola pesanan.</p>
            </div>

            <form id="bot-config-form" className="bg-white dark:bg-darkcard border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm space-y-5">
                
                {/* TOKEN & USERNAME */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bot Token (BotFather)</label>
                        <input type="text" id="bot_token" required placeholder="123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-darkbg focus:ring-2 focus:ring-brand outline-none" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bot Username (Opsional)</label>
                        <input type="text" id="bot_username" placeholder="@TokoSayaBot" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-darkbg focus:ring-2 focus:ring-brand outline-none" />
                    </div>
                </div>

                {/* IDENTITAS BOT */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bot Display Name</label>
                        <input type="text" id="display_name" placeholder="Toko Indo Voucher" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-darkbg focus:ring-2 focus:ring-brand outline-none" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Admin Telegram ID</label>
                        <input type="text" id="admin_telegram_id" placeholder="Misal: 987654321 (Dapatkan dari @userinfobot)" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-darkbg focus:ring-2 focus:ring-brand outline-none" />
                        <p className="text-xs text-gray-500 mt-1">ID ini digunakan untuk menerima notifikasi pesanan masuk.</p>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Deskripsi Bot / Pesan Sambutan</label>
                    <textarea id="description" rows={3} placeholder="Selamat datang di bot toko kami. Silakan pilih menu di bawah ini." className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-darkbg focus:ring-2 focus:ring-brand outline-none"></textarea>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                    <button type="submit" id="btn-save" className="bg-brand hover:bg-sky-600 text-white font-medium py-2 px-6 rounded-lg transition-colors">
                        Simpan Konfigurasi
                    </button>
                </div>
            </form>

            <script dangerouslySetInnerHTML={{ __html: `
                const projectId = "${projectId}";
                const tk = localStorage.getItem('auth_token');

                // Fungsi untuk mengambil data yang sudah ada dan mengisinya ke form
                async function loadBotData() {
                    try {
                        const res = await fetch(\`/api/projects/\${projectId}/bot\`, {
                            headers: { 'Authorization': 'Bearer ' + tk }
                        });
                        const result = await res.json();
                        
                        if (result.success && result.data) {
                            const data = result.data;
                            document.getElementById('bot_token').value = data.bot_token || '';
                            document.getElementById('bot_username').value = data.bot_username || '';
                            document.getElementById('display_name').value = data.display_name || '';
                            document.getElementById('admin_telegram_id').value = data.admin_telegram_id || '';
                            document.getElementById('description').value = data.description || '';
                        }
                    } catch (e) {
                        console.error('Gagal memuat data bot:', e);
                    }
                }

                document.getElementById('bot-config-form').addEventListener('submit', async (e) => {
                    e.preventDefault();
                    const btn = document.getElementById('btn-save');
                    
                    const payload = {
                        bot_token: document.getElementById('bot_token').value,
                        bot_username: document.getElementById('bot_username').value,
                        display_name: document.getElementById('display_name').value,
                        admin_telegram_id: document.getElementById('admin_telegram_id').value,
                        description: document.getElementById('description').value
                    };

                    btn.disabled = true;
                    btn.innerText = 'Menyimpan...';

                    try {
                        const res = await fetch(\`/api/projects/\${projectId}/bot\`, {
                            method: 'POST',
                            headers: { 
                                'Authorization': 'Bearer ' + tk,
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(payload)
                        });
                        
                        const result = await res.json();
                        if (result.success) {
                            window.showToast(result.message, 'success');
                        } else {
                            window.showToast(result.message, 'error');
                        }
                    } catch (error) {
                        window.showToast('Terjadi kesalahan jaringan', 'error');
                    } finally {
                        btn.disabled = false;
                        btn.innerText = 'Simpan Konfigurasi';
                    }
                });

                // Eksekusi load data saat halaman dimuat
                document.addEventListener('DOMContentLoaded', loadBotData);
            `}} />
        </div>,
        { title: 'Bot Setup' }
    );
});
