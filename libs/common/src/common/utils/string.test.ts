import { describe, expect, test } from 'bun:test';
import { formatMinutesAsHours, kebabCase } from './string';

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

describe('formatMinutesAsHours', () => {
  test.each([
    {
      input: `${0}`,
      output: 'NaN',
    },
    {
      input: `${60}`,
      output: `${1}h: ${0}m`,
    },
    {
      input: `${70}`,
      output: `${1}h: ${10}m`,
    },
    {
      input: 0,
      output: 'NaN',
    },
    {
      input: 5,
      output: `${5}m`,
    },
    {
      input: 1000,
      output: 'Exceeded maximum length of time',
    },
    {
      input: 500,
      output: `${8}h: ${20}m`,
    },
    {
      input: 80.5,
      output: `${1}h: ${20}m`,
    },
    {
      input: 'some string',
      output: 'NaN',
    },
  ])('$input -> $output', ({ input, output }) => {
    expect(formatMinutesAsHours(Number(input))).toBe(output);
  });
});
