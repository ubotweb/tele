import { jsxRenderer } from 'hono/jsx-renderer';
import { Layout } from '../components/Layout';

export default jsxRenderer(({ children, title }) => {
    return (
        <Layout title={title || 'Panel'}>
            {children}
        </Layout>
    );
});
