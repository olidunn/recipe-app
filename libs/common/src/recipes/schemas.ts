import { IntegerPrimaryKey } from '@recipe-app/common';
import type { Static } from '@sinclair/typebox/type';
import { Type } from '@sinclair/typebox/type';
import { t } from 'elysia';

// Record - data that is stored in the database, also known as Row or Entity
// Response - data that is sent from the server to the client, types omit the "Response" suffix
// Request - data that is sent from the client to the server
// Schema - TypeBox / Elysia validation rules, used for creating types, types omit the "Type", "Schema" or "Response" suffixes
// Transform - conversion utility for validating and converting between Record/Response, or Record/Request
// - Encode - converts from Response/Request to Record
// - Decode - converts from Record to Response/Request

export const RecipeRecordSchema = t.Object({
  id: IntegerPrimaryKey(),
  name: t.String({ minLength: 1, maxLength: 50 }),
  servingSize: t.Number({ minimum: 1, maximum: 100 }),
  steps: t.String({ minLength: 1 }),
  ingredients: t.String({ minLength: 1 }),
});
export type RecipeRecord = Static<typeof RecipeRecordSchema>;

export const RecipeResponse = t.Composite([
  t.Pick(RecipeRecordSchema, ['id', 'name', 'servingSize']),
  t.Object({
    steps: t.Array(t.String({ minLength: 1 }), { minItems: 1 }),
    ingredients: t.Array(t.String({ minLength: 1 }), { minItems: 1 }),
  }),
]);
export type Recipe = Static<typeof RecipeResponse>;

export const RecipeRequestSchema = t.Omit(RecipeResponse, ['id']);
export type RecipeRequest = Static<typeof RecipeRequestSchema>;

export const RecipesResponseTransform = t
  .Transform(t.Array(RecipeRecordSchema))
  .Decode((recipes) => recipes.map(recordToResponse))
  .Encode((recipes) => recipes.map(responseToRecord));

export const RecipeResponseTransform = t
  .Transform(RecipeRecordSchema)
  .Decode(recordToResponse)
  .Encode(responseToRecord);

function recordToResponse(recipe: RecipeRecord): Recipe {
  return {
    ...recordToRequest(recipe),
    id: recipe.id,
  };
}

function responseToRecord(recipe: Recipe): RecipeRecord {
  return { ...requestToRecord(recipe), id: recipe.id };
}

export const RecipeRequestTransform = Type.Transform(
  t.Omit(RecipeRecordSchema, ['id']),
)
  .Decode(recordToRequest)
  .Encode(requestToRecord);

function recordToRequest(recipe: Omit<RecipeRecord, 'id'>): Omit<Recipe, 'id'> {
  return {
    name: recipe.name,
    servingSize: recipe.servingSize,
    steps: recipe.steps.split('\n\n'),
    ingredients: recipe.ingredients.split('||'),
  };
}

function requestToRecord(recipe: RecipeRequest): Omit<RecipeRecord, 'id'> {
  return {
    name: recipe.name,
    servingSize: recipe.servingSize,
    steps: recipe.steps.join('\n\n'),
    ingredients: recipe.ingredients.join('||'),
  };
}
