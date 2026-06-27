import { createRoute } from 'honox/factory';

export default createRoute((c) => {
    return c.render(
        <main className="flex-grow max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8 w-full">
            <div className="bg-white dark:bg-darkcard rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-8 md:p-12">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 text-sm font-semibold mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                    </svg>
                    Legal Agreement
                </div>
                
                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-8">
                    Terms of Service
                </h1>
                
                <div className="space-y-8 text-gray-600 dark:text-gray-400 leading-relaxed">
                    <section>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">1. Acceptance of Terms</h2>
                        <p>
                            By accessing, registering, or using Ubot Web, every individual or entity acknowledges, agrees, and is fully willing to comply with all the provisions stated in this agreement without exception.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">2. Prohibited Activities</h2>
                        <p className="mb-4">
                            Ubot Web strictly prohibits the use of our services for any activities that violate the law. Under no circumstances may tenants or users utilize Ubot Web for the following:
                        </p>
                        <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
                            <li><strong>Crimes and Illegal Acts:</strong> Any form of activity that violates prevailing local and international laws.</li>
                            <li><strong>Gambling:</strong> Promoting, facilitating, or running any form of online or offline gambling/betting services.</li>
                            <li><strong>Pornography:</strong> Distributing, selling, or showcasing pornographic materials and explicit adult content.</li>
                            <li><strong>Jurisdiction Violations:</strong> Any actions or distributions that violate the constitutional laws of the Unitary State of the Republic of Indonesia (NKRI).</li>
                            <li><strong>System Disruption:</strong> Activities that cause interference, harm, or disruption to users of Ubot Web, TikTok, Telegram, or their respective servers.</li>
                            <li><strong>Other Crimes:</strong> Fraud, money laundering, phishing, and other cybercrimes.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">3. Enforcement and Termination</h2>
                        <p>
                            Ubot Web reserves the absolute right to suspend, terminate, or permanently ban any tenant account found violating these terms immediately and without prior notice. Data related to illegal activities may be reported to the appropriate legal authorities in Indonesia.
                        </p>
                    </section>
                </div>
            </div>
        </main>,
        { title: 'Terms of Service - Ubot Web' }
    );
});
