// services/api/src/math.test.ts
import { add } from './math.js';

describe('add', () => {
  it('adds positive numbers', () => {
    expect(add(2, 3)).toBe(5);
  });
  it('adds negatives', () => {
    expect(add(-2, 3)).toBe(1);
  });
});
