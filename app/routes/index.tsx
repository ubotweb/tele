import { createRoute } from 'honox/factory';

export default createRoute((c) => {
    return c.render(
        <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-darkbg">
            {/* Header / Navigation Menu */}
            <header className="w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-darkcard/80 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <a href="/" className="font-extrabold text-xl text-transparent bg-clip-text bg-gradient-to-r from-brand to-cyan-400 tracking-tight">
                        Ubot Web
                    </a>
                    <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-600 dark:text-gray-300 items-center">
                        <a href="/" className="text-brand">Home</a>
                        <a href="/about" className="hover:text-brand transition-colors">About Us</a>
                        <a href="/privacy" className="hover:text-brand transition-colors">Privacy Policy</a>
                        <a href="/terms" className="hover:text-brand transition-colors">Terms of Service</a>
                        <a href="/login" className="px-4 py-2 bg-brand text-white rounded-lg hover:bg-sky-600 transition-colors">Login / Register</a>
                    </nav>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-grow flex flex-col items-center justify-center text-center px-4 py-16">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 text-brand text-sm font-semibold mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Next-Gen Automation
                </div>
                
                <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white tracking-tight max-w-4xl leading-tight">
                    Powering <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-cyan-400">Ubot Web</span> for Telegram & TikTok
                </h1>
                
                <p className="mt-6 text-lg md:text-xl text-gray-500 dark:text-gray-400 max-w-2xl">
                    The ultimate platform to deploy automated digital storefronts on Telegram and TikTok. Simplify your workflow with a fully automatic, legal, and highly secure system. Sell products seamlessly with QRIS integration.
                </p>
                
                <div className="mt-10 flex flex-col sm:flex-row gap-4">
                    <a href="/login" className="px-8 py-3.5 border border-transparent text-base font-medium rounded-lg text-white bg-brand hover:bg-sky-600 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand">
                        Access Dashboard
                    </a>
                    <a href="#features" className="px-8 py-3.5 border border-gray-300 dark:border-gray-700 text-base font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-darkcard hover:bg-gray-50 dark:hover:bg-gray-800 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                        Learn More
                    </a>
                </div>

                <div id="features" className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 text-left max-w-5xl">
                    <div className="p-6 bg-white dark:bg-darkcard rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
                        <div className="w-10 h-10 rounded-lg bg-brand/10 flex items-center justify-center text-brand mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Strict Isolation</h3>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Every tenant operates in an entirely isolated environment, ensuring maximum privacy and data security across platforms.</p>
                    </div>
                    <div className="p-6 bg-white dark:bg-darkcard rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
                        <div className="w-10 h-10 rounded-lg bg-brand/10 flex items-center justify-center text-brand mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Legal & Secure</h3>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Operate with peace of mind. Our system is built to comply with strict legal standards, offering a safe environment for your business.</p>
                    </div>
                    <div className="p-6 bg-white dark:bg-darkcard rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
                        <div className="w-10 h-10 rounded-lg bg-brand/10 flex items-center justify-center text-brand mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Fully Automated</h3>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Simplify your workload. From QRIS payments to product delivery, everything runs on autopilot 24/7 seamlessly.</p>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="w-full border-t border-gray-200 dark:border-gray-800 py-8 bg-white dark:bg-darkcard text-center mt-auto">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    &copy; {new Date().getFullYear()} Ubot Web by PT Pasdigi Global Inovasi. All rights reserved.
                </p>
            </footer>
        </div>,
        { title: 'Home - Ubot Web' }
    );
});
