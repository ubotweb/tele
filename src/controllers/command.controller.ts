import { Hono } from 'hono';
import { Env, JwtPayload } from '../types/index';

const commandApp = new Hono<{ Bindings: Env, Variables: { user: JwtPayload } }>();

commandApp.get('/', async (c) => {
    const projectId = c.req.param('project_id');
    const db = c.env.DB;

    const commands = await db.prepare(`
        SELECT id, command, description, reply_text, is_active 
        FROM bot_commands 
        WHERE project_id = ? 
        ORDER BY command ASC
    `).bind(projectId).all();

    return c.json({ success: true, data: commands.results });
});

commandApp.post('/', async (c) => {
    const projectId = c.req.param('project_id');
    const db = c.env.DB;
    const { command, description, reply_text } = await c.req.json();
    
    if (!command || !reply_text) {
        return c.json({ success: false, message: 'Command and reply text are required' }, 400);
    }

    // Memastikan command dimulai dengan slash '/'
    const formattedCommand = command.startsWith('/') ? command : `/${command}`;
    const commandId = crypto.randomUUID();

    try {
        await db.prepare(`
            INSERT INTO bot_commands (id, project_id, command, description, reply_text, is_active)
            VALUES (?, ?, ?, ?, ?, 1)
        `).bind(commandId, projectId, formattedCommand, description || null, reply_text).run();

        return c.json({ success: true, message: 'Bot command added successfully' });
    } catch (error) {
        return c.json({ success: false, message: 'Failed to add command' }, 500);
    }
});

commandApp.delete('/:id', async (c) => {
    const projectId = c.req.param('project_id');
    const commandId = c.req.param('id');
    const db = c.env.DB;

    const result = await db.prepare(`DELETE FROM bot_commands WHERE id = ? AND project_id = ?`)
        .bind(commandId, projectId)
        .run();

    if (result.meta.changes === 0) {
        return c.json({ success: false, message: 'Command not found or unauthorized' }, 404);
    }

    return c.json({ success: true, message: 'Command deleted successfully' });
});

export { commandApp };
