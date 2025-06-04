export interface Student {
  studentId: number;
  studentName: string;
}

export interface Subject {
  subjectId: number;
  subjectName: string;
}

export interface AttendanceRecord {
  studentId: number;
  subjectId: number;
  date: string;
  isPresent: boolean;
  filledBy?: number;
  isTeacher?: boolean;
}
