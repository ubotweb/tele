import { createRoute } from 'honox/factory';

export default createRoute((c) => {
    return c.render(
        <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-darkbg">
            <header className="w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-darkcard/80 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <a href="/" className="font-extrabold text-xl text-transparent bg-clip-text bg-gradient-to-r from-brand to-cyan-400 tracking-tight">
                        Ubot Web
                    </a>
                    <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-600 dark:text-gray-300 items-center">
                        <a href="/" className="hover:text-brand transition-colors">Home</a>
                        <a href="/about" className="hover:text-brand transition-colors">About Us</a>
                        <a href="/privacy" className="text-brand">Privacy Policy</a>
                        <a href="/terms" className="hover:text-brand transition-colors">Terms of Service</a>
                        <a href="/login" className="px-4 py-2 bg-brand text-white rounded-lg hover:bg-sky-600 transition-colors">Login / Register</a>
                    </nav>
                </div>
            </header>

            <main className="flex-grow max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8 w-full">
                <div className="bg-white dark:bg-darkcard rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-8 md:p-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 text-brand text-sm font-semibold mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        Data Protection
                    </div>
                    
                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-8">
                        Privacy Policy
                    </h1>
                    
                    <div className="space-y-8 text-gray-600 dark:text-gray-400 leading-relaxed">
                        <section>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">1. Data Collection and Purpose</h2>
                            <p>
                                At Ubot Web, we respect your privacy. We explicitly state that Ubot Web only uses data for the purpose of integration and communication between tenants and the Ubot Web team. The information collected is strictly limited to what is necessary to ensure the smooth operation of your automated Telegram and TikTok bots.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">2. Zero Data Selling Guarantee</h2>
                            <p>
                                Your trust is our top priority. We firmly guarantee that we will not sell, trade, or transfer tenant data in any way, shape, or form to any unauthorized third parties under any circumstances. Your business data belongs exclusively to you.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">3. Strict Security Standards</h2>
                            <p>
                                We continuously strive to protect and design the security of our tenants' personal data with the utmost strictness. Our infrastructure is built and maintained according to the latest industry security standards to prevent unauthorized access, data leaks, or malicious activities.
                            </p>
                        </section>
                    </div>
                </div>
            </main>

            <footer className="w-full border-t border-gray-200 dark:border-gray-800 py-8 bg-white dark:bg-darkcard text-center mt-auto">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    &copy; {new Date().getFullYear()} Ubot Web by PT Pasdigi Global Inovasi. All rights reserved.
                </p>
            </footer>
        </div>,
        { title: 'Privacy Policy - Ubot Web' }
    );
});
