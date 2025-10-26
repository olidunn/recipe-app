import type { RecipeFormData } from '~/components/RecipeForm';
import { RecipeForm } from '~/components/RecipeForm';

const defaultData: RecipeFormData = {
  name: '',
  servingSize: 1,
  steps: `Heat a large pan over medium heat and add {{olive oil}}.

Once the oil is hot, add chopped {{onion}} and sauté until translucent.

Add minced {{garlic}} and cook for another minute.

Add {{diced tomatoes}} and {{vegetable broth}}, stirring to combine.

Stir in {{quinoa}} and bring to a boil.

Reduce heat, cover, and simmer for 15 minutes until quinoa is cooked.

Stir in chopped {{spinach}} and cook until wilted.

Season with {{salt}} and {{black pepper}} to taste before serving.`,
};

export function CreateRecipe() {
  return <RecipeForm data={defaultData} mode="create" />;
}
