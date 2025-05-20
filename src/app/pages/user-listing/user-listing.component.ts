import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastService } from '../../services/toast.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-listing',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './user-listing.component.html',
  styleUrl: './user-listing.component.scss',
})
export class UserListingComponent {
  users: any[] = [];
  loading = false;
  error = '';
  isAdmin = false;
  showModal = false;
  userForm: FormGroup;
  selectedUser: any = null;
  filters = { userName: '', email: '' };
  sortColumn = 'UserName';
  sortDirection = 'ASC';
  pageNumber = 1;
  pageSize = 5;
  totalPages = 1;
  totalCount = 0;

  passwordVisible = false;

  constructor(
    private _userService: UserService,
    private _toast: ToastService,
    private _fb: FormBuilder
  ) {
    this.userForm = this._fb.group({
      id: [0],
      userName: ['', Validators.required],
      passwordHash: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
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
