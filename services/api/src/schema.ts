import { gql } from 'apollo-server-express';
import { add } from './math.js';

export const typeDefs = gql`
  type Query {
    hello(name: String): String!
    add(a: Int!, b: Int!): Int!
  }
`;

export const resolvers = {
  Query: {
    hello: (_: any, { name }: { name?: string }) => `Hello ${name ?? 'world'}!`,
    add: (_: any, { a, b }: { a: number; b: number }) => add(a, b),
  },
};
