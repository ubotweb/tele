import { jsxRenderer, useRequestContext } from 'hono/jsx-renderer';
import { Layout } from '../../components/Layout';

export default jsxRenderer(({ children, title }) => {
    const c = useRequestContext();
    const projectId = c.req.param('project_id');

    return (
        <Layout title={title || (projectId ? 'Project Workspace' : 'Tenant Dashboard')}>
            <div className="flex flex-col md:flex-row gap-6 relative min-h-screen">
                
                {/* DESKTOP SIDEBAR */}
                <aside className="hidden md:flex w-64 flex-shrink-0 flex-col">
                    <div className="bg-white dark:bg-darkcard rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden sticky top-24">
                        <nav className="flex flex-col p-4 space-y-1">
                            {!projectId ? (
                                <>
                                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 pt-2 pb-1">Main Menu</div>
                                    <a href="/tenant" className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                                        <span className="font-medium text-sm">Projects</span>
                                    </a>
                                    <a href="/tenant/cloud" className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>
                                        <span className="font-medium text-sm">Cloud Storage</span>
                                    </a>
                                    <a href="/tenant/settings" className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                        <span className="font-medium text-sm">Settings</span>
                                    </a>
                                </>
                            ) : (
                                <>
                                    <a href="/tenant" className="flex items-center gap-3 px-4 py-3 text-brand bg-brand/10 hover:bg-brand/20 rounded-lg mb-2 transition-colors border border-brand/20">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                                        <span className="font-medium text-sm">Back to Projects</span>
                                    </a>
                                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 pt-2 pb-1">Menu</div>
                                    <a href={`/tenant/project/${projectId}`} className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"><span className="font-medium text-sm">Dashboard</span></a>
                                    <a href={`/tenant/project/${projectId}/bot`} className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"><span className="font-medium text-sm">Telegram Token</span></a>
                                    <a href={`/tenant/project/${projectId}/products`} className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"><span className="font-medium text-sm">Products</span></a>
                                    <a href={`/tenant/project/${projectId}/transactions`} className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"><span className="font-medium text-sm">Orders</span></a>
                                </>
                            )}
                            
                            <div className="pt-4 mt-4 border-t border-gray-100 dark:border-gray-700">
                                <button onClick="window.logout()" className="w-full flex items-center gap-3 px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-left">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                                    <span className="font-medium text-sm">Sign Out</span>
                                </button>
                            </div>
                        </nav>
                    </div>
                </aside>

                <div className="flex-1 bg-white dark:bg-darkcard rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-4 md:p-6 pb-24 md:pb-6">
                    {children}
                </div>

                {/* MOBILE STICKY BOTTOM NAV */}
                <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-darkcard/95 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 flex justify-around items-center p-2 z-50 pb-safe">
                    {!projectId ? (
                        <>
                            <a href="/tenant" className="flex flex-col items-center p-2 text-brand">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                                <span className="text-[10px] font-medium mt-1">Projects</span>
                            </a>
                            <a href="/tenant/cloud" className="flex flex-col items-center p-2 text-gray-500 dark:text-gray-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>
                                <span className="text-[10px] font-medium mt-1">Cloud</span>
                            </a>
                            <a href="/tenant/settings" className="flex flex-col items-center p-2 text-gray-500 dark:text-gray-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                <span className="text-[10px] font-medium mt-1">Settings</span>
                            </a>
                        </>
                    ) : (
                        <>
                            <a href={`/tenant/project/${projectId}`} className="flex flex-col items-center p-2 text-brand">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                                <span className="text-[10px] font-medium mt-1">Home</span>
                            </a>
                            <a href={`/tenant/project/${projectId}/products`} className="flex flex-col items-center p-2 text-gray-500 dark:text-gray-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                                <span className="text-[10px] font-medium mt-1">Products</span>
                            </a>
                            <a href={`/tenant/project/${projectId}/transactions`} className="flex flex-col items-center p-2 text-gray-500 dark:text-gray-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                                <span className="text-[10px] font-medium mt-1">Orders</span>
                            </a>
                        </>
                    )}
                    <button onClick="window.logout()" className="flex flex-col items-center p-2 text-red-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                        <span className="text-[10px] font-medium mt-1">Logout</span>
                    </button>
                </nav>
            </div>

            <script dangerouslySetInnerHTML={{ __html: `
                {
                    const _token = localStorage.getItem('auth_token');
                    if (!_token) {
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
                    toast.className = \`max-w-sm w-full \${bgColor} text-white text-sm font-medium px-4 py-3 rounded-lg shadow-lg transition-all duration-300 opacity-0 transform translate-y-2 flex items-center gap-3 mb-2\`;
                    
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
            `}} />
        </Layout>
    );
});
