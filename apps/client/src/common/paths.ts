export const paths = {
  home: '/',
  createRecipe: '/recipes/create',
  recipes: '/recipes',
  recipe: '/recipes/:recipeId',
  updateRecipe: '/recipes/:recipeId/update',
  createAccount: '/create-account',
  login: '/login',
} as const;

export function to<Path extends Paths>(
  path: Path,
  params: ParamsArg<Path>,
): string {
  return path.replace(/:([a-zA-Z0-9_]+)/g, (_, key) => {
    const value = params[key as ExtractParams<Path>];
    if (value === undefined) {
      throw new Error(`Missing param: ${key}`);
    }
    return String(value);
  });
}

type RecursiveStringExtraction<T> = T extends string
  ? T
  : T extends object
    ? RecursiveStringExtraction<T[keyof T]>
    : never;

type Paths = RecursiveStringExtraction<typeof paths>;

type ExtractParams<Path extends string> =
  Path extends `${string}:${infer Param}/${infer Rest}`
    ? Param | ExtractParams<Rest>
    : Path extends `${string}:${infer Param}`
      ? Param
      : never;

type ParamsArg<Path extends string> = Record<
  ExtractParams<Path>,
  string | number
>;
