import { jsxRenderer } from 'hono/jsx-renderer';
import { Layout } from '../../components/Layout';

export default jsxRenderer(({ children, title }) => {
    return (
        <Layout title={title || 'Admin Area'}>
            <div className="flex flex-col bg-white dark:bg-darkcard rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 min-h-[80vh]">
                <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-6 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        Super Admin Panel
                    </h2>
                    <button onClick="logout()" className="text-sm font-medium text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300">
                        Sign Out
                    </button>
                </div>
                <div className="flex-1">
                    {children}
                </div>
            </div>

            <script dangerouslySetInnerHTML={{ __html: `
                // Verifikasi Klien Admin Role
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
                    toast.className = \`max-w-sm w-full \${bgColor} text-white text-sm font-medium px-4 py-3 rounded-lg shadow-lg flex items-center gap-3\`;
                    toast.innerHTML = '<span>' + message + '</span>';
                    container.appendChild(toast);
                    setTimeout(() => { toast.remove(); }, 3000);
                };
            `}} />
        </Layout>
    );
});
