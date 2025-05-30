import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import {
  BookListingComponent,
  DashboardComponent,
  DepartmentListingComponent,
  DepartmentTimetableComponent,
  HomeComponent,
  SubjectsListingComponent,
  UserListingComponent,
  UserLoginComponent,
} from './pages';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: UserLoginComponent },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/auth/user-registration/user-registration.component').then(
        (m) => m.UserRegistrationComponent
      ),
  },
  {
    path: 'reset-password',
    loadComponent: () =>
      import('./pages/auth/reset-password/reset-password.component').then(
        (m) => m.ResetPasswordComponent
      ),
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'users',
        component: UserListingComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'books',
        component: BookListingComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'departments',
        component: DepartmentListingComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'timetable',
        component: DepartmentTimetableComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'subjects',
        component: SubjectsListingComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'home',
        component: HomeComponent,
        canActivate: [AuthGuard],
      },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: 'login' },
];
