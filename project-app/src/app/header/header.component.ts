import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {DataStorageService} from "../shared/data-storage/data-storage.service";
import {AuthService} from "../auth/auth.service";
import {Subscription} from "rxjs";
import {Store} from "@ngrx/store";
import {AppState} from "../shared/store/app-state";
import {map} from "rxjs/operators";
import * as AuthActions from "../auth/store/auth.actions";
import * as RecipeActions from "../recipes/store/recipe.actions"

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  isAuthenticated: boolean = false;
  userSub!: Subscription;
  collapsed = true;

  @Output() featureSelected = new EventEmitter<string>();

  constructor(private dataStorageService: DataStorageService, private authService: AuthService, private store: Store<AppState>) {
  }

  ngOnInit(): void {
    this.userSub = this.store.select('authorization').pipe(map(state=>{return state.user})).subscribe((user) => {
        this.isAuthenticated = !!user;
      }
    )
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }

  onSelect(selection: string) {
    this.featureSelected.emit(selection);
  }

  onLogout(){
    this.store.dispatch(new AuthActions.Logout());
  }

  onSave() {
    this.store.dispatch(new RecipeActions.StoreRecipes());
  }

  onFetchData() {
    this.store.dispatch(new RecipeActions.FetchRecipes());
  }
}
