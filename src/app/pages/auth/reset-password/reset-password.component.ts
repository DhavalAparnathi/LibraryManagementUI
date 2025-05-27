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
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
})
export class ResetPasswordComponent {
  resetPassForm: FormGroup;
  passwordVisible = false;
  confirmPasswordVisible = false;

  constructor(
    private _fb: FormBuilder,
    private _api: AuthService,
    private _router: Router,
    private _toast: ToastService
  ) {
    this.resetPassForm = this._fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
    });
  }

  togglePasswordVisibility(field: 'oldPassword' | 'newPassword') {
    if (field === 'oldPassword') {
      this.passwordVisible = !this.passwordVisible;
    } else if (field === 'newPassword') {
      this.confirmPasswordVisible = !this.confirmPasswordVisible;
    }
  }

  onLogin() {
    if (this.resetPassForm.valid) {
      const credentials = this.resetPassForm.value;
      this._api.reset(credentials).subscribe({
        next: (res: any) => {
          if (res.isSuccessfull) {
            this._toast.showSuccess('Password reset successful!');
            this._router.navigate(['/login']);
          } else {
            this._toast.showError('Reset password failed');
          }
        },
        error: (err) => {
          console.error('Reset password failed', err);
          this._toast.showError('Reset password failed: Server error');
        },
      });
    } else {
      this.resetPassForm.markAllAsTouched();
    }
  }

  navigateToForgotPassword() {
    this._router.navigate(['/reset-password']);
  }
}
