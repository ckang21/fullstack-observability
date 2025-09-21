import { test, expect } from '@playwright/test';

test('mutation without token returns 401', async ({ request }) => {
  const mutation = `
    mutation($title: String!) {
      createTask(title: $title) { id }
    }
  `;
  const res = await request.post('/graphql', {
    headers: { 'content-type': 'application/json' }, // no Authorization
    data: { query: mutation, variables: { title: 'Nope' } },
  });
  expect(res.status()).toBe(401);
  const body = await res.json();
  expect(body.error || body.errors).toBeTruthy();
});
