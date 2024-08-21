import {Component, Injectable, OnDestroy, OnInit} from '@angular/core';
import {Recipe} from "../recipe-list/recipe.model";
import {ActivatedRoute, Params, Router} from '@angular/router';
import {RecipeService} from '../recipe.service';
import {Store} from "@ngrx/store";
import * as ShoppingListActions from '../../shopping-list/store/shopping-list.actions';
import * as RecipeActions from "../store/recipe.actions"
import {AppState} from "../../shared/store/app-state";
import {map, switchMap} from "rxjs/operators";
import {Subscription} from "rxjs";

@Injectable()
@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit, OnDestroy {

  recipeDetail!: Recipe;
  id!: number;
  detailRecipeSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService,
    private router: Router,
    private store: Store<AppState>) {
  }

  ngOnInit(): void {
    this.detailRecipeSub = this.route.params.pipe(
      map(params => {
        return +params['id']
      }),
      switchMap(id => {
        this.id=id;
        return this.store.select('recipes');
      }),
      map(recipeState => {
        return recipeState.recipes.find((recipe, index) => {
          return index===this.id;
        })
      })
    ).subscribe( recipe => {
      this.recipeDetail=recipe;
    })
  }

  ngOnDestroy(): void {
    this.detailRecipeSub.unsubscribe();
  }

  onMoveClick(){
    this.store.dispatch(new ShoppingListActions.AddIngredients(this.recipeDetail.ingredients));
  }

  onEdit(){
    this.router.navigate(['edit'], {relativeTo:this.route})
  }

  onDelete() {
    this.store.dispatch(new RecipeActions.DeleteRecipe(this.id));
    this.router.navigate(['recipes'])
  }
}
