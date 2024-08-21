import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from "@angular/router";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {AuthService} from "./auth.service";
import {map, take, tap} from "rxjs/operators";
import {Store} from "@ngrx/store";
import {AppState} from "../shared/store/app-state";

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router, private store: Store<AppState>) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Promise<boolean | UrlTree> | Observable<boolean | UrlTree> {
    return this.store.select('authorization').pipe(
      take(1),
      map(authState => {return authState.user}),
      map(user => {
        const isAuth = !!user;
        if(user){
          return true;
        }
        return this.router.createUrlTree(['/auth']);

      }),
      tap(isAuth => {
        if (!isAuth) {
          this.router.navigate(['/auth']);
        }
      })
    );
  }
}
