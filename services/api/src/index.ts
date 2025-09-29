import './instrumentation.js';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import type { Express } from 'express';
import { typeDefs, resolvers } from './schema.js';
import { pool } from './db.js';
import { runMigrations } from './migrate.js';

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 4000;

async function createApp(): Promise<Express> {
  const app = express();

  await runMigrations();

  // Parse JSON before hitting /graphql so we can inspect req.body.query
  app.use(express.json());

  // Auth guard: require API_TOKEN for GraphQL mutations
  app.use('/graphql', (req, res, next) => {
    const isPost = req.method === 'POST';
    const q = (req.body && typeof req.body.query === 'string') ? req.body.query : '';
    const looksLikeMutation = isPost && q.toLowerCase().includes('mutation');

    if (!looksLikeMutation) return next(); // queries are public

    const required = (process.env.API_TOKEN || '').trim();
    const auth = req.headers.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.slice('Bearer '.length).trim() : '';

    if (!required) {
      // If no API_TOKEN configured, allow (dev convenience)
      return next();
    }
    if (token !== required) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    return next();
  });

  app.get('/health', async (_req, res) => {
    try {
      await pool.query('SELECT 1');
      res.json({ ok: true });
    } catch (err) {
      res.status(500).json({ ok: false, error: String(err) });
    }
  });

  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();
  server.applyMiddleware({ app, path: '/graphql' });

  return app;
}

createApp()
  .then((app) => {
    app.listen({ port }, () => {
      console.log(`API running on http://localhost:${port}`);
      console.log(`GraphQL: http://localhost:${port}/graphql`);
    });
  })
  .catch((err) => {
    console.error('Failed to start app', err);
    process.exit(1);
  });
