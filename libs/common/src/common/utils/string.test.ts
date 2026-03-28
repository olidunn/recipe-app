import { describe, expect, test } from 'bun:test';
import { kebabCase } from './string';

describe('kebabCase', () => {
  test.each([
    {
      input: '',
      output: '',
    },
    {
      input: undefined,
      output: '',
    },
    {
      input: 'test',
      output: 'test',
    },
    {
      input: 'testCamelCase1',
      output: 'test-camel-case-1',
    },
    {
      input: 'TestPascalCase1',
      output: 'test-pascal-case-1',
    },
    {
      input: 'test_snake_case__1',
      output: 'test-snake-case-1',
    },
    {
      input: 'Test sentence case 1',
      output: 'test-sentence-case-1',
    },
    {
      input: 'Test title case 1',
      output: 'test-title-case-1',
    },
    {
      input: '  test  extra     spaces  1  ',
      output: 'test-extra-spaces-1',
    },
    {
      input: 'TEST CAPITAL CASE 1',
      output: 'test-capital-case-1',
    },
  ])(`"$input" -> "$output"`, ({ input, output }) => {
    expect(kebabCase(input)).toBe(output);
  });
});
