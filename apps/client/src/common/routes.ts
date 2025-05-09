export const paths = {
  home: "/",
  createRecipe: "/create-recipe",
  recipes: "/recipes",
  recipe: "/recipes/:id",
};

export const routes = {
  recipe: (id: string) => `/recipes/${id}`,
  recipes: "/recipes",
};
