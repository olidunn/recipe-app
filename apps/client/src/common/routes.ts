export const paths = {
  home: "/",
  createRecipe: "/create-recipe",
  recipes: "/recipes",
  recipe: "/recipes/:name",
};

export const routes = {
  recipe: (name: string) => `/recipes/${name}`,
  recipes: "/recipes",
};
