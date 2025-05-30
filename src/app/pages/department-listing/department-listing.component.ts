import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DepartmentService, ToastService, UserService } from '../../services';
import { DATE_FORMAT } from '../../utils';

@Component({
  selector: 'app-department-listing',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './department-listing.component.html',
  styleUrl: './department-listing.component.scss',
})
export class DepartmentListingComponent {
  departmentForm: FormGroup;
  departments: any[] = [];
  users: any[] = [];
  loading = false;
  error = '';
  isAdmin = false;
  showModal = false;
  selectedDepartment: any = null;
  filters = { departmentName: '', hodUserName: '' };
  sortColumn = 'DepartmentName';
  sortDirection = 'ASC';
  pageNumber = 1;
  pageSize = 5;
  totalPages = 1;
  totalCount = 0;
  defaultDateFormat = DATE_FORMAT.DD_MMM_YYYY;

  constructor(
    private _departmentService: DepartmentService,
    private _userService: UserService,
    private _toast: ToastService,
    private _fb: FormBuilder
  ) {
    this.departmentForm = this._fb.group({
      departmentId: [0],
      departmentName: ['', Validators.required],
      description: ['', Validators.required],
      hodUserId: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      this.isAdmin = decoded?.role === 'Admin';
    }
    this.fetchDepartments();
    // this.fetchUsersByRole();
  }

  openModal(department?: any) {
    this.selectedDepartment = department ? { ...department } : null;

    if (this.selectedDepartment) {
      this.departmentForm.patchValue({
        departmentId: this.selectedDepartment.departmentId,
        departmentName: this.selectedDepartment.departmentName,
        description: this.selectedDepartment.description,
        hodUserId: this.selectedDepartment.hodUserId,
      });
    } else {
      this.departmentForm.reset({
        departmentId: 0,
        departmentName: '',
        description: '',
        hodUserId: '',
      });
    }
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  fetchDepartments() {
    const requestBody = {
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
      sortColumn: this.sortColumn,
      sortDirection: this.sortDirection,
      filters: { ...this.filters },
    };

    this.loading = true;

    this._departmentService.getDepartments(requestBody).subscribe({
      next: (response) => {
        this.departments = response.data.items;
        this.totalCount = response.data.totalCount;
        this.totalPages = Math.ceil(this.totalCount / this.pageSize);
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load departments';
        this.loading = false;
      },
    });
  }

  deleteDepartment(departmentId: number) {
    if (confirm('Are you sure you want to delete this department?')) {
      this._departmentService.deleteDepartment(departmentId).subscribe({
        next: () => {
          this.departments = this.departments.filter(
            (d) => d.departmentId !== departmentId
          );
          this._toast.showSuccess('Department deleted successfully');
        },
        error: () => {
          this._toast.showError('Failed to delete department');
        },
      });
    }
  }

  // fetchUsersByRole() {
  //   this._userService.getUsersByRole(UserRole.HOD.toString()).subscribe({
  //     next: (response) => {
  //       this.users = response.data;
  //     },
  //     error: (err) => {
  //       console.error('Error fetching users', err);
  //     },
  //   });
  // }

  onFilterChange() {
    this.pageNumber = 1;
    this.fetchDepartments();
  }

  onSortChange() {
    this.pageNumber = 1;
    this.fetchDepartments();
  }

  nextPage() {
    if (this.pageNumber < this.totalPages) {
      this.pageNumber++;
      this.fetchDepartments();
    }
  }

  prevPage() {
    if (this.pageNumber > 1) {
      this.pageNumber--;
      this.fetchDepartments();
    }
  }

  submitDepartmentForm() {
    if (this.departmentForm.invalid) {
      this.departmentForm.markAllAsTouched();
      return;
    }

    const formValue = this.departmentForm.getRawValue();

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
        this.fetchDepartments();
      },
      error: () => {
        this._toast.showError('Failed to save department');
      },
    });
  }
}
