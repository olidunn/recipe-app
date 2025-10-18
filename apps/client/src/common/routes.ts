export const paths = {
  home: '/',
  createRecipe: '/recipes/create',
  recipes: '/recipes',
  recipe: '/recipes/:recipeId',
  updateRecipe: '/recipes/:recipeId/update',
  createAccount: '/create-account',
  login: '/login',
} as const;

export const routes = {
  recipe: (recipeId: number) => `/recipes/${recipeId}`,
  recipes: '/recipes',
  home: '/recipes',
};
