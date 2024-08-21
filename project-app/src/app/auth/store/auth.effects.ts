import {Actions, Effect, ofType} from '@ngrx/effects'
import * as AuthActions from '../store/auth.actions'
import {catchError, map, switchMap, tap} from "rxjs/operators";
import {environment} from "../../../environments/environment";
import {AuthResponseData, AuthService} from "../auth.service";
import {HttpClient} from "@angular/common/http";
import {of} from "rxjs";
import {User} from "../user.model";
import {Injectable} from "@angular/core";
import {Router} from "@angular/router";

@Injectable()
export class AuthEffects {
  constructor(private actions$: Actions, private http: HttpClient, private router: Router, private authService: AuthService) {}

  @Effect()
  authLogin = this.actions$.pipe(
    ofType(AuthActions.LOGIN),
    switchMap((authData: AuthActions.Login) => {
      return this.http.post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firbaseAPIKey,
        {
          email: authData.payload.email,
          password: authData.payload.password,
          returnSecureToken: true
        }
      ).pipe(
        map(resData => {
          return this.handleAuthentication(resData);
        }),
        catchError(errorRes => {
          let errorMessage = 'An unknown error occurred!';
          if(!errorRes.error || !errorRes.error.error){
            console.log('CZEGO TU JESTEM?');
            return of(new AuthActions.AuthenticateFail(errorMessage));
          }
          switch (errorRes.error.error.message) {
            case 'EMAIL_EXISTS':
              errorMessage = 'This email exists already';
              break;
            case 'EMAIL_NOT_FOUND':
              errorMessage = 'This email does not exist';
              break;
            case 'INVALID_PASSWORD':
              errorMessage = 'This password is not correct'
              break;
          }
          return of(new AuthActions.AuthenticateFail(errorMessage));
        })
      )
    }),
  )

  @Effect()
  autoLogin = this.actions$.pipe(
    ofType(AuthActions.AUTOLOGIN),
    map(()=> {

      const userData: {
        email: string,
        id: string,
        _token: string,
        _tokenExpirationDate: string
      } = JSON.parse(<string>localStorage.getItem('userData'));

      if (!userData) {
        return new AuthActions.Logout();
      } else {
        const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate));
        if (loadedUser.token) {
          return new AuthActions.AuthenticateSuccess({user: loadedUser, redirect: false});
        }
        return new AuthActions.Logout();
      }
    })
  )

  @Effect()
  authSignup = this.actions$.pipe(
    ofType(AuthActions.SIGNUP),
    switchMap((authData: AuthActions.Signup) => {
      return this.http.post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key='+environment.firbaseAPIKey,
        {
          email: authData.payload.email,
          password: authData.payload.password,
          returnSecureToken: true
        }
      ).pipe(
        map(resData => {
          return this.handleAuthentication(resData);
        }),
        catchError(errorRes => {
          let errorMessage = 'An unknown error occurred!';
          if(!errorRes.error || !errorRes.error.error){
            return of(new AuthActions.AuthenticateFail(errorMessage));
          }
          switch (errorRes.error.error.message) {
            case 'EMAIL_EXISTS':
              errorMessage = 'This email exists already';
              break;
            case 'EMAIL_NOT_FOUND':
              errorMessage = 'This email does not exist';
              break;
            case 'INVALID_PASSWORD':
              errorMessage = 'This password is not correct'
              break;
          }
          return of(new AuthActions.AuthenticateFail(errorMessage));
        })
      )
    })
  )

  @Effect({dispatch: false})
  authLogout = this.actions$.pipe(
    ofType(AuthActions.LOGOUT),
    tap(()=> {
      localStorage.removeItem('userData');
      this.router.navigate(['/auth']);
    })
  )

  @Effect({dispatch:false})
  authRedirect = this.actions$.pipe(
    ofType(AuthActions.AUTHENTICATE_SUCCESS),
    tap((authSuccessAction: AuthActions.AuthenticateSuccess) => {
        if(authSuccessAction.payload.redirect){
          this.router.navigate(['/recipes']);
        }
    })
  )

  private handleAuthentication(resData: AuthResponseData){
    const loadedUser = new User(
      resData.email,
      resData.localId,
      resData.idToken,
      new Date(new Date().getTime() + +resData.expiresIn * 1000))
    localStorage.setItem('userData', JSON.stringify(loadedUser));
    this.authService.setLogoutTimer(+resData.expiresIn * 1000);
    return new AuthActions.AuthenticateSuccess({user: loadedUser, redirect:true});
  }
}
