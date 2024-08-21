import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {RecipesComponent} from "./recipes.component";
import {AuthGuard} from "../auth/auth.guard";
import {RecipeStartComponent} from "./recipe-start/recipe-start.component";
import {RecipeEditComponent} from "./recipe-edit/recipe-edit.component";
import {RecipsesResolverService} from "./recipses-resolver.service";
import {RecipeDetailComponent} from "./recipe-detail/recipe-detail.component";


const routes: Routes =
  [
    {
      path: '', component: RecipesComponent, canActivate: [AuthGuard], children: [
        {path: '', component: RecipeStartComponent},
        {path: 'new', component: RecipeEditComponent},
        {path: ':id/edit', component: RecipeEditComponent, resolve: [RecipsesResolverService]},
        {path: ':id', component: RecipeDetailComponent, resolve: [RecipsesResolverService]}]
    }
  ]

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecipesRoutingModule {

}
