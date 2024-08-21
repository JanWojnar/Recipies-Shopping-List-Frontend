import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {catchError, tap} from "rxjs/operators";
import {BehaviorSubject, throwError} from "rxjs";
import {User} from "./user.model";
import {Router} from "@angular/router";
import {environment} from "../../environments/environment";
import {AppState} from "../shared/store/app-state";
import {Store} from "@ngrx/store";
import * as AuthActions from "./store/auth.actions"


export interface AuthResponseData {
  idToken: string,
  email: string,
  kind: string,
  refreshToken: string,
  expiresIn: string,
  localId: string,
  registered?: boolean
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private tokenExpirationTimer: any;

  constructor(private http: HttpClient, private router: Router, private store: Store<AppState>) {
  }

  setLogoutTimer(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.store.dispatch(new AuthActions.Logout());
      this.clearLogoutTimer();
    }, expirationDuration)
  }

  clearLogoutTimer() {
    if(this.tokenExpirationTimer){
      clearTimeout(this.tokenExpirationTimer);
      this.tokenExpirationTimer=null;
    }
  }
}
