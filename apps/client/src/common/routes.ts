export const paths = {
  home: '/',
  createRecipe: '/create-recipe',
  recipes: '/recipes',
  recipe: '/recipes/:recipeId',
  createAccount: '/create-account',
  login: '/login',
} as const;

export const routes = {
  recipe: (recipeId: number) => `/recipes/${recipeId}`,
  recipes: '/recipes',
};
