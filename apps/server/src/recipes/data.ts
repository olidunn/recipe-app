export function getAllRecipes(env: Env): D1PreparedStatement {
  return env.DB.prepare('SELECT * FROM recipes LIMIT 100;');
}

export function getRecipeById(env: Env, recipeId: number): D1PreparedStatement {
  return env.DB.prepare(
    `
SELECT * FROM recipes
WHERE id = ?
LIMIT 1;
`,
  ).bind(recipeId);
}

export function deleteRecipeById(
  env: Env,
  recipeId: number,
): D1PreparedStatement {
  return env.DB.prepare(
    `DELETE FROM recipes
WHERE id = ?;
`,
  ).bind(recipeId);
}

export function deleteAllRecipes(env: Env): D1PreparedStatement {
  return env.DB.prepare('DELETE FROM recipes;');
}

export function updateRecipeById(
  env: Env,
  data: {
    recipeId: number;
    name: string;
    steps: string;
    servingSize: number;
    ingredients: string;
  },
): D1PreparedStatement {
  const { name, steps, servingSize, ingredients, recipeId } = data;
  return env.DB.prepare(
    `
  UPDATE recipes 
SET name = ?,
steps = ?,
servingSize = ?,
ingredients = ?
WHERE id == ?;
`,
  ).bind(name, steps, servingSize, ingredients, recipeId);
}

export function createRecipe(
  env: Env,
  data: {
    name: string;
    steps: string;
    servingSize: number;
    ingredients: string;
  },
): D1PreparedStatement {
  const { name, steps, servingSize, ingredients } = data;
  // TODO IMPORTANT: Replace hardcoded userId with auth userId
  return env.DB.prepare(
    `
      INSERT INTO recipes (userId, name, steps, servingSize, ingredients)
      VALUES (1, ?, ?, ?, ?);
      				`,
  ).bind(name, steps, servingSize, ingredients);
}
