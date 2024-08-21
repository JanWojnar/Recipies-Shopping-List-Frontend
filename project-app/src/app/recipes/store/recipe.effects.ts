import {Injectable} from "@angular/core";
import {Actions, Effect, ofType} from "@ngrx/effects";
import * as RecipeActions from "../store/recipe.actions";
import {map, switchMap, withLatestFrom} from "rxjs/operators";
import {Recipe} from "../recipe-list/recipe.model";
import {HttpClient} from "@angular/common/http";
import {AppState} from "../../shared/store/app-state";
import {Store} from "@ngrx/store";

@Injectable()
export class RecipeEffects {
  constructor(private store: Store<AppState>, private actions$: Actions, private http: HttpClient) {
  }

  @Effect()
  recipeSet = this.actions$.pipe(
    ofType(RecipeActions.SET_RECIPES),
    map(() => {
    })
  )

  @Effect()
  fetchRecipes = this.actions$.pipe(
    ofType(RecipeActions.FETCH_RECIPES),
    switchMap(() => {
      return this.http.get<Recipe[]>('https://recipebook-2b443-default-rtdb.europe-west1.firebasedatabase.app/recipes.json')
    }),
    map(recipes=> {
      return new RecipeActions.SetRecipes(recipes);
    })
  )

  @Effect({dispatch:false})
  storeRecipes = this.actions$.pipe(
    ofType(RecipeActions.STORE_RECIPES),
    withLatestFrom(this.store.select('recipes')),
    switchMap(([actionData,recipesState])=> {
      return this.http.put(
        'https://recipebook-2b443-default-rtdb.europe-west1.firebasedatabase.app/recipes.json',
        recipesState.recipes)
    })

  )
}
