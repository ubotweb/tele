import { createRoute } from 'honox/factory';

export default createRoute((c) => {
    return c.render(
        <div className="max-w-md mx-auto bg-white dark:bg-darkcard p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 mt-12">
            <div className="text-center mb-8">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-brand mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create Tenant Account</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Daftarkan toko digital berbasis bot Telegram Anda</p>
            </div>
            
            <form id="register-form" className="space-y-5">
                <div>
                    <label htmlFor="store_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nama Toko / Bisnis</label>
                    <input type="text" id="store_name" name="store_name" required placeholder="Contoh: Indovoucher Digital" className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-darkbg text-gray-900 dark:text-white focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all" />
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Alamat Email</label>
                    <input type="email" id="email" name="email" required placeholder="nama@email.com" className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-darkbg text-gray-900 dark:text-white focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all" />
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password Akun</label>
                    <input type="password" id="password" name="password" required placeholder="••••••••" className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-darkbg text-gray-900 dark:text-white focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all" />
                </div>
                
                <button type="submit" id="btn-submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-brand hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand transition-colors">
                    Register Now (7 Days Free Trial)
                </button>
            </form>

            <div className="mt-6 text-center text-sm">
                <span className="text-gray-500 dark:text-gray-400">Sudah memiliki akun? </span>
                <a href="/login" className="text-brand font-medium hover:underline">Masuk disini</a>
            </div>

            <script dangerouslySetInnerHTML={{ __html: `
                document.getElementById('register-form').addEventListener('submit', async (e) => {
                    e.preventDefault();
                    const btn = document.getElementById('btn-submit');
                    const store_name = document.getElementById('store_name').value;
                    const email = document.getElementById('email').value;
                    const password = document.getElementById('password').value;
                    
                    btn.disabled = true;
                    btn.innerText = 'Creating Environment...';

                    try {
                        const response = await fetch('/api/auth/register', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ store_name, email, password })
                        });
                        
                        const result = await response.json();
                        
                        if (result.success) {
                            alert(result.message);
                            window.location.href = '/login';
                        } else {
                            alert(result.message || 'Registrasi gagal dilakukan');
                            btn.disabled = false;
                            btn.innerText = 'Register Now (7 Days Free Trial)';
                        }
                    } catch (error) {
                        alert('Terjadi kesalahan jaringan selama proses pendaftaran.');
                        btn.disabled = false;
                        btn.innerText = 'Register Now (7 Days Free Trial)';
                    }
                });
            `}} />
        </div>,
        { title: 'Create Account' }
    );
});
