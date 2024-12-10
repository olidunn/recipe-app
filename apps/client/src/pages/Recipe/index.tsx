import { useParams } from "wouter";
import { useLocalStorage } from "../../common/hooks/useLocalStorage";

export function Recipe() {
  const { name } = useParams<{
    name: string;
  }>();
  const [recipes] = useLocalStorage("recipes", []);

  //// Expanded code version
  //   const recipe = recipes.find((r) => r.name === name);
  //   let ingredients: string[] = [];
  //   if(recipe) {
  //     ingredients = recipe.ingredients;
  //   }

  // The ? in `foo?.bar` is called the optional chaining operator,
  // and it allows you to access deeply nested properties without worrying about
  // whether the property exists or not. If the property `foo` doesn't exist, the expression foo?.var
  // will return undefined instead of throwing an error.

  // The ?? in `foo ?? bar` is called the nullish coalescing operator.
  // The default value is on the right side of the operator,
  // and it will be returned if the left side is null or undefined.
  const recipe = recipes.find((r) => r.name === name);
  const ingredients = recipe?.ingredients ?? [];
  const steps = recipe?.steps ?? [];

  return (
    <>
      My recipe {name}
      <ul>
        {ingredients.map((i) => (
          <li key={i}>{i}</li>
        ))}
      </ul>
      <ul>
        {steps.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>
    </>
  );
}
