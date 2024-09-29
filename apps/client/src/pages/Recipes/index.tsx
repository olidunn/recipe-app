import { Link } from "wouter";
import { Button } from "../../components/Button";
import { routes } from "../../common/routes";

export function Recipes() {
  function deleteAllRecipes() {}

  return (
    <>
      <div id="recipe-list"></div>
      <Link className="button" href={routes.createRecipe}>
        Create Recipe
      </Link>
      <Button onClick={deleteAllRecipes}>Delete All Recipes</Button>
    </>
  );
}
