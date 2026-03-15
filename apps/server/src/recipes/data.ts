export function getAllRecipes(env: Env, userId: number): D1PreparedStatement {
  return env.DB.prepare(`
SELECT
  id,
  name,
  servingSize,
  preparationMinutes,
  cookingMinutes,
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
  preparationMinutes,
  cookingMinutes,
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
    preparationMinutes: number | null;
    cookingMinutes: number | null;
    ingredients: string;
  },
): D1PreparedStatement {
  const {
    name,
    steps,
    servingSize,
    preparationMinutes,
    cookingMinutes,
    ingredients,
    recipeId,
    userId,
  } = data;
  return env.DB.prepare(
    `
UPDATE
  recipes 
SET
  name = ?,
  steps = ?,
  servingSize = ?,
  preparationMinutes = ?,
  cookingMinutes = ?,
  ingredients = ?
WHERE
  id == ?
  AND userId = ?;
`,
  ).bind(
    name,
    steps,
    servingSize,
    preparationMinutes,
    cookingMinutes,
    ingredients,
    recipeId,
    userId,
  );
}

export function createRecipe(
  env: Env,
  data: {
    userId: number;
    name: string;
    steps: string;
    servingSize: number;
    preparationMinutes: number | null;
    cookingMinutes: number | null;
    ingredients: string;
  },
): D1PreparedStatement {
  const {
    userId,
    name,
    steps,
    servingSize,
    preparationMinutes,
    cookingMinutes,
    ingredients,
  } = data;
  return env.DB.prepare(
    `
      INSERT INTO recipes (userId, name, steps, servingSize, preparationMinutes, cookingMinutes, ingredients)
      VALUES (?, ?, ?, ?, ?, ?, ?);
      				`,
  ).bind(
    userId,
    name,
    steps,
    servingSize,
    preparationMinutes,
    cookingMinutes,
    ingredients,
  );
}
