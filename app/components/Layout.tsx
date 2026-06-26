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
                <title>{props.title} - SaaS Bot Panel</title>
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
                <header className="bg-white dark:bg-darkcard border-b border-gray-200 dark:border-gray-700 shadow-sm sticky top-0 z-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            {/* Ikon Logo Profesional */}
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                            </svg>
                            <span className="font-semibold text-lg tracking-tight">SaaS Panel</span>
                        </div>
                        <button onClick="toggleTheme()" className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-brand">
                            {/* Ikon Pergantian Mode */}
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                            </svg>
                        </button>
                    </div>
                </header>
                <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                    {props.children}
                </main>
                <div id="toast-container" className="fixed bottom-4 right-4 z-50 flex flex-col gap-2"></div>
            </body>
        </html>
    );
};
