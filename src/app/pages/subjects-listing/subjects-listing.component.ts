import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DepartmentService, ToastService } from '../../services';

@Component({
  selector: 'app-subjects-listing',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './subjects-listing.component.html',
  styleUrl: './subjects-listing.component.scss',
})
export class SubjectsListingComponent {
  subjectForm: FormGroup;
  subjects: any[] = [];
  departments: any[] = [];
  loading = false;
  error = '';
  isAdmin = false;
  showModal = false;
  selectedSubject: any = null;
  filters = { subjectName: '' };
  sortColumn = 'SubjectName';
  sortDirection = 'ASC';
  pageNumber = 1;
  pageSize = 5;
  totalPages = 1;
  totalCount = 0;

  constructor(
    private _departmentService: DepartmentService,
    private _toast: ToastService,
    private _fb: FormBuilder
  ) {
    this.subjectForm = this._fb.group({
      subjectId: [0],
      subjectName: ['', Validators.required],
      year: ['', Validators.required],
      departmentId: [0],
    });
  }

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      this.isAdmin = decoded?.role === 'Admin';
    }
    this.fetchAllSubjects();
  }

  openModal(department?: any) {
    this.selectedSubject = department ? { ...department } : null;

    if (this.selectedSubject) {
      this.subjectForm.patchValue({
        subjectId: this.selectedSubject.subjectId,
        subjectName: this.selectedSubject.subjectName,
        year: this.selectedSubject.year,
        departmentId: this.selectedSubject.departmentId,
      });
    } else {
      this.subjectForm.reset({
        subjectId: 0,
        subjectName: '',
        year: '',
        departmentId: 0,
      });
    }
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  fetchAllSubjects() {
    const requestBody = {
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
      sortColumn: this.sortColumn,
      sortDirection: this.sortDirection,
      filters: { ...this.filters },
    };

    this.loading = true;

    this._departmentService.getAllSubjects().subscribe({
      next: (response) => {
        // this.subjects = response.data.items;
        // this.totalCount = response.data.totalCount;
        // this.totalPages = Math.ceil(this.totalCount / this.pageSize);
        this.subjects = response.data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load subjects';
        this.loading = false;
      },
    });
  }

  deleteSubject(subjectId: number) {
    if (confirm('Are you sure you want to delete this department?')) {
      this._departmentService.deleteSubject(subjectId).subscribe({
        next: () => {
          this.subjects = this.subjects.filter(
            (d) => d.subjectId !== subjectId
          );
          this._toast.showSuccess('Department deleted successfully');
        },
        error: () => {
          this._toast.showError('Failed to delete department');
        },
      });
    }
  }

  onFilterChange() {
    this.pageNumber = 1;
    this.fetchAllSubjects();
  }

  onSortChange() {
    this.pageNumber = 1;
    this.fetchAllSubjects();
  }

  nextPage() {
    if (this.pageNumber < this.totalPages) {
      this.pageNumber++;
      this.fetchAllSubjects();
    }
  }

  prevPage() {
    if (this.pageNumber > 1) {
      this.pageNumber--;
      this.fetchAllSubjects();
    }
  }

  submitSubjectForm() {
    if (this.subjectForm.invalid) {
      this.subjectForm.markAllAsTouched();
      return;
    }

    const formValue = this.subjectForm.getRawValue();

    if (!formValue.departmentId || formValue.departmentId === 0) {
      delete formValue.departmentId;
    }

    this._departmentService.upsertDepartment(formValue).subscribe({
      next: () => {
        this._toast.showSuccess(
          formValue.departmentId
            ? 'Department updated successfully'
            : 'Department added successfully'
        );
        this.closeModal();
        this.fetchAllSubjects();
      },
      error: () => {
        this._toast.showError('Failed to save department');
      },
    });
  }
}
