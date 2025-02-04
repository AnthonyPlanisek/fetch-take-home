import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginPageComponent } from './login-page/login-page.component';
import { DogLandingPageComponent } from './dog-landing-page/dog-landing-page.component';

const routes: Routes = [
  { path: 'login', component: LoginPageComponent },
  { path: 'landing-page', component: DogLandingPageComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
