import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  isAdmin = false;
  userRole: string = '';

  constructor(
    private _authService: AuthService,
    private _router: Router,
    private _toast: ToastService
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      this.userRole = decoded?.role || 'User';
      this.isAdmin = this.userRole === 'Admin';
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
}
