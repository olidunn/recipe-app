import { Value } from '@sinclair/typebox/value';
import Elysia, { t } from 'elysia';
import {
  createRecipe,
  deleteAllRecipes,
  deleteRecipeById,
  getAllRecipes,
  getRecipeById,
  updateRecipeById,
} from './data';
import {
  RecipeMapper,
  RecipeRequest,
  RecipeResponse,
  RecipesMapper,
} from './schemas';

export const recipesController = new Elysia({
  name: 'recipes',
  tags: ['Recipes'],
  prefix: '/recipes',
})
  .decorate('env', {} as Env)
  // GET ALL RECIPES
  .get(
    '',
    async ({ env }) => {
      const { results } = await getAllRecipes(env).all();

      return Value.Decode(RecipesMapper, results);
    },
    {
      response: {
        200: t.Array(RecipeResponse),
      },
    },
  )
  // GET RECIPE BY ID
  .get(
    ':recipeId',
    async ({ env, status, params: { recipeId } }) => {
      const recipe = await getRecipeById(env, recipeId).first();

      if (!recipe) {
        return status(404, { message: 'Recipe not found' });
      }

      return Value.Decode(RecipeMapper, recipe);
    },
    {
      params: t.Object({ recipeId: t.Number() }),
      response: {
        200: RecipeResponse,
        404: t.Object({ message: t.String() }),
      },
    },
  )
  // CREATE RECIPE
  .post(
    '',
    async ({ env, body }) => {
      await createRecipe(env, {
        name: body.name,
        servingSize: body.servingSize,
        steps: body.steps.join(','),
        ingredients: body.ingredients.join(','),
      }).run();
    },
    {
      body: RecipeRequest,
    },
  )
  // UPDATE RECIPE
  .post(
    ':recipeId',
    async ({ env, body, params: { recipeId } }) => {
      const { name, steps, servingSize, ingredients } = Value.Encode(
        RecipeMapper,
        body,
      );

      await updateRecipeById(env, {
        recipeId,
        ingredients,
        servingSize,
        name,
        steps,
      }).run();
    },
    {
      detail: {
        summary: 'Update Recipe by ID',
      },
      params: t.Object({ recipeId: t.Number() }),
      body: RecipeResponse,
    },
  )
  // DELETE ALL RECIPES
  .delete('', async ({ env }) => {
    await deleteAllRecipes(env).run();
  })
  // DELETE RECIPE BY ID
  .delete(
    ':recipeId',
    async ({ env, params: { recipeId } }) => {
      await deleteRecipeById(env, recipeId).run();
    },
    {
      params: t.Object({ recipeId: t.Number() }),
      response: {
        200: t.Void(),
      },
    },
  );
