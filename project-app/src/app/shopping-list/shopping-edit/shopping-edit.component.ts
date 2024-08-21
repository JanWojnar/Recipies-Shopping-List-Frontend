import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Ingredient} from "../../shared/ingredient.model";
import {NgForm} from "@angular/forms";
import {Store} from "@ngrx/store";
import * as ShoppingListActions from '../store/shopping-list.actions';
import {AppState} from "../../shared/store/app-state";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {

  @ViewChild('f') editForm!: NgForm;

  editMode: boolean = false;

  storeSubscription: Subscription;
  selectedIngredient!: Ingredient;

  constructor(private store: Store<AppState>) {
  }

  ngOnInit(): void {
    this.storeSubscription = this.store.select('shoppingList').subscribe(stateData => {
      if (stateData.editedIngredientIndex > -1) {
        console.log()
        this.editMode = true;
        this.selectedIngredient = stateData.editedIngredient;
        this.editForm.setValue({
          name: stateData.editedIngredient.name,
          amount: stateData.editedIngredient.amount
        })
      } else {
        this.editMode = false;
        this.selectedIngredient = null;
      }
    })
  }


  ngOnDestroy(): void {
    this.store.dispatch(new ShoppingListActions.StopEditIngredient());
    this.storeSubscription.unsubscribe();
  }


  onAddClick(form: NgForm) {
    const value = form.value;
    const newIngredient = new Ingredient(value.name, value.amount);

    if (!this.editMode) {
      this.store.dispatch(new ShoppingListActions.AddIngredient(newIngredient));
    } else {
      this.store.dispatch(new ShoppingListActions.UpdateIngredient(newIngredient));
      this.editMode = false;
    }
    form.reset();
  }

  onClearClick() {
    this.editMode = false;
    this.editForm.reset();
    this.store.dispatch(new ShoppingListActions.StopEditIngredient());
  }

  onDeleteClick() {
    this.editMode = false;
    this.store.dispatch(new ShoppingListActions.DeleteIngredient());
  }
}
