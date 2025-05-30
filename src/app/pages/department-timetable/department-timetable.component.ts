import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DepartmentService, ToastService, UserService } from '../../services';
import { DATE_FORMAT } from '../../utils';
import { ApiResponse } from '../../models';

@Component({
  selector: 'app-department-timetable',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './department-timetable.component.html',
  styleUrl: './department-timetable.component.scss',
})
export class DepartmentTimetableComponent {
  timetableData: any;
  loading = false;
  error = '';
  isAdmin = false;
  isHod = false;
  defaultDateFormat = DATE_FORMAT.DD_MMM_YYYY;

  constructor(private _departmentService: DepartmentService) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      this.isAdmin = decoded?.role === 'Admin';
      this.isHod = decoded?.role === 'HOD';
    }
    this.fetchDepartmentTimetable();
  }

  fetchDepartmentTimetable() {
    this.loading = true;

    this._departmentService.getTimetable(3).subscribe({
      next: (response) => {
        this.timetableData = response;
        console.log('Data:::', response);
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load timetable';
        this.loading = false;
      },
    });
  }

  // groupByDay(data: any[]) {
  //   const result: any = {};

  //   data.forEach((item) => {
  //     if (!result[item.dayId]) {
  //       result[item.dayId] = [];
  //     }

  //     result[item.dayId].push(item);
  //   });

  //   return result;
  // }
}
