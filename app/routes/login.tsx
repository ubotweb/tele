import { createRoute } from 'honox/factory';

export default createRoute((c) => {
    return c.render(
        <div className="max-w-md mx-auto bg-white dark:bg-darkcard p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 mt-12">
            <div className="text-center mb-8">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-brand mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Secure Access</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Sign in to manage your Telegram SaaS Bot</p>
            </div>
            
            <form id="login-form" className="space-y-6">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                    <input type="email" id="email" name="email" required className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-darkbg text-gray-900 dark:text-white focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all" />
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                    <input type="password" id="password" name="password" required className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-darkbg text-gray-900 dark:text-white focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all" />
                </div>
                <button type="submit" id="btn-submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-brand hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand transition-colors">
                    Sign In
                </button>
            </form>

            <script dangerouslySetInnerHTML={{ __html: `
                document.getElementById('login-form').addEventListener('submit', async (e) => {
                    e.preventDefault();
                    const btn = document.getElementById('btn-submit');
                    const email = document.getElementById('email').value;
                    const password = document.getElementById('password').value;
                    
                    btn.disabled = true;
                    btn.innerText = 'Authenticating...';

                    try {
                        const response = await fetch('/api/auth/login', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ email, password })
                        });
                        
                        const result = await response.json();
                        
                        if (result.success) {
                            // Mengamankan token di localStorage untuk request selanjutnya
                            localStorage.setItem('auth_token', result.data.token);
                            
                            // Pengalihan berdasarkan akses role
                            if (result.data.role === 'admin') {
                                window.location.href = '/admin';
                            } else {
                                window.location.href = '/tenant';
                            }
                        } else {
                            alert(result.message || 'Login failed');
                            btn.disabled = false;
                            btn.innerText = 'Sign In';
                        }
                    } catch (error) {
                        alert('An error occurred during authentication.');
                        btn.disabled = false;
                        btn.innerText = 'Sign In';
                    }
                });
            `}} />
        </div>,
        { title: 'Secure Login' }
    );
});
