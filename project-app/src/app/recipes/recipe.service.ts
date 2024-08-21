import {Recipe} from "./recipe-list/recipe.model";
import {Injectable} from "@angular/core";
import {Subject} from "rxjs";

@Injectable()
export class RecipeService {

  recipesChanged = new Subject<Recipe[]>();

  private recipes: Recipe[] = [
    // new Recipe('A Test Recipe', 'Test description1', 'https://www.acouplecooks.com/wp-content/uploads/2021/03/' +
    //   'Cheese-Tortellini-011-735x919.jpg', [new Ingredient('Pineapple', 5),
    //   new Ingredient('Avocado', 2)]),
    // new Recipe('Another Test Recipe', 'Test description2', 'https://images.aws.nestle.recipes/' +
    //   'resized/4ba9b1e4cf3d3f052daa13595dea014c_large_fresh_fruit_saladjpg_1618110218_1004_633.jpeg',
    //   [new Ingredient('Orange', 12), new Ingredient('Pear', 17)])
  ];

  setRecipes (recipes: Recipe[]){
    this.recipes=recipes.slice();
    this.recipesChanged.next(this.getRecipes());
  }

  getRecipes() {
    const rec = this.recipes.slice();
    console.log(rec);
    return rec;
  }

  getRecipeById(id:number){
    return this.recipes[id];
  }

  addRecipe(recipe: Recipe){
    this.recipes.push(recipe);
    this.recipesChanged.next(this.getRecipes());
  }

  updateRecipe(recipe: Recipe, id: number){
    this.recipes[id] = recipe;
    this.recipesChanged.next(this.getRecipes());

  }

  deleteRecipe(id: number){
    this.recipes.splice(id,1);
    this.recipesChanged.next(this.getRecipes());
  }

}
