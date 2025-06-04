import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AttendanceRecord, Student, Subject } from '../../models';
import { AttendanceService, ToastService } from '../../services';

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss'],
})
export class AttendanceComponent implements OnInit {
  students: Student[] = [];
  subjects: Subject[] = [];

  weekDates: string[] = [];
  attendanceMap: { [key: string]: number } = {};
  attendancePresence: { [key: string]: boolean } = {};

  constructor(
    private _attendanceService: AttendanceService,
    private _toast: ToastService
  ) {}

  ngOnInit(): void {
    this.generateWeekDates();
    this.loadDataFromApi();
  }

  loadDataFromApi(): void {
    this._attendanceService.getStudentAndSubjectList().subscribe({
      next: (res) => {
        this.students = res.students;
        this.subjects = res.subjects;
      },
      error: (err) => {
        console.error('Failed to fetch data', err);
      },
    });
  }

  generateWeekDates(): void {
    const today = new Date();
    const startOfWeek = today.getDate() - today.getDay() + 1;
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(startOfWeek + i);
      this.weekDates.push(date.toISOString().split('T')[0]);
    }
  }

  getKey(studentId: number, date: string): string {
    return `${studentId}_${date}`;
  }

  submitAttendance(): void {
    const records: AttendanceRecord[] = [];

    this.students.forEach((student) => {
      this.weekDates.forEach((date) => {
        const key = this.getKey(student.studentId, date);

        const subjectId = Number(this.attendanceMap[key]);
        const isPresent = this.attendancePresence[key] ?? false;

        if (subjectId) {
          records.push({
            studentId: student.studentId,
            subjectId,
            date,
            isPresent,
          });
        }
      });
    });

    console.log('Submitted Attendance Records:', records);

    this._attendanceService.markAttendance(records).subscribe({
      next: () => {
        this._toast.showSuccess('Marked Attendance successfully');
      },
      error: () => {
        this._toast.showError('Failed to mark the attendance');
      },
    });
  }
}
