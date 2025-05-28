import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService, ToastService } from '../../services';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  isAdmin = false;
  currentRole: string = '';

  constructor(
    private _authService: AuthService,
    private _router: Router,
    private _toast: ToastService
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      this.currentRole = decoded?.role || 'Student';
      this.isAdmin = this.currentRole === 'Admin';
    }
  }

  onLogout() {
    this._authService.logout();
    this._toast.showSuccess('Logout successful!');
  }

  navigateToBooks() {
    this._router.navigate(['/dashboard/books']);
  }

  navigateToUsers() {
    this._router.navigate(['/dashboard/users']);
  }

  navigateToIssuing() {
    this._router.navigate(['/dashboard/issued-books']);
  }

  navigateToDashboard() {
    this._router.navigate(['/dashboard']);
  }

  navigateToDepartments() {
    this._router.navigate(['/dashboard/departments']);
  }

  navigateToSubjects() {
    this._router.navigate(['/dashboard/subjects']);
  }

  isHomeRoute(): boolean {
    return this._router.url === '/dashboard/home';
  }
}
