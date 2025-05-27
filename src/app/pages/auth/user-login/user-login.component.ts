import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, ToastService } from '../../../services';

@Component({
  selector: 'app-user-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-login.component.html',
  styleUrl: './user-login.component.scss',
})
export class UserLoginComponent {
  loginForm: FormGroup;
  passwordVisible = false;

  constructor(
    private _fb: FormBuilder,
    private _api: AuthService,
    private _router: Router,
    private _toast: ToastService
  ) {
    this.loginForm = this._fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  onLogin() {
    if (this.loginForm.valid) {
      const credentials = this.loginForm.value;
      this._api.login(credentials).subscribe({
        next: (res: any) => {
          if (res.isSuccessfull && res.data.token) {
            localStorage.setItem('token', res.data.token);
            this._toast.showSuccess('Login successful!');
            this._router.navigate(['/dashboard']);
          } else {
            this._toast.showError('Login failed: Invalid credentials');
          }
        },
        error: (err) => {
          console.error('Login failed', err);
          this._toast.showError('Login failed: Server error');
        },
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  // navigateToRegister() {
  //   this._router.navigate(['/register']);
  // }

  navigateToForgotPassword() {
    this._router.navigate(['/reset-password']);
  }
}
