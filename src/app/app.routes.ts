import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { BookListingComponent } from './pages/book-listing/book-listing.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { UserListingComponent } from './pages/user-listing/user-listing.component';
import { UserLoginComponent } from './pages/user-login/user-login.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: UserLoginComponent },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/user-registration/user-registration.component').then(
        (m) => m.UserRegistrationComponent
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
      { path: '', redirectTo: 'books', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: 'login' },
];
