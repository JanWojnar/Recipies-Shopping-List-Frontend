import {Ingredient} from "../../shared/ingredient.model";
import * as ShoppingListActions from "./shopping-list.actions";


export interface ShoppingListState {
  ingredients: Ingredient[],
  editedIngredientIndex: number,
  editedIngredient: Ingredient
}
// @ts-ignore
export const initialState: ShoppingListState = {
  ingredients: [
    new Ingredient('Apples', 5),
    new Ingredient('Tomatoes', 4)
  ],
  editedIngredientIndex: -1,
  editedIngredient: null
};

export function shoppingListReducer
(
  state: ShoppingListState = initialState,
  action: ShoppingListActions.ShoppAct
): ShoppingListState {
  switch (action.type) {
    case ShoppingListActions.ADD_INGREDIENT:
      return {
        ...state,
        ingredients: [...state.ingredients, action.payload],
        editedIngredientIndex: -1,
        editedIngredient: null
      };
    case ShoppingListActions.ADD_INGREDIENTS:
      return {
        ...state,
        ingredients: [...state.ingredients, ...action.payload],
        editedIngredientIndex: -1,
        editedIngredient: null
      };
    case ShoppingListActions.UPDATE_INGREDIENT: {
      let modifiedTable = state.ingredients.slice();
      modifiedTable[state.editedIngredientIndex]=action.payload;
      return {
        ...state,
        ingredients: modifiedTable,
        editedIngredientIndex: -1,
        editedIngredient: null
      }
    }
    case ShoppingListActions.DELETE_INGREDIENT: {
      let modifiedTable = state.ingredients.slice()
      modifiedTable.splice(state.editedIngredientIndex,1);
      return {
        ...state,
        ingredients: modifiedTable,
        editedIngredientIndex: -1,
        editedIngredient: null
      }
    }
    case ShoppingListActions.START_EDIT_INGREDIENT : {
      return {
        ...state,
        editedIngredientIndex: action.payload,
        editedIngredient: state.ingredients[action.payload]
      }
    }
    case ShoppingListActions.STOP_EDIT_INGREDIENT : {
      return {
        ...state,
        editedIngredientIndex: -1,
        editedIngredient: null
      }
    }
    default:
      return state;
  }
}
