import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments';
import { ApiResponse, PaginatedListData } from '../models';
import { ApiEndpoints } from '../utils';

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

  getUsers(requestBody: any): Observable<ApiResponse<PaginatedListData>> {
    return this.http.post<ApiResponse<PaginatedListData>>(
      `${this.baseUrl}/${ApiEndpoints.USER_LIST}`,
      requestBody
    );
  }

  deleteUser(userId: number) {
    return this.http.delete(`${this.baseUrl}/${ApiEndpoints.USERS}/${userId}`);
  }

  upsertUser(user: any) {
    return this.http.post(`${this.baseUrl}/${ApiEndpoints.UPSERT_USER}`, user);
  }

  getAllUserRoles(): Observable<ApiResponse<string[]>> {
    return this.http.get<ApiResponse<string[]>>(
      `${this.baseUrl}/${ApiEndpoints.USER_GET_ALL_ROLES}`
    );
  }

  // getUsersByRole(roleId: string): Observable<ApiResponse<string[]>> {
  //   return this.http.get<ApiResponse<string[]>>(
  //     `${this.baseUrl}/${ApiEndpoints.GET_USERS_BY_ROLE}/${roleId}`
  //   );
  // }
}
