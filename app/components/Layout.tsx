import type { FC } from 'hono/jsx';

interface LayoutProps {
    title: string;
    children: any;
}

export const Layout: FC<LayoutProps> = (props) => {
    return (
        <html lang="en" className="antialiased">
            <head>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>{props.title} - Ubot Web</title>
                <script src="https://cdn.tailwindcss.com"></script>
                <script dangerouslySetInnerHTML={{ __html: `
                    tailwind.config = {
                        darkMode: 'class',
                        theme: {
                            extend: {
                                colors: {
                                    brand: '#0ea5e9',
                                    darkbg: '#0f172a',
                                    darkcard: '#1e293b'
                                }
                            }
                        }
                    };

                    // Inisialisasi tema otomatis
                    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                        document.documentElement.classList.add('dark');
                    } else {
                        document.documentElement.classList.remove('dark');
                    }

                    // Fungsi pergantian tema
                    function toggleTheme() {
                        if (document.documentElement.classList.contains('dark')) {
                            document.documentElement.classList.remove('dark');
                            localStorage.theme = 'light';
                        } else {
                            document.documentElement.classList.add('dark');
                            localStorage.theme = 'dark';
                        }
                    }
                `}} />
            </head>
            <body className="bg-gray-50 text-gray-900 dark:bg-darkbg dark:text-gray-100 min-h-screen flex flex-col transition-colors duration-300">
                
                {/* Header Global Ubot Web */}
                <header className="bg-white/90 dark:bg-darkcard/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 shadow-sm sticky top-0 z-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <a href="/" className="font-extrabold text-xl text-transparent bg-clip-text bg-gradient-to-r from-brand to-cyan-400 tracking-tight">
                                Ubot Web
                            </a>
                        </div>
                        
                        <div className="flex items-center gap-4 md:gap-8">
                            <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-600 dark:text-gray-300 items-center">
                                <a href="/" className="hover:text-brand transition-colors">Home</a>
                                <a href="/about" className="hover:text-brand transition-colors">About Us</a>
                                <a href="/privacy" className="hover:text-brand transition-colors">Privacy Policy</a>
                                <a href="/terms" className="hover:text-brand transition-colors">Terms of Service</a>
                                <a href="/login" className="hover:text-brand transition-colors">Login</a>
                            </nav>
                            
                            <button onClick="toggleTheme()" className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-brand">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </header>
                
                <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex flex-col">
                    {props.children}
                </main>

                {/* Footer Global Ubot Web */}
                <footer className="w-full border-t border-gray-200 dark:border-gray-800 py-8 bg-white dark:bg-darkcard text-center mt-auto">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        &copy; {new Date().getFullYear()} Ubot Web by PT Pasdigi Global Inovasi. All rights reserved.
                    </p>
                </footer>

                {/* Sistem Notifikasi Toast */}
                <div id="toast-container" className="fixed bottom-4 right-4 z-50 flex flex-col gap-2"></div>
            </body>
        </html>
    );
};
