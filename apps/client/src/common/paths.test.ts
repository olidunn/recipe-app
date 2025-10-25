import { describe, expect, it } from 'bun:test';
import { applyParams } from '~/common/paths';

describe('applyParams', () => {
  it('replaces a single param', () => {
    expect(applyParams('/recipes/:recipeId', { recipeId: 1 })).toBe(
      '/recipes/1',
    );
  });

  it('replaces a single param', () => {
    expect(applyParams('/recipes/:recipeId/update', { recipeId: 1 })).toBe(
      '/recipes/1/update',
    );
  });

  it.skip('replaces multiple params', () => {
    // TODO
  });
});
