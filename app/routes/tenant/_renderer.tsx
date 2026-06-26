import { jsxRenderer } from 'hono/jsx-renderer';
import { Layout } from '../../components/Layout';
import { Sidebar } from '../../components/Sidebar';

export default jsxRenderer(({ children, title }) => {
    return (
        <Layout title={title || 'Tenant Dashboard'}>
            <div className="flex flex-col md:flex-row gap-6">
                <Sidebar />
                <div className="flex-1 bg-white dark:bg-darkcard rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
                    {children}
                </div>
            </div>

            {/* Skrip Keamanan Klien & Fungsi Toast Global */}
            <script dangerouslySetInnerHTML={{ __html: `
                // 1. Proteksi Rute Klien
                const token = localStorage.getItem('auth_token');
                if (!token) {
                    window.location.href = '/login';
                }

                // 2. Fungsi Toast Alert Global
                window.showToast = function(message, type = 'success') {
                    const container = document.getElementById('toast-container');
                    if (!container) return;
                    
                    const toast = document.createElement('div');
                    const bgColor = type === 'success' ? 'bg-green-600' : 'bg-red-500';
                    toast.className = \`max-w-sm w-full \${bgColor} text-white text-sm font-medium px-4 py-3 rounded-lg shadow-lg transition-all duration-300 opacity-0 transform translate-y-2 flex items-center gap-3\`;
                    
                    const iconSvg = type === 'success' 
                        ? '<svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>'
                        : '<svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>';
                        
                    toast.innerHTML = iconSvg + '<span>' + message + '</span>';
                    container.appendChild(toast);
                    
                    // Animasi masuk
                    requestAnimationFrame(() => {
                        toast.classList.remove('opacity-0', 'translate-y-2');
                    });
                    
                    // Hapus otomatis setelah 3 detik
                    setTimeout(() => {
                        toast.classList.add('opacity-0', 'translate-y-2');
                        setTimeout(() => { toast.remove(); }, 300);
                    }, 3000);
                };

                // 3. Fungsi Logout Global
                window.logout = function() {
                    localStorage.removeItem('auth_token');
                    window.location.href = '/login';
                };
            `}} />
        </Layout>
    );
});
