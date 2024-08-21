import {Recipe} from "../recipe-list/recipe.model";
import * as RecipeActions from "../store/recipe.actions";

export interface RecipeState {
  recipes: Recipe[];
}

const initialState: RecipeState = {
  recipes: [],
}

export function recipeReducer(state= initialState, action: RecipeActions.RecipeActions): RecipeState {
  switch (action.type) {
    case RecipeActions.SET_RECIPES:
      return {
        ...state,
        recipes: [...action.payload]
      }
    case RecipeActions.ADD_RECIPE:
      return {
        ...state,
        recipes: [...state.recipes, action.payload]
      }
    case RecipeActions.DELETE_RECIPE:
      return {
        ...state,
        recipes: state.recipes.filter((recipe,index)=>{
          return index !== action.payload;
        })
      }
    case RecipeActions.UPDATE_RECIPE:
      let recipesUpdated: Recipe[] = state.recipes.slice();
      recipesUpdated[action.payload.id]=action.payload.recipe;
      return {
        ...state,
        recipes: recipesUpdated
      }
    case RecipeActions.STORE_RECIPES:
      return {
        ...state,
      }
    default:
      return {
        ...state
      }
  }
}
