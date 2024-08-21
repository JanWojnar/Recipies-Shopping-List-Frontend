import {Action} from "@ngrx/store";
import {Ingredient} from "../../shared/ingredient.model";

export type ShoppAct = AddIngredient | AddIngredients | UpdateIngredient | DeleteIngredient | StartEditIngredient | StopEditIngredient;

export const ADD_INGREDIENT = '[Shopping List] ADD_INGREDIENT';
export class AddIngredient implements Action {
  readonly type = ADD_INGREDIENT;
  constructor(public payload: Ingredient) {
  }
}

export const ADD_INGREDIENTS = '[Shopping List] ADD_INGREDIENTS';
export class AddIngredients implements Action {
  readonly type = ADD_INGREDIENTS;
  constructor(public payload: Ingredient[]) {
  }
}

export const UPDATE_INGREDIENT = '[Shopping List] UPDATE_INGREDIENT';
export class UpdateIngredient implements Action {
  readonly type = UPDATE_INGREDIENT;
  constructor(public payload: Ingredient) {
  }
}

export const DELETE_INGREDIENT = '[Shopping List] DELETE_INGREDIENT';
export class DeleteIngredient implements Action {
  readonly type = DELETE_INGREDIENT;

}

export const START_EDIT_INGREDIENT = '[Shopping List] START_EDIT_INGREDIENT';
export class StartEditIngredient implements Action {
  readonly type = START_EDIT_INGREDIENT;
  constructor(public payload: number) {
  }
}

export const STOP_EDIT_INGREDIENT = '[Shopping List] STOP_EDIT_INGREDIENT';
export class StopEditIngredient implements Action {
  readonly type = STOP_EDIT_INGREDIENT;
}
