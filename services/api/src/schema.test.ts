// services/api/src/schema.test.ts
import { resolvers } from './schema.js';

describe('resolvers', () => {
  it('hello greets by name', () => {
    // matches the resolver behavior in schema.ts
    expect(resolvers.Query.hello({}, { name: 'Christian' })).toBe('Hello Christian!');
  });

  it('add resolver sums correctly', () => {
    expect(resolvers.Query.add({}, { a: 7, b: 5 })).toBe(12);
  });
});
