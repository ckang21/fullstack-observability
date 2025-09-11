import { test, expect } from '@playwright/test';

test('health endpoint responds ok', async ({ request }) => {
  const res = await request.get('/health');
  expect(res.status()).toBe(200);
  const body = await res.json();
  expect(body.ok).toBeTruthy();
});

test('graphql hello works', async ({ request }) => {
  const query = `query($name: String){ hello(name: $name) }`;
  const res = await request.post('/graphql', {
    data: { query, variables: { name: 'Christian' } },
  });
  expect(res.status()).toBe(200);
  const { data } = await res.json();
  expect(data.hello).toContain('Christian');
});
