import { gql } from 'apollo-server-express';
import { add } from './math.js';
import { pool } from './db.js';

export const typeDefs = gql`
  scalar DateTime

  type Task {
    id: ID!
    title: String!
    done: Boolean!
    createdAt: DateTime!
  }

  type Query {
    hello(name: String): String!
    add(a: Int!, b: Int!): Int!
    tasks: [Task!]!
  }

  type Mutation {
    createTask(title: String!): Task!
    setTaskDone(id: ID!, done: Boolean!): Task!
  }
`;

export const resolvers = {
  Query: {
    hello: (_: unknown, { name }: { name?: string }) => `Hello ${name ?? 'world'}!`,
    add: (_: unknown, { a, b }: { a: number; b: number }) => add(a, b),
    tasks: async () => {
      const { rows } = await pool.query('SELECT id, title, done, created_at FROM tasks ORDER BY created_at DESC');
      return rows;
    },
  },
  Mutation: {
    createTask: async (_: unknown, { title }: { title: string }) => {
      const { rows } = await pool.query(
        'INSERT INTO tasks (title) VALUES ($1) RETURNING id, title, done, created_at',
        [title],
      );
      return rows[0];
    },
    setTaskDone: async (_: unknown, { id, done }: { id: number; done: boolean }) => {
      const { rows } = await pool.query(
        'UPDATE tasks SET done = $2 WHERE id = $1 RETURNING id, title, done, created_at',
        [id, done],
      );
      return rows[0];
    },
  },
  Task: {
    createdAt: (row: any) => row.created_at, // map DB column → GraphQL field
  },
};