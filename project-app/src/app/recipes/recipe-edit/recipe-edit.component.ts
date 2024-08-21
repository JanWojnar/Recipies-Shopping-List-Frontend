import {Component, Injectable, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
import {RecipeService} from "../recipe.service";
import {Recipe} from "../recipe-list/recipe.model";
import {Store} from "@ngrx/store";
import {AppState} from "../../shared/store/app-state";
import {map} from "rxjs/operators";
import * as RecipeActions from "../store/recipe.actions"
import {Subscription} from "rxjs";

@Injectable()
@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit, OnDestroy {

  id!: number;
  editMode = false;
  recipeForm!: FormGroup;
  initialName!: string;
  storeSub: Subscription;

  constructor(private store: Store<AppState>, private route: ActivatedRoute, private recipeService: RecipeService, private router: Router) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        this.id = +params['id'];
        this.editMode = params['id'] != null;
        this.initForm();
        this.initialName = this.recipeForm.getRawValue()['name'];
      }
    );
  }

  onSubmit() {
    const newRecipe = new Recipe(
      this.recipeForm.value['name'],
      this.recipeForm.value['description'],
      this.recipeForm.value['imagePath'],
      this.recipeForm.value['ingredients'])
    if (!this.editMode) {
      this.store.dispatch(new RecipeActions.AddRecipe(newRecipe));
    } else {
      this.store.dispatch(new RecipeActions.UpdateRecipe({recipe: newRecipe, id: this.id}));
    }
    this.router.navigate(['recipes']);
  }

  onCancel() {
    this.router.navigate(['../'], {relativeTo: this.route});
  }

  onAddIngredient() {
    (<FormArray>this.recipeForm.get('ingredients')).push(<never>(new FormGroup({
      'name': new FormControl(null, Validators.required),
      'amount': new FormControl(null, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)])
    })))
  }

  onRemoveIngredient(id: number) {
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(id);
  }

  get controls() {
    return (<FormArray>this.recipeForm.get('ingredients')).controls;
  }

  private initForm() {
    let recipeName = '';
    let recipeImagePath = '';
    let recipeDescription = '';
    let recipeIngredients = new FormArray([]);
    if (this.editMode) {
      this.storeSub = this.store.select('recipes').pipe(
        map(state => {
          return state.recipes.find((recipe, index) => {
            return index === this.id;
          })
        })
      ).subscribe(recipe => {
        recipeName = recipe.name;
        recipeImagePath = recipe.imagePath;
        recipeDescription = recipe.description;
        if (recipe['ingredients']) {
          for (let ingredient of recipe.ingredients) {
            recipeIngredients.push(
              <never>(new FormGroup({
                'name': new FormControl(ingredient.name, Validators.required),
                'amount': new FormControl(ingredient.amount, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)])
              }))
            );
          }
        }
      })
    }
    this.recipeForm = new FormGroup({
      'name': new FormControl(recipeName, Validators.required),
      'imagePath': new FormControl(recipeImagePath, Validators.required),
      'description': new FormControl(recipeDescription, Validators.required),
      'ingredients': recipeIngredients
    });
  }

  ngOnDestroy(): void {
    if(this.storeSub){
      this.storeSub.unsubscribe();
    }
  }
}
