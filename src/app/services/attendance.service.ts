import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments';
import { Student, Subject } from '../models';
import { ApiEndpoints } from '../utils';

@Injectable({ providedIn: 'root' })
export class AttendanceService {
  private baseUrl = environment.apiBaseUrl;
  storedDepartmentId = 0;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      this.storedDepartmentId = decoded?.departmentId;
      console.log('STORED DEPARTMENT ID', this.storedDepartmentId);
    }
  }

  getStudentAndSubjectList(): Observable<{
    students: Student[];
    subjects: Subject[];
  }> {
    return this.http.get<{ students: Student[]; subjects: Subject[] }>(
      `${this.baseUrl}/departments/3/students-subjects`
    );
  }

  markAttendance(attendance: any) {
    return this.http.post(
      `${this.baseUrl}/${ApiEndpoints.ATTENDANCE_MARK}`,
      attendance
    );
  }
}
