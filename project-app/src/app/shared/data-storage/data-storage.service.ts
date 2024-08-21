import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {RecipeService} from "../../recipes/recipe.service";
import {map} from "rxjs/operators";
import {AuthService} from "../../auth/auth.service";
import {Subscription} from "rxjs";
import {Store} from "@ngrx/store";
import {AppState} from "../store/app-state";


@Injectable({
  providedIn: 'root'
})
export class DataStorageService {

  token!: string | null;
  tokenSub!: Subscription;

  constructor(private http: HttpClient, private recipeService: RecipeService, private authService: AuthService, private store: Store<AppState>) {
    this.tokenSub = this.store.select('authorization').pipe(map(state=>{return state.user})).subscribe(
      user => {
        if(this.token){
          this.token = user.token;
        }
      }
    )
  }
}
