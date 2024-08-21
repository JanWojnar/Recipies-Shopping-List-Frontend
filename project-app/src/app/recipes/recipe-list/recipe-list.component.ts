import {Component, Injectable, OnDestroy, OnInit} from '@angular/core';
import {Recipe} from "./recipe.model";
import {RecipeService} from "../recipe.service";
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from "rxjs";
import {AppState} from "../../shared/store/app-state";
import {Store} from "@ngrx/store";
import {RecipeState} from "../store/recipe.reducer";

@Injectable()
@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit, OnDestroy {

  recipes: Recipe[] = [];
  recipesChangedSub!: Subscription;

  constructor(
    private recipeService: RecipeService,
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<AppState>) {
  }

  ngOnInit(): void {
    this.recipesChangedSub=this.store.select('recipes')
      .subscribe((state: RecipeState) => {
      this.recipes=state.recipes;
    });
  }

  ngOnDestroy(): void {
    this.recipesChangedSub.unsubscribe();
  }

  onNewRecipe(){
    this.router.navigate(['new'], {relativeTo: this.route})
  }
}
