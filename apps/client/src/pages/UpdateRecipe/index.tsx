import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'wouter';
import { server } from '~/common/server';
import { Loading } from '~/components/Loading';
import type { RecipeFormData } from '~/components/RecipeForm';
import { RecipeForm } from '~/components/RecipeForm';

export function UpdateRecipe() {
  const { recipeId } = useParams<{ recipeId: string }>();

  const [recipe, setRecipe] = useState<RecipeFormData | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const { data, error } = await server.recipes({ recipeId }).raw.get();

      if (error) {
        throw error;
      }

      setRecipe({
        name: data.name,
        servingSize: data.servingSize,
        steps: data.steps,
      });
    } catch (_error) {
      setRecipe(null);
    } finally {
      setLoading(false);
    }
  }, [recipeId]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  if (loading) {
    return <Loading size={30} />;
  }

  if (recipe === null) {
    return <div>Recipe not found</div>;
  }

  return <RecipeForm mode="update" data={recipe} recipeId={recipeId} />;
}
