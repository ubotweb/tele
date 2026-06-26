import { createRoute } from 'honox/factory';

export default createRoute(async (c) => {
    const transactionId = c.req.param('id');
    const db = c.env.DB;

    // Mengambil data transaksi dari D1 secara langsung untuk halaman SSR
    const trx = await db.prepare(`
        SELECT t.amount, t.status, t.qris_payload, p.title, p.description
        FROM transactions t
        JOIN products p ON t.product_id = p.id
        WHERE t.id = ?
    `).bind(transactionId).first<any>();

    if (!trx) {
        return c.render(
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-darkbg">
                <div className="p-8 bg-white dark:bg-darkcard rounded-xl shadow-lg text-center">
                    <h2 className="text-2xl font-bold text-red-600">Invoice Not Found</h2>
                    <p className="mt-2 text-gray-500 dark:text-gray-400">The requested transaction does not exist.</p>
                </div>
            </div>,
            { title: 'Not Found' }
        );
    }

    const isPaid = trx.status === 'paid';

    return c.render(
        <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-darkbg">
            <div className="max-w-md w-full space-y-8 bg-white dark:bg-darkcard p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Payment Details</h2>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Order ID: <span className="font-mono text-xs">{transactionId.split('-')[0]}</span></p>
                </div>
                
                <div className="mt-6 border-t border-b border-gray-200 dark:border-gray-700 py-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{trx.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{trx.description || 'Digital Product'}</p>
                    <div className="mt-4 flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Amount:</span>
                        <span className="text-xl font-bold text-brand">Rp {trx.amount.toLocaleString('id-ID')}</span>
                    </div>
                </div>

                <div className="mt-6 flex flex-col items-center">
                    {isPaid ? (
                        <div className="text-center p-6 bg-green-50 dark:bg-green-900/20 rounded-xl w-full border border-green-200 dark:border-green-800">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h3 className="mt-4 text-lg font-bold text-green-800 dark:text-green-400">Payment Successful</h3>
                            <p className="text-sm text-green-600 dark:text-green-500 mt-2">Your product has been sent to your Telegram chat.</p>
                        </div>
                    ) : (
                        <div className="text-center w-full">
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Scan QRIS to Pay</p>
                            <div className="bg-white p-4 rounded-xl inline-block shadow-sm border border-gray-200">
                                {/* Simulasi QRIS menggunakan API publik untuk render QR */}
                                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(trx.qris_payload)}`} alt="QRIS" className="w-48 h-48" />
                            </div>
                            <p className="text-xs text-gray-500 mt-4 text-center">Status updates automatically after payment.</p>
                        </div>
                    )}
                </div>
                
                {!isPaid && (
                    <script dangerouslySetInnerHTML={{ __html: `
                        // Auto-refresh halaman setiap 10 detik untuk mengecek status pembayaran
                        setTimeout(() => {
                            window.location.reload();
                        }, 10000);
                    `}} />
                )}
            </div>
        </div>,
        { title: 'Checkout - ' + trx.title }
    );
});
