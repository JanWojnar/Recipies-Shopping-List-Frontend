import {Injectable} from '@angular/core';
import {HttpHandler, HttpInterceptor, HttpParams, HttpRequest} from "@angular/common/http";
import {AuthService} from "./auth.service";
import {exhaustMap, map, take} from "rxjs/operators";
import {Store} from "@ngrx/store";
import {AppState} from "../shared/store/app-state";

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {


  constructor(private authService: AuthService, private store: Store<AppState>) {

  }

  intercept(req: HttpRequest<any>, next: HttpHandler){

    return this.store.select('authorization').pipe(
      take(1),
      map(authState => {
        return authState.user;
      }),
      exhaustMap(user => {
        if(!user){
          return next.handle(req);
        }
        console.log(user.token);
        const modifiedReq = req.clone({
          params: new HttpParams().set('auth', user.token)
        });
        return next.handle(modifiedReq);
      })
    )
  }
}
