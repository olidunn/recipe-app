import { describe, expect, it } from 'bun:test';
import { to } from '~/common/paths';

describe('applyParams', () => {
  it('replaces a single param', () => {
    expect(to('/recipes/:recipeId', { recipeId: 1 })).toBe('/recipes/1');
  });

  it('replaces a single param', () => {
    expect(to('/recipes/:recipeId/update', { recipeId: 1 })).toBe(
      '/recipes/1/update',
    );
  });

  it.skip('replaces multiple params', () => {
    // TODO
  });
});
