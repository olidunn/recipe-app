import type { Static } from '@sinclair/typebox';
import { Type as t } from '@sinclair/typebox/type';
import { IntegerPrimaryKey } from '../common/schemas';

export const RecipeRecord = t.Object({
  id: IntegerPrimaryKey(),
  name: t.String({ minLength: 1, maxLength: 50 }),
  servingSize: t.Number({ minimum: 1, maximum: 100 }),
  steps: t.String({ minLength: 1 }),
  ingredients: t.String({ minLength: 1 }),
});
export type RecipeRecordType = Static<typeof RecipeRecord>;

export const RecipeResponse = t.Composite([
  t.Pick(RecipeRecord, ['id', 'name', 'servingSize']),
  t.Object({
    steps: t.Array(t.String({ minLength: 1 })),
    ingredients: t.Array(t.String({ minLength: 1 })),
  }),
]);
export type Recipe = Static<typeof RecipeResponse>;

export const RecipeRequest = t.Omit(RecipeResponse, ['id']);

export const RecipesMapper = t
  .Transform(t.Array(RecipeRecord))
  .Decode((recipes) => recipes.map(recordToResponse))
  .Encode((recipes) => recipes.map(responseToRecord));

export const RecipeMapper = t
  .Transform(RecipeRecord)
  .Decode(recordToResponse)
  .Encode(responseToRecord);

function recordToResponse(recipe: RecipeRecordType): Recipe {
  return {
    id: recipe.id,
    name: recipe.name,
    servingSize: recipe.servingSize,
    steps: recipe.steps.split(','),
    ingredients: recipe.ingredients.split(','),
  };
}

function responseToRecord(recipe: Recipe): RecipeRecordType {
  return {
    id: recipe.id,
    name: recipe.name,
    servingSize: recipe.servingSize,
    steps: recipe.steps.join(','),
    ingredients: recipe.ingredients.join(','),
  };
}
