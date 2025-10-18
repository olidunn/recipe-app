import type { RecipeRecordType } from '@recipe-app/server/src/recipes/schemas';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'wouter';
import { server } from '~/common/server';
import { RecipeForm } from '~/components/RecipeForm';

export function UpdateRecipe() {
  const { recipeId } = useParams<{ recipeId: string }>();

  const [recipe, setRecipe] = useState<RecipeRecordType | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    const { data, error } = await server.recipes({ recipeId }).raw.get();
    if (error) {
      setRecipe(null);
    }
    setRecipe(data);
    setLoading(false);
  }, [recipeId]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (recipe === null) {
    return <div>Recipe not found</div>;
  }

  return <RecipeForm mode="update" data={recipe} />;
}
