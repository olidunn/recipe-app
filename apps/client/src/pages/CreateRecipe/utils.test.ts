import { describe, expect, it } from 'bun:test';

import { parseSteps } from './utils';

describe('parseSteps', () => {
  it('returns an empty array when there is an empty string', () => {
    const actual = parseSteps('');
    expect(actual).toBeArrayOfSize(0);
  });

  it('splits into 2 steps when there is 2 new lines', () => {
    const actual = parseSteps('an example\n\nrecipe');
    expect(actual).toEqual(['an example', 'recipe']);
  });

  it('trims single new lines', () => {
    const actual = parseSteps('\na recipe\n');
    expect(actual).toEqual(['a recipe']);
  });

  it('does not split empty steps', () => {
    const actual = parseSteps('a recipe\n\n');
    expect(actual).toEqual(['a recipe']);
  });

  it('splits into 2 steps when there is 2 new lines', () => {
    const actual = parseSteps('a recipe\n\nexample');
    expect(actual).toEqual(['a recipe', 'example']);
  });
});
