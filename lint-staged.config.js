export default {
  '**/*.ts?(x)': [
    () => 'bun typecheck',
    'biome ci --no-errors-on-unmatched',
    () => 'bun unit-tests',
  ],
};
