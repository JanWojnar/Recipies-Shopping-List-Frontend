import {Component, OnInit} from '@angular/core';
import {AuthService} from "./auth/auth.service";
import {LoggingService} from "./logging.service";
import {Store} from "@ngrx/store";
import {AppState} from "./shared/store/app-state";
import * as AuthActions from "../app/auth/store/auth.actions"

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'project-app';

  constructor(private store: Store<AppState>, private authService: AuthService, private loggingService: LoggingService) {}

  ngOnInit(): void {
    this.store.dispatch(new AuthActions.AutoLogin())
    this.loggingService.printLog('Hello from AppComponent ngOnInit!')
  }
}
