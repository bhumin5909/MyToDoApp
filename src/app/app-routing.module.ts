import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './Components/home/home.component';
import { LoginComponent } from './Components/login/login.component';
import { NotFoundComponent } from './Components/not-found/not-found.component';
import { DashboardComponent } from './Components/dashboard/dashboard.component';
import { SignUpComponent } from './Components/sign-up/sign-up.component';
import { authGuardGuard } from './RouteGuards/auth-guard.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'Home',
    pathMatch: 'full'
  },
  {
    path:'Home',
    title:'ToDo App',
    component: HomeComponent
  },
  {
    path:'Dashboard',
    title:'Dashboard',
    component: DashboardComponent,
    canActivate:[authGuardGuard]
  },
  {
    path: 'Login',
    title:'Login Page',
    component: LoginComponent
  },
  {
    path: 'signUp',
    title:'Sign Up Page',
    component: SignUpComponent
  },
  {
    path:'**',      // wild card route
    title:'Page Not Found',
    component: NotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
