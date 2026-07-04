export const paths = {
  home: '/',
  createRecipe: '/recipes/create',
  recipes: '/recipes',
  recipe: '/recipes/:recipeId',
  updateRecipe: '/recipes/:recipeId/update',
  createAccount: '/create-account',
  login: '/login',
  verifyEmail: '/verify-email/:token',
} as const;

type Path = (typeof paths)[keyof typeof paths];

/**
 * Returns the URL using the provided path and params.
 * Params are required and type-safe when the path has param literals.
 */
export function to<P extends Path>(
  path: P,
  ...args: PathParamLiteral<P> extends never
    ? [] // no params allowed
    : [params: PathParams<P>] // params required
): string {
  const params = args[0];
  if (!params) {
    return path;
  }

  return path.replace(/:([a-zA-Z0-9_]+)/g, (_, key: PathParamLiteral<P>) => {
    const value = params[key];

    if (value === undefined) {
      throw new Error(`Missing param: ${key}`);
    }

    return `${value}`;
  });
}

/**
 * A type union of string literals from a given path.
 *
 * @example 'category/:categoryId/books/:bookId' -> 'categoryId' | 'bookId'
 */
type PathParamLiteral<P extends string> =
  P extends `${string}:${infer Param}/${infer Rest}`
    ? Param | PathParamLiteral<Rest>
    : P extends `${string}:${infer Param}`
      ? Param
      : never;

type PathParams<P extends string> =
  PathParamLiteral<P> extends never
    ? never
    : Record<PathParamLiteral<P>, string | number>;
