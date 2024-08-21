import {Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from "@angular/forms";
import {AuthService} from "./auth.service";
import {Router} from "@angular/router";
import {PlaceholderDirective} from "../shared/placeholder/placeholder.directive";
import {AppState} from "../shared/store/app-state";
import {Store} from "@ngrx/store";
import * as AuthActions from "../auth/store/auth.actions"
@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  isLoginMode = true;
  isLoading = false;
  error = '';
  @ViewChild(PlaceholderDirective) alertHost!: PlaceholderDirective;

  constructor(
    private authService: AuthService,
    private router: Router,
    private store: Store<AppState>) {
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;

    this.isLoading = true;
    if (this.isLoginMode) {
      console.log('Wpisano email:' + email + ' Wpisano hasło: ' + password)
      this.store.dispatch(new AuthActions.Login({email: email, password: password}));
    } else {
      this.store.dispatch(new AuthActions.Signup({email: email, password: password}));
    }
    form.reset();
  }

  onHandleError(){
    this.store.dispatch(new AuthActions.Acknowledge());
  }

  ngOnInit(): void {
    this.store.select('authorization').subscribe(authState => {
      this.isLoading = authState.loading;
      this.error = authState.authError;
    })
  }
}
