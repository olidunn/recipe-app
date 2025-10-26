export function getAllRecipes(env: Env, userId: number): D1PreparedStatement {
  return env.DB.prepare(`
SELECT
  id,
  name,
  servingSize,
  steps,
  ingredients
FROM
  recipes
WHERE
  userId = ?;
`).bind(userId);
}

export function getRecipeById(
  env: Env,
  userId: number,
  recipeId: number,
): D1PreparedStatement {
  return env.DB.prepare(`
SELECT
  id,
  name,
  servingSize,
  steps,
  ingredients
FROM
  recipes
WHERE
  id = ? AND userId = ?
LIMIT 1;
`).bind(recipeId, userId);
}

export function deleteRecipeById(
  env: Env,
  recipeId: number,
  userId: number,
): D1PreparedStatement {
  return env.DB.prepare(
    `DELETE FROM recipes
WHERE id = ? AND userId = ?;
`,
  ).bind(recipeId, userId);
}

export function deleteAllRecipes(
  env: Env,
  userId: number,
): D1PreparedStatement {
  return env.DB.prepare(`DELETE FROM recipes WHERE userId = ?;
    `).bind(userId);
}

export function updateRecipeById(
  env: Env,
  data: {
    recipeId: number;
    userId: number;
    name: string;
    steps: string;
    servingSize: number;
    ingredients: string;
  },
): D1PreparedStatement {
  const { name, steps, servingSize, ingredients, recipeId, userId } = data;
  return env.DB.prepare(
    `
UPDATE
  recipes 
SET
  name = ?,
  steps = ?,
  servingSize = ?,
  ingredients = ?
WHERE
  id == ?
  AND userId = ?;
`,
  ).bind(name, steps, servingSize, ingredients, recipeId, userId);
}

export function createRecipe(
  env: Env,
  data: {
    userId: number;
    name: string;
    steps: string;
    servingSize: number;
    ingredients: string;
  },
): D1PreparedStatement {
  const { userId, name, steps, servingSize, ingredients } = data;
  // TODO IMPORTANT: Replace hardcoded userId with auth userId
  return env.DB.prepare(
    `
      INSERT INTO recipes (userId, name, steps, servingSize, ingredients)
      VALUES (?, ?, ?, ?, ?);
      				`,
  ).bind(userId, name, steps, servingSize, ingredients);
}
