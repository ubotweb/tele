import { createRoute } from 'honox/factory';

export default createRoute((c) => {
    return c.render(
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Bot Commands</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Set custom command responses for your Telegram bot.</p>

            <form id="cmd-form" className="bg-gray-50 dark:bg-gray-800/50 p-5 rounded-xl border border-gray-100 dark:border-gray-700 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Command</label>
                        <input type="text" id="c_cmd" required placeholder="/help" className="mt-1 block w-full px-3 py-2.5 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-darkbg text-gray-900 dark:text-white" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                        <input type="text" id="c_desc" placeholder="Get help menu" className="mt-1 block w-full px-3 py-2.5 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-darkbg text-gray-900 dark:text-white" />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Reply Text (HTML supported)</label>
                        <textarea id="c_reply" required rows={3} className="mt-1 block w-full px-3 py-2.5 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-darkbg text-gray-900 dark:text-white"></textarea>
                    </div>
                </div>
                <button type="submit" id="btn-save-cmd" className="px-6 py-2.5 text-sm font-medium text-white bg-brand hover:bg-sky-600 rounded-lg shadow-sm">Save Command</button>
            </form>

            <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Command</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Action</th>
                        </tr>
                    </thead>
                    <tbody id="cmds-tbody" className="bg-white dark:bg-darkcard divide-y divide-gray-200 dark:divide-gray-700">
                        <tr><td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">Loading...</td></tr>
                    </tbody>
                </table>
            </div>

            <script dangerouslySetInnerHTML={{ __html: `
                const token = localStorage.getItem('auth_token');
                async function loadCmds() {
                    const res = await fetch('/api/projects/' + window.CURRENT_PROJECT_ID + '/commands', { headers: { 'Authorization': 'Bearer ' + token } });
                    const data = await res.json();
                    const tbody = document.getElementById('cmds-tbody');
                    tbody.innerHTML = '';
                    if (data.success && data.data.length > 0) {
                        data.data.forEach(c => {
                            tbody.innerHTML += \`<tr><td class="px-6 py-4 text-sm font-bold text-gray-900 dark:text-white">\${c.command}</td><td class="px-6 py-4 text-sm text-gray-500">\${c.description}</td><td class="px-6 py-4 text-right"><button onclick="deleteCmd('\${c.id}')" class="text-red-600">Delete</button></td></tr>\`;
                        });
                    } else {
                        tbody.innerHTML = '<tr><td colspan="3" class="px-6 py-4 text-center text-sm">No commands found.</td></tr>';
                    }
                }
                document.addEventListener('DOMContentLoaded', loadCmds);
                document.getElementById('cmd-form').addEventListener('submit', async (e) => {
                    e.preventDefault();
                    const payload = { command: document.getElementById('c_cmd').value, description: document.getElementById('c_desc').value, reply_text: document.getElementById('c_reply').value };
                    await fetch('/api/projects/' + window.CURRENT_PROJECT_ID + '/commands', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
                        body: JSON.stringify(payload)
                    });
                    loadCmds();
                });
                window.deleteCmd = async (id) => {
                    await fetch('/api/projects/' + window.CURRENT_PROJECT_ID + '/commands/' + id, { method: 'DELETE', headers: { 'Authorization': 'Bearer ' + token } });
                    loadCmds();
                };
            `}} />
        </div>,
        { title: 'Bot Commands' }
    );
});
