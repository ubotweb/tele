import { createRoute } from 'honox/factory';

export default createRoute((c) => {
    return c.render(
        <main className="flex-grow max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8 w-full">
            <div className="bg-white dark:bg-darkcard rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-8 md:p-12 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 text-brand text-sm font-semibold mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    Company Profile
                </div>
                
                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-6">
                    About Ubot Web
                </h1>
                
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-12">
                    Ubot Web is a premium platform designed to automate and simplify the management of digital storefronts across Telegram and TikTok. We provide a legally compliant, highly secure, and fully automated ecosystem for modern businesses.
                </p>

                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-8 border border-gray-100 dark:border-gray-700 text-left max-w-lg mx-auto">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                        </svg>
                        Legal Entity
                    </h2>
                    <p className="text-gray-700 dark:text-gray-300 mb-6">
                        Ubot Web is a service legally operated and fully managed by <strong className="text-gray-900 dark:text-white">PT Pasdigi Global Inovasi</strong>.
                    </p>
                    
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Office Address
                    </h2>
                    <address className="not-italic text-gray-700 dark:text-gray-300 leading-relaxed">
                        PT Pasdigi Global Inovasi<br />
                        Kp. Cisaar RT 002 RW 008<br />
                        Desa Cipeuyeum Kecamatan Haurwangi<br />
                        Kabupaten Cianjur - Jawa Barat<br />
                        Indonesia
                    </address>
                </div>
            </div>
        </main>,
        { title: 'About Us - Ubot Web' }
    );
});
