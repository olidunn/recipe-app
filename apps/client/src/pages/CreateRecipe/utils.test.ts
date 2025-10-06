import { describe, expect, it } from 'bun:test';

import { parseSteps } from './utils';

describe('parseSteps', () => {
  it('returns an empty array when there is an empty string', () => {
    const actual = parseSteps('');
    expect(actual).toBeEmpty();
  });

  it('splits into 2 steps when there is 1 new line', () => {
    const actual = parseSteps('an example\nrecipe');
    expect(actual).toEqual(['an example', 'recipe']);
  });

  it('does not split into 2 steps when there is 1 new line and an empty string', () => {
    const actual = parseSteps('a recipe\n');
    expect(actual).toEqual(['a recipe']);
  });

  it('splits into 2 steps when there is 2 new lines', () => {
    const actual = parseSteps('a recipe\n\nexample');
    expect(actual).toEqual(['a recipe', 'example']);
  });
});
