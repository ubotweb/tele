import { jsxRenderer } from 'hono/jsx-renderer';
import { Layout } from '../components/Layout';

export default jsxRenderer(({ children, title }) => {
    return (
        <Layout title={title || 'Ubot Web'}>
            <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-darkbg">
                {/* Global Header / Navigation Menu */}
                <header className="w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-darkcard/80 backdrop-blur-md sticky top-0 z-50">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                        <a href="/" className="font-extrabold text-xl text-transparent bg-clip-text bg-gradient-to-r from-brand to-cyan-400 tracking-tight">
                            Ubot Web
                        </a>
                        <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-600 dark:text-gray-300 items-center">
                            <a href="/" className="hover:text-brand transition-colors">Home</a>
                            <a href="/about" className="hover:text-brand transition-colors">About Us</a>
                            <a href="/privacy" className="hover:text-brand transition-colors">Privacy Policy</a>
                            <a href="/terms" className="hover:text-brand transition-colors">Terms of Service</a>
                            <a href="/login" className="px-4 py-2 bg-brand text-white rounded-lg hover:bg-sky-600 transition-colors">Login / Register</a>
                        </nav>
                    </div>
                </header>

                {/* Main Content Dinamis */}
                {children}

                {/* Global Footer */}
                <footer className="w-full border-t border-gray-200 dark:border-gray-800 py-8 bg-white dark:bg-darkcard text-center mt-auto">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        &copy; {new Date().getFullYear()} Ubot Web by PT Pasdigi Global Inovasi. All rights reserved.
                    </p>
                </footer>
            </div>
        </Layout>
    );
});
