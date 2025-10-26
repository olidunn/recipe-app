import {
  RecipeRecordSchema,
  RecipeRequestSchema,
  RecipeRequestTransform,
  RecipeResponse,
  RecipeResponseTransform,
  RecipesResponseTransform,
} from '@recipe-app/common';
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

export const recipesController = new Elysia({
  name: 'recipes',
  tags: ['Recipes'],
})
  .decorate('env', {} as Env)
  .decorate('userId', 0)
  // GET ALL RECIPES
  .get(
    '/recipes',
    async ({ env, userId }) => {
      const { results } = await getAllRecipes(env, userId).all();
      return Value.Decode(RecipesResponseTransform, results);
    },
    {
      response: {
        200: t.Array(RecipeResponse),
      },
    },
  )
  // GET RECIPE BY ID
  .get(
    '/recipes/:recipeId',
    async ({ env, userId, status, params: { recipeId } }) => {
      const recipe = await getRecipeById(env, userId, recipeId).first();

      if (!recipe) {
        return status(404, { message: 'Recipe not found' });
      }

      return Value.Decode(RecipeResponseTransform, recipe);
    },
    {
      params: t.Object({ recipeId: t.Number() }),
      response: {
        200: RecipeResponse,
        404: t.Object({ message: t.String() }),
      },
    },
  )
  // GET RECIPE BY ID
  .get(
    '/recipes/:recipeId/raw',
    async ({ env, userId, status, params: { recipeId } }) => {
      const recipe = await getRecipeById(env, userId, recipeId).first();

      if (!recipe) {
        return status(404, { message: 'Recipe not found' });
      }

      return Value.Parse(RecipeRecordSchema, recipe);
    },
    {
      params: t.Object({ recipeId: t.Number() }),
      response: {
        200: RecipeRecordSchema,
        404: t.Object({ message: t.String() }),
      },
    },
  )
  // CREATE RECIPE
  .post(
    '/recipes',
    async ({ env, userId, body }) => {
      const { name, steps, servingSize, ingredients } = Value.Encode(
        RecipeRequestTransform,
        body,
      );

      await createRecipe(env, {
        userId,
        name,
        servingSize,
        steps,
        ingredients,
      }).run();
    },
    {
      body: RecipeRequestSchema,
      response: {
        200: t.Void(),
      },
    },
  )
  // UPDATE RECIPE
  .post(
    '/recipes/:recipeId',
    async ({ env, userId, body, params: { recipeId } }) => {
      const { name, steps, servingSize, ingredients } = Value.Encode(
        RecipeRequestTransform,
        body,
      );

      await updateRecipeById(env, {
        recipeId,
        userId,
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
      body: RecipeRequestSchema,
      response: {
        200: t.Void(),
      },
    },
  )
  // DELETE ALL RECIPES
  .delete(
    '/recipes',
    async ({ env, userId }) => {
      await deleteAllRecipes(env, userId).run();
    },
    {
      response: {
        200: t.Void(),
      },
    },
  )
  // DELETE RECIPE BY ID
  .delete(
    '/recipes/:recipeId',
    async ({ env, userId, params: { recipeId } }) => {
      await deleteRecipeById(env, recipeId, userId).run();
    },
    {
      params: t.Object({ recipeId: t.Number() }),
      response: {
        200: t.Void(),
      },
    },
  );
