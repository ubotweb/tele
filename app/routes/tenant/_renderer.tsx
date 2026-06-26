import { jsxRenderer, useRequestContext } from 'hono/jsx-renderer';

export default jsxRenderer(({ children }) => {
    // Mengambil konteks request untuk mengecek posisi URL saat ini
    const c = useRequestContext();
    const projectId = c.req.param('project_id'); // Akan terisi jika berada di route /tenant/project/:project_id/*

    return (
        // TIDAK MENGGUNAKAN <Layout> di sini karena sudah di-handle oleh app/routes/_renderer.tsx
        <div className="flex flex-col md:flex-row gap-6">
            
            {/* SIDEBAR DINAMIS */}
            <aside className="w-full md:w-64 flex-shrink-0">
                <div className="bg-white dark:bg-darkcard rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden sticky top-24">
                    <nav className="flex flex-col p-4 space-y-1">
                        
                        {!projectId ? (
                            /* =========================================
                               MENU LEVEL AKUN (Manajemen Project Global)
                               ========================================= */
                            <>
                                <a href="/tenant" className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                    </svg>
                                    <span className="font-medium text-sm">My Projects</span>
                                </a>
                                <a href="/tenant/cloud" className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                                    </svg>
                                    <span className="font-medium text-sm">Cloud Configuration</span>
                                </a>
                            </>
                        ) : (
                            /* =========================================
                               MENU LEVEL PROJECT (Spesifik 1 Bot)
                               ========================================= */
                            <>
                                <a href="/tenant" className="flex items-center gap-3 px-4 py-3 text-brand bg-brand/10 hover:bg-brand/20 rounded-lg mb-2 transition-colors border border-brand/20">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                    </svg>
                                    <span className="font-medium text-sm">Back to Projects</span>
                                </a>
                                
                                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 pt-2 pb-1">Bot Management</div>
                                
                                <a href={`/tenant/project/${projectId}`} className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                                    <span className="font-medium text-sm">Dashboard</span>
                                </a>
                                <a href={`/tenant/project/${projectId}/bot`} className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                                    <span className="font-medium text-sm">Telegram Token</span>
                                </a>
                                <a href={`/tenant/project/${projectId}/commands`} className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                                    <span className="font-medium text-sm">Custom Commands</span>
                                </a>

                                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 pt-4 pb-1">Store Engine</div>
                                
                                <a href={`/tenant/project/${projectId}/categories`} className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                                    <span className="font-medium text-sm">Categories</span>
                                </a>
                                <a href={`/tenant/project/${projectId}/products`} className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                                    <span className="font-medium text-sm">Products</span>
                                </a>
                                <a href={`/tenant/project/${projectId}/banners`} className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                                    <span className="font-medium text-sm">Banners</span>
                                </a>
                                <a href={`/tenant/project/${projectId}/transactions`} className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                                    <span className="font-medium text-sm">Transactions</span>
                                </a>
                            </>
                        )}
                        
                        {/* =========================================
                            TOMBOL LOGOUT GLOBAL
                            ========================================= */}
                        <div className="pt-4 mt-4 border-t border-gray-100 dark:border-gray-700">
                            <button onClick="logout()" className="w-full flex items-center gap-3 px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-left">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                <span className="font-medium text-sm">Sign Out</span>
                            </button>
                        </div>
                    </nav>
                </div>
            </aside>

            {/* AREA KONTEN UTAMA */}
            <div className="flex-1 bg-white dark:bg-darkcard rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 min-h-[80vh]">
                {children}
            </div>

            {/* SCRIPT GLOBAL (Auth & Toast) */}
            <script dangerouslySetInnerHTML={{ __html: `
                const token = localStorage.getItem('auth_token');
                if (!token) {
                    window.location.href = '/login';
                }

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
                    
                    requestAnimationFrame(() => { toast.classList.remove('opacity-0', 'translate-y-2'); });
                    
                    setTimeout(() => {
                        toast.classList.add('opacity-0', 'translate-y-2');
                        setTimeout(() => { toast.remove(); }, 300);
                    }, 3000);
                };

                window.logout = function() {
                    localStorage.removeItem('auth_token');
                    window.location.href = '/login';
                };
            `}} />
        </div>
    );
});
