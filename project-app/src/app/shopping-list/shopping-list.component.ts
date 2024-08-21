import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {LoggingService} from "../logging.service";
import {Store} from "@ngrx/store";
import {AppState} from "../shared/store/app-state";
import * as ShoppingListActions from "../shopping-list/store/shopping-list.actions"
import {ShoppingListState} from "./store/shopping-list.reducer";

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {

  selectedId: number = -1;

  shoppingListState: Observable<ShoppingListState>;

  constructor(private loggingService: LoggingService, private store: Store<AppState>) {
  }

  ngOnInit(): void {
    this.shoppingListState = this.store.select('shoppingList');
  }

  ngOnDestroy(): void {
    this.store.dispatch(new ShoppingListActions.StopEditIngredient());
  }

  onEditItem(id: number) {
    if(this.selectedId!==id){
      this.selectedId=id;
      this.store.dispatch(new ShoppingListActions.StartEditIngredient(id));
    } else {
      this.selectedId=-1;
      this.store.dispatch(new ShoppingListActions.StopEditIngredient());
    }
  }
}
