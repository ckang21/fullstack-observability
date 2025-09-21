// tests/e2e/tasks.spec.ts
import { test, expect } from '@playwright/test';

async function gql(request: any, query: string, variables?: any) {
  const res = await request.post('/graphql', {
      headers: {
        'content-type': 'application/json',
         'authorization': `Bearer ${process.env.API_TOKEN ?? 'devtoken'}`,
      },
      data: { query, variables },
    });
  expect(res.status()).toBe(200);
  return res.json();
}

test('can create, list, and update a task', async ({ request }) => {
  const title = 'Learn Playwright + GraphQL';

  // create
  const create = `
    mutation($title: String!) {
      createTask(title: $title) { id title done }
    }
  `;
  const createRes = await gql(request, create, { title });
  const task = createRes.data.createTask;
  expect(task.title).toBe(title);
  expect(task.done).toBe(false);

  // list
  const list = `query { tasks { id title done } }`;
  const listRes = await gql(request, list);
  const found = listRes.data.tasks.find((t: any) => t.id === task.id);
  expect(found).toBeTruthy();

  // update
  const setDone = `
    mutation($id: ID!, $done: Boolean!) {
      setTaskDone(id: $id, done: $done) { id done }
    }
  `;
  const updRes = await gql(request, setDone, { id: task.id, done: true });
  expect(updRes.data.setTaskDone.done).toBe(true);
});
