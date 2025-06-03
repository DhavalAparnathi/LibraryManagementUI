import { Component, OnInit } from '@angular/core';
import { AttendanceRecord, Student, Subject } from '../../models';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss'],
})
export class AttendanceComponent implements OnInit {
  students: Student[] = [
    { id: 1, name: 'Alice Johnson' },

    { id: 2, name: 'Bob Smith' },
  ];

  subjects: Subject[] = [
    { id: 101, name: 'Math' },

    { id: 102, name: 'Science' },

    { id: 103, name: 'English' },
  ];

  weekDates: string[] = [];
  attendanceMap: { [key: string]: number } = {};
  attendancePresence: { [key: string]: boolean } = {};

  ngOnInit(): void {
    this.generateWeekDates();
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
        const key = this.getKey(student.id, date);

        const subjectId = this.attendanceMap[key];

        const isPresent = this.attendancePresence[key] ?? false;

        if (subjectId) {
          records.push({
            studentId: student.id,

            subjectId,

            date,

            isPresent,
          });
        }
      });
    });

    console.log('Submitted Attendance Records:', records);
  }
}
