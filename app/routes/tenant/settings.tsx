import { createRoute } from 'honox/factory';

export default createRoute((c) => {
    return c.render(
        <div className="max-w-2xl mx-auto space-y-8">
            <h1 className="text-2xl font-bold text-gray-900">Pengaturan Akun</h1>
            
            {/* Bagian Ubah Password */}
            <div className="bg-white p-6 rounded-xl border border-gray-200">
                <h2 className="font-semibold mb-4">Keamanan</h2>
                <input type="password" id="new_pass" placeholder="Password Baru" className="w-full p-2 border rounded mb-2" />
                <button onClick="updatePassword()" className="bg-brand text-white px-4 py-2 rounded">Simpan Password</button>
            </div>

            {/* Histori & Status Langganan */}
            <div className="bg-white p-6 rounded-xl border border-gray-200">
                <h2 className="font-semibold mb-4">Riwayat Langganan</h2>
                <div id="subs-history" className="text-sm">Memuat data...</div>
            </div>
            
            <script dangerouslySetInnerHTML={{ __html: `
                async function loadAccount() {
                    const res = await fetch('/api/account/profile', { headers: { 'Authorization': 'Bearer ' + localStorage.getItem('auth_token') } });
                    const { data } = await res.json();
                    document.getElementById('subs-history').innerHTML = data.projects.map(p => 
                        \`<div class="flex justify-between border-b py-2"><span>\${p.project_name}</span><span>\${p.subscription_status}</span></div>\`
                    ).join('');
                }
                loadAccount();
            `}} />
        </div>
    );
});
