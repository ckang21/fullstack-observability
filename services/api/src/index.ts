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

  app.get('/health', async (_req, res) => {
    try {
      await pool.query('SELECT 1');
      res.json({ ok: true });
    } catch (err) {
      res.status(500).json({ ok: false, error: String(err) });
    }
  });

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });
  await server.start();
  server.applyMiddleware({ app, path: '/graphql' });

  return app;
}

createApp().then((app) => {
  app.listen({ port }, () => {
    console.log(`API running on http://localhost:${port}`);
    console.log(`GraphQL: http://localhost:${port}/graphql`);
  });
}).catch((err) => {
  console.error('Failed to start app', err);
  process.exit(1);
});
