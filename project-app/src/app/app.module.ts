import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {StoreModule} from '@ngrx/store';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HeaderComponent} from './header/header.component';
import {HttpClientModule} from "@angular/common/http";
import {SharedModule} from "./shared/shared.module";
import {CoreModule} from "./core.module";
import {AuthModule} from "./auth/auth.module";
import {LoggingService} from "./logging.service";
import {reducers} from "./shared/store/app-state";
import {EffectsModule} from "@ngrx/effects"
import {AuthEffects} from "./auth/store/auth.effects";
import {RecipeEffects} from "./recipes/store/recipe.effects";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent
  ],
  imports: [
    StoreModule.forRoot(reducers),
    AuthModule,
    CoreModule,
    BrowserModule,
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    EffectsModule.forRoot([AuthEffects,RecipeEffects])
  ],
  bootstrap: [AppComponent],
  providers: [LoggingService]
})
export class AppModule {
}
