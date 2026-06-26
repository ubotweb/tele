import { jsxRenderer } from 'hono/jsx-renderer';
import { Layout } from '../../components/Layout';
import { AdminSidebar } from '../../components/AdminSidebar';

export default jsxRenderer(({ children, title }) => {
    return (
        <Layout title={title || 'Super Admin Panel'}>
            <div className="flex flex-col md:flex-row gap-6">
                
                {/* Komponen Navigasi Samping Admin */}
                <AdminSidebar />
                
                {/* Kontainer Utama */}
                <div className="flex-1 bg-white dark:bg-darkcard rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 min-h-[80vh]">
                    {children}
                </div>
                
            </div>

            <script dangerouslySetInnerHTML={{ __html: `
                function parseJwt(token) {
                    try {
                        const base64Url = token.split('.')[1];
                        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                        }).join(''));
                        return JSON.parse(jsonPayload);
                    } catch (e) {
                        return null;
                    }
                }

                const token = localStorage.getItem('auth_token');
                if (!token) {
                    window.location.href = '/login';
                } else {
                    const payload = parseJwt(token);
                    if (!payload || payload.role !== 'admin') {
                        window.location.href = '/login';
                    }
                }

                window.logout = function() {
                    localStorage.removeItem('auth_token');
                    window.location.href = '/login';
                };

                window.showToast = function(message, type = 'success') {
                    const container = document.getElementById('toast-container');
                    if (!container) return;
                    const toast = document.createElement('div');
                    const bgColor = type === 'success' ? 'bg-green-600' : 'bg-red-500';
                    toast.className = \`max-w-sm w-full \${bgColor} text-white text-sm font-medium px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 transition-all duration-300 animate-slide-up\`;
                    
                    const iconSvg = type === 'success' 
                        ? '<svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>'
                        : '<svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>';
                    
                    toast.innerHTML = iconSvg + '<span>' + message + '</span>';
                    container.appendChild(toast);
                    setTimeout(() => { toast.remove(); }, 3000);
                };
            `}} />
        </Layout>
    );
});
