import { Routes } from '@angular/router';
import { LoginPage } from './authentication/login/login.page';
import { RegisterPage } from './authentication/register/register.page';
import { CarsListPage } from './cars/list/cars-list.page';
import { AddCarModal } from './cars/add-modal/add-car.modal';
import { DetailPage } from './cars/detail/detail.page';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginPage
  },
  {
    path: 'register',
    component: RegisterPage
  },
  {
    path: 'cars-list',
    component: CarsListPage
  },
  {
    path: 'create',
    component: AddCarModal
  },
  {
    path: 'detail/:id',
    component: DetailPage
  }
];
