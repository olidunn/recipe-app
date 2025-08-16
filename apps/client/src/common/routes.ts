export const paths = {
  home: '/',
  createRecipe: '/create-recipe',
  recipes: '/recipes',
  recipe: '/recipes/:recipeId',
  createAccount: '/create-account',
  login: '/login',
};

export const routes = {
  recipe: (recipeId: number) => `/recipes/${recipeId}`,
  recipes: '/recipes',
};
