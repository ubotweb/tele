import { jsxRenderer } from 'hono/jsx-renderer';
import { Layout } from '../../../../components/Layout';

export default jsxRenderer(({ children, title }, c) => {
    // Menangkap ID Project dari URL untuk diinjeksi ke link navigasi
    const projectId = c.req.param('project_id');
    
    return (
        <Layout title={title || 'Project Dashboard'}>
            <div className="flex flex-col md:flex-row gap-6">
                {/* Navigasi Samping Dinamis Khusus Project Ini */}
                <aside className="w-full md:w-64 flex-shrink-0">
                    <div className="bg-white dark:bg-darkcard rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden sticky top-24">
                        <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                            <a href="/tenant" className="text-xs font-medium text-brand hover:underline flex items-center gap-1">
                                &larr; Back to My Projects
                            </a>
                        </div>
                        <nav className="flex flex-col p-4 space-y-1">
                            <a href={`/tenant/project/${projectId}`} className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                                <span className="font-medium text-sm">Overview</span>
                            </a>
                            <a href={`/tenant/project/${projectId}/bot`} className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                                <span className="font-medium text-sm">Bot Settings</span>
                            </a>
                            <a href={`/tenant/project/${projectId}/categories`} className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                                <span className="font-medium text-sm">Categories</span>
                            </a>
                            <a href={`/tenant/project/${projectId}/products`} className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                                <span className="font-medium text-sm">Products</span>
                            </a>
                            <a href={`/tenant/project/${projectId}/banners`} className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                                <span className="font-medium text-sm">Banners</span>
                            </a>
                            <a href={`/tenant/project/${projectId}/commands`} className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                                <span className="font-medium text-sm">Bot Commands</span>
                            </a>
                        </nav>
                    </div>
                </aside>
                
                <div className="flex-1 bg-white dark:bg-darkcard rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
                    {/* Menyuntikkan Project ID ke variabel global Window agar bisa dibaca oleh script klien di halaman anak */}
                    <script dangerouslySetInnerHTML={{ __html: `window.CURRENT_PROJECT_ID = "${projectId}";` }} />
                    {children}
                </div>
            </div>
        </Layout>
    );
});
