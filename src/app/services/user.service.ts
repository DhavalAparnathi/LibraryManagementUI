import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiEndpoints } from '../utils/constants/api-endpoints';

interface ApiResponse<T> {
  isSuccessfull: boolean;
  statusCode: number;
  message: string;
  data: T;
}

interface UserListData {
  items: User[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  sortColumn: string;
  sortDirection: string;
}

export interface User {
  id: number;
  userName: string;
  email: string;
  phoneNumber?: string;
  role: string;
  isActive: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  getUsers(requestBody: any): Observable<ApiResponse<UserListData>> {
    return this.http.post<ApiResponse<UserListData>>(
      `${this.baseUrl}/${ApiEndpoints.USER_LIST}`,
      requestBody
    );
  }

  deleteUser(userId: number) {
    return this.http.delete(`${this.baseUrl}/users/${userId}`);
  }

  upsertUser(user: any) {
    return this.http.post(`${this.baseUrl}/users/upsert`, user);
  }
}
