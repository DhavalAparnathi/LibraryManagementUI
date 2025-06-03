export interface Student {
  id: number;

  name: string;
}

export interface Subject {
  id: number;

  name: string;
}

export interface AttendanceRecord {
  studentId: number;

  subjectId: number;

  date: string;

  isPresent: boolean;
}
