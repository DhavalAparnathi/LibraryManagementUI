import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import {
  AttendanceComponent,
  BookListingComponent,
  DashboardComponent,
  DepartmentListingComponent,
  DepartmentTimetableComponent,
  HomeComponent,
  MyDepartmentComponent,
  ResetPasswordComponent,
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
        path: 'reset-password',
        component: ResetPasswordComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'attendance',
        component: AttendanceComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'my-department',
        component: MyDepartmentComponent,
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
