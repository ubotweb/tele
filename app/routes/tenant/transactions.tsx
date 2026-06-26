import { createRoute } from 'honox/factory';

export default createRoute((c) => {
    return c.render(
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Sales & Transactions</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Monitor your recent sales and revenue.</p>
            </div>

            {/* Tabel Transaksi */}
            <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Product</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                        </tr>
                    </thead>
                    <tbody id="trx-tbody" className="bg-white dark:bg-darkcard divide-y divide-gray-200 dark:divide-gray-700">
                        <tr><td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">Loading transactions...</td></tr>
                    </tbody>
                </table>
            </div>

            <script dangerouslySetInnerHTML={{ __html: `
                const token = localStorage.getItem('auth_token');

                async function loadTransactions() {
                    try {
                        const res = await fetch('/api/tenant/transactions', {
                            headers: { 'Authorization': 'Bearer ' + token }
                        });
                        const data = await res.json();
                        const tbody = document.getElementById('trx-tbody');
                        
                        if (data.success && data.data.length > 0) {
                            tbody.innerHTML = '';
                            data.data.forEach(t => {
                                const date = new Date(t.created_at).toLocaleString('id-ID');
                                let statusHtml = '';
                                if(t.status === 'paid') statusHtml = '<span class="px-2 py-1 text-xs font-semibold rounded-md bg-green-100 text-green-800">Paid</span>';
                                else if(t.status === 'pending') statusHtml = '<span class="px-2 py-1 text-xs font-semibold rounded-md bg-yellow-100 text-yellow-800">Pending</span>';
                                else statusHtml = '<span class="px-2 py-1 text-xs font-semibold rounded-md bg-red-100 text-red-800">Failed</span>';

                                tbody.innerHTML += \`
                                    <tr>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">\${date}</td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">\${t.product_title} <span class="text-xs text-gray-400 ml-1">(\${t.product_type})</span></td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">Rp \${t.amount.toLocaleString('id-ID')}</td>
                                        <td class="px-6 py-4 whitespace-nowrap">\${statusHtml}</td>
                                    </tr>
                                \`;
                            });
                        } else {
                            tbody.innerHTML = '<tr><td colspan="4" class="px-6 py-4 text-center text-sm text-gray-500">No transactions found.</td></tr>';
                        }
                    } catch (e) {
                        document.getElementById('trx-tbody').innerHTML = '<tr><td colspan="4" class="px-6 py-4 text-center text-sm text-red-500">Failed to load transactions.</td></tr>';
                    }
                }

                document.addEventListener('DOMContentLoaded', loadTransactions);
            `}} />
        </div>,
        { title: 'Transactions' }
    );
});
