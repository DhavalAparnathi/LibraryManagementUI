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
import { getRoleKey } from '../../utils';

@Component({
  selector: 'app-user-listing',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './user-listing.component.html',
  styleUrl: './user-listing.component.scss',
})
export class UserListingComponent {
  userForm: FormGroup;
  users: any[] = [];
  roles: any[] = [];
  departments: any[] = [];
  loading = false;
  isAdmin = false;
  passwordVisible = false;
  showModal = false;
  selectedUser: any = null;
  error = '';
  sortColumn = 'UserName';
  sortDirection = 'ASC';
  pageNumber = 1;
  pageSize = 5;
  totalPages = 1;
  totalCount = 0;
  filters = { userName: '', email: '' };
  getRoleKey = getRoleKey;

  constructor(
    private _userService: UserService,
    private _departmentService: DepartmentService,
    private _toast: ToastService,
    private _fb: FormBuilder
  ) {
    this.userForm = this._fb.group({
      id: [0],
      userName: ['', Validators.required],
      passwordHash: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      roleId: ['', Validators.required],
      departmentId: ['', Validators.required],
      isActive: [true],
    });
  }

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      this.isAdmin = decoded?.role === 'Admin';
    }

    this.fetchUsers();
    this.fetchUserRoles();
    this.fetchDepartments();
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  openModal(user?: any) {
    this.selectedUser = user ? { ...user } : null;

    if (this.selectedUser) {
      this.userForm.patchValue({
        id: this.selectedUser.id,
        userName: this.selectedUser.userName,
        passwordHash: '',
        email: this.selectedUser.email,
        phoneNumber: this.selectedUser.phoneNumber,
        isActive: this.selectedUser.isActive,
        roleId: this.selectedUser.roleId,
        departmentId: this.selectedUser.departmentId,
      });
      this.userForm.get('passwordHash')?.clearValidators();
      this.userForm.get('passwordHash')?.updateValueAndValidity();
    } else {
      this.userForm.reset({
        id: 0,
        userName: '',
        passwordHash: '',
        email: '',
        phoneNumber: '',
        isActive: true,
        roleId: '',
        departmentId: '',
      });
      this.userForm.get('passwordHash')?.setValidators(Validators.required);
      this.userForm.get('passwordHash')?.updateValueAndValidity();
    }
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  fetchUsers() {
    const requestBody = {
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
      sortColumn: this.sortColumn,
      sortDirection: this.sortDirection,
      filters: { ...this.filters },
    };

    this.loading = true;

    this._userService.getUsers(requestBody).subscribe({
      next: (response) => {
        this.users = response.data.items;
        this.totalCount = response.data.totalCount;
        this.totalPages = Math.ceil(this.totalCount / this.pageSize);
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load users';
        this.loading = false;
      },
    });
  }

  fetchUserRoles() {
    this._userService.getAllUserRoles().subscribe({
      next: (response) => {
        this.roles = response.data;
      },
      error: (err) => {
        console.error('Error fetching user roles:', err);
      },
    });
  }

  fetchDepartments() {
    this._departmentService.getAllDepartments().subscribe({
      next: (response) => {
        this.departments = response.data;
      },
      error: (err) => {
        console.error('Error fetching departments:', err);
      },
    });
  }

  deleteUser(userId: number) {
    if (confirm('Are you sure you want to delete this user?')) {
      this._userService.deleteUser(userId).subscribe({
        next: () => {
          this.users = this.users.filter((u) => u.id !== userId);
          this._toast.showSuccess('User deleted successfully');
        },
        error: () => {
          this._toast.showError('Failed to delete user');
        },
      });
    }
  }

  submitUserForm() {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const formValue = this.userForm.getRawValue();

    if (!formValue.id || formValue.id === 0) {
      delete formValue.id;
    }

    this._userService.upsertUser(formValue).subscribe({
      next: () => {
        this._toast.showSuccess(
          formValue.id ? 'User updated successfully' : 'User added successfully'
        );
        this.closeModal();
        this.fetchUsers();
      },
      error: () => {
        this._toast.showError('Failed to save user');
      },
    });
  }

  onFilterChange() {
    this.pageNumber = 1;
    this.fetchUsers();
  }

  onSortChange() {
    this.pageNumber = 1;
    this.fetchUsers();
  }

  nextPage() {
    if (this.pageNumber < this.totalPages) {
      this.pageNumber++;
      this.fetchUsers();
    }
  }

  prevPage() {
    if (this.pageNumber > 1) {
      this.pageNumber--;
      this.fetchUsers();
    }
  }
}
