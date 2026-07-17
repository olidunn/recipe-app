import { describe, expect, it } from 'bun:test';
import { to } from './paths';

describe('to', () => {
  it('replaces a single param', () => {
    expect(to('/recipes/:recipeId', { recipeId: 1 })).toBe('/recipes/1');
  });

  it.skip('replaces multiple params', () => {
    // TODO when we have nested paths
  });
});
