import { createRoute } from 'honox/factory';

export default createRoute((c) => {
    return c.render(
        <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Projects</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your bot stores and subscriptions.</p>
                </div>
                <button onClick="document.getElementById('new-project-modal').classList.remove('hidden')" className="inline-flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-brand hover:bg-sky-600 transition-colors">
                    + Create New Project
                </button>
            </div>

            <div id="projects-container" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <p className="text-gray-500 text-sm">Loading projects...</p>
            </div>

            {/* Modal Create Project */}
            <div id="new-project-modal" className="hidden fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
                    <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                    <div className="inline-block align-bottom bg-white dark:bg-darkcard rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                        <form id="project-form">
                            <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white" id="modal-title">Create New Bot Project</h3>
                                <div className="mt-4 space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Project Name</label>
                                        <input type="text" id="project_name" required className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-darkbg text-gray-900 dark:text-white" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Template</label>
                                        <select id="template_type" className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-darkbg text-gray-900 dark:text-white">
                                            <option value="product_store">Digital Product Store</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-200 dark:border-gray-700">
                                <button type="submit" id="btn-save-project" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-brand text-base font-medium text-white hover:bg-sky-600 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm">Create Project</button>
                                <button type="button" onClick="document.getElementById('new-project-modal').classList.add('hidden')" className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-darkbg text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <script dangerouslySetInnerHTML={{ __html: `
                const token = localStorage.getItem('auth_token');

                async function loadProjects() {
                    try {
                        const res = await fetch('/api/projects', {
                            headers: { 'Authorization': 'Bearer ' + token }
                        });
                        const data = await res.json();
                        const container = document.getElementById('projects-container');
                        container.innerHTML = '';
                        
                        if (data.success && data.data.length > 0) {
                            data.data.forEach(p => {
                                const isActive = p.subscription_status === 'active';
                                const statusClass = isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
                                
                                container.innerHTML += \`
                                    <div class="bg-white dark:bg-darkcard border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                                        <div class="flex justify-between items-start mb-4">
                                            <h3 class="text-lg font-bold text-gray-900 dark:text-white">\${p.project_name}</h3>
                                            <span class="px-2.5 py-0.5 rounded-full text-xs font-medium \${statusClass}">\${p.subscription_status.toUpperCase()}</span>
                                        </div>
                                        <div class="text-sm text-gray-500 dark:text-gray-400 mb-6 flex-grow">
                                            <p>Template: <span class="capitalize font-medium text-gray-700 dark:text-gray-300">\${p.template_type.replace('_', ' ')}</span></p>
                                            <p class="mt-1">Expires: \${new Date(p.subscription_end_date).toLocaleDateString()}</p>
                                        </div>
                                        \${isActive 
                                            ? \`<a href="/tenant/project/\${p.id}" class="block w-full text-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-brand hover:bg-sky-600 transition-colors">Manage Bot</a>\`
                                            : \`<button class="w-full py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 transition-colors">Pay Subscription</button>\`
                                        }
                                    </div>
                                \`;
                            });
                        } else {
                            container.innerHTML = '<p class="text-gray-500 text-sm col-span-full text-center py-8">You have no projects. Create one to get started!</p>';
                        }
                    } catch (e) {
                        document.getElementById('projects-container').innerHTML = '<p class="text-red-500 text-sm col-span-full">Failed to load projects.</p>';
                    }
                }

                document.addEventListener('DOMContentLoaded', loadProjects);

                document.getElementById('project-form').addEventListener('submit', async (e) => {
                    e.preventDefault();
                    const btn = document.getElementById('btn-save-project');
                    btn.disabled = true;

                    const project_name = document.getElementById('project_name').value;
                    const template_type = document.getElementById('template_type').value;

                    try {
                        const response = await fetch('/api/projects', {
                            method: 'POST',
                            headers: { 
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer ' + token
                            },
                            body: JSON.stringify({ project_name, template_type })
                        });
                        
                        const result = await response.json();
                        
                        if (result.success) {
                            window.showToast('Project created successfully', 'success');
                            document.getElementById('project-form').reset();
                            document.getElementById('new-project-modal').classList.add('hidden');
                            loadProjects();
                        } else {
                            window.showToast(result.message, 'error');
                        }
                    } catch (error) {
                        window.showToast('Error creating project', 'error');
                    } finally {
                        btn.disabled = false;
                    }
                });
            `}} />
        </div>,
        { title: 'My Projects' }
    );
});
