import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments';
import { ApiEndpoints } from '../utils';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = environment.apiBaseUrl;

  constructor(private router: Router, private http: HttpClient) {}

  login(credentials: { email: string; password: string }) {
    return this.http.post(`${this.baseUrl}/${ApiEndpoints.LOGIN}`, credentials);
  }

  register(data: {
    userName: string;
    email: string;
    password: string;
    phoneNumber: string;
  }) {
    // return this.http.post(`${this.baseUrl}/${ApiEndpoints.REGISTER}`, data);
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  reset(credentials: { oldPassword: string; newPassword: string }) {
    return this.http.post(`${this.baseUrl}/${ApiEndpoints.RESET}`, credentials);
  }
}
