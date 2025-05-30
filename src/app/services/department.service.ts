import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments';
import { ApiResponse, PaginatedListData } from '../models';
import { ApiEndpoints } from '../utils';

@Injectable({
  providedIn: 'root',
})
export class DepartmentService {
  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  getDepartments(requestBody: any): Observable<ApiResponse<PaginatedListData>> {
    return this.http.post<ApiResponse<PaginatedListData>>(
      `${this.baseUrl}/${ApiEndpoints.DEPARTMENTS_LIST}`,
      requestBody
    );
  }

  deleteDepartment(departmentId: number) {
    return this.http.delete(
      `${this.baseUrl}/${ApiEndpoints.DEPARTMENTS}/${departmentId}`
    );
  }

  upsertDepartment(department: any) {
    return this.http.post(
      `${this.baseUrl}/${ApiEndpoints.UPSERT_DEPARTMENT}`,
      department
    );
  }

  getAllDepartments(): Observable<ApiResponse<string[]>> {
    return this.http.get<ApiResponse<string[]>>(
      `${this.baseUrl}/${ApiEndpoints.DEPARTMENTS_GET_ALL}`
    );
  }

  getSubjectList(requestBody: any): Observable<ApiResponse<PaginatedListData>> {
    return this.http.post<ApiResponse<PaginatedListData>>(
      `${this.baseUrl}/${ApiEndpoints.SUBJECT_LIST}`,
      requestBody
    );
  }

  getAllSubjects(): Observable<ApiResponse<string[]>> {
    return this.http.get<ApiResponse<string[]>>(
      `${this.baseUrl}/${ApiEndpoints.SUBJECT_GET_ALL}`
    );
  }

  deleteSubject(subjectId: number) {
    return this.http.delete(
      `${this.baseUrl}/${ApiEndpoints.SUBJECTS}/${subjectId}`
    );
  }

  upsertSubject(subject: any) {
    return this.http.post(
      `${this.baseUrl}/${ApiEndpoints.UPSERT_SUBJECT}`,
      subject
    );
  }

  getTimetable(departmentId: number): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(
      `${this.baseUrl}/${ApiEndpoints.TIMETABLE}/${departmentId}/get-timetable`
    );
  }
}
