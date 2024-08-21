import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from "@angular/router";
import {Recipe} from "./recipe-list/recipe.model";
import {AppState} from "../shared/store/app-state";
import {Store} from "@ngrx/store";
import * as RecipeActions from "../recipes/store/recipe.actions"
import {Actions, ofType} from "@ngrx/effects";
import {map, switchMap, take} from "rxjs/operators";
import {of} from "rxjs";

@Injectable({providedIn: 'root'})
export class RecipsesResolverService implements Resolve<Recipe[]>{

  constructor(private store: Store<AppState>, private actions$: Actions) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.store.select('recipes').pipe(
      take(1),
      map(state=>{return state.recipes}),
      switchMap(recipes => {
        if(recipes.length===0){
          this.store.dispatch(new RecipeActions.FetchRecipes());
          return this.actions$.pipe(
            ofType(RecipeActions.SET_RECIPES),
            take(1)
          )
        } else {
          return of(recipes)
        }
      })
    )
  }
}
