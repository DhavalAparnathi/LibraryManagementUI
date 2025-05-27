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
  selector: 'app-user-registration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-registration.component.html',
  styleUrl: './user-registration.component.scss',
})
export class UserRegistrationComponent {
  registerForm: FormGroup;
  passwordVisible = false;
  confirmPasswordVisible = false;

  constructor(
    private _fb: FormBuilder,
    private _api: AuthService,
    private _router: Router,
    private _toast: ToastService
  ) {
    this.registerForm = this._fb.group({
      userName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });
  }

  togglePasswordVisibility(field: 'password' | 'confirmPassword') {
    if (field === 'password') {
      this.passwordVisible = !this.passwordVisible;
    } else if (field === 'confirmPassword') {
      this.confirmPasswordVisible = !this.confirmPasswordVisible;
    }
  }

  onRegister() {
    if (this.registerForm.valid) {
      const formData = this.registerForm.value;

      if (formData.password !== formData.confirmPassword) {
        this._toast.showError('Passwords do not match');
        return;
      }

      const payload = {
        userName: formData.userName,
        email: formData.email,
        password: formData.password,
        phoneNumber: formData.phoneNumber,
      };

      // this._api.register(payload).subscribe({
      //   next: (response: any) => {
      //     if (response.isSuccessfull) {
      //       this._toast.showSuccess('Registration successful');
      //       this._router.navigate(['/login']);
      //     } else {
      //       this._toast.showError(response.message || 'Registration failed');
      //     }
      //   },
      //   error: (err) => {
      //     console.error('Registration failed', err);
      //     this._toast.showError('Registration failed');
      //   },
      // });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}
