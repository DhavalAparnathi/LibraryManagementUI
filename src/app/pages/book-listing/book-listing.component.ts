import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BookService, ToastService } from '../../services';

@Component({
  selector: 'app-book-listing',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatSnackBarModule, FormsModule],
  templateUrl: './book-listing.component.html',
  styleUrl: './book-listing.component.scss',
})
export class BookListingComponent implements OnInit {
  books: any[] = [];
  genres: any[] = [];
  loading = false;
  error = '';
  isAdmin = false;
  showModal = false;
  bookForm: FormGroup;
  selectedBook: any = null;

  filters = { name: '', author: '', genreId: 0 };
  sortColumn = 'Name';
  sortDirection = 'ASC';
  pageNumber = 1;
  pageSize = 10;
  totalPages = 1;
  totalCount = 0;

  constructor(
    private _bookService: BookService,
    private _toast: ToastService,
    private _fb: FormBuilder
  ) {
    this.bookForm = this._fb.group(
      {
        id: [0],
        name: ['', Validators.required],
        author: ['', Validators.required],
        genreId: ['', Validators.required],
        totalCopies: [1, [Validators.required, Validators.min(1)]],
        availableCopies: [0, [Validators.required, Validators.min(0)]],
      },
      { validators: this.validateAvailableCopies() }
    );
  }

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      this.isAdmin = decoded?.role === 'Admin';
    }
    this.fetchBooks();
    this.fetchBookGenres();
  }

  openModal(book?: any) {
    this.selectedBook = book ? { ...book } : null;

    if (this.selectedBook) {
      this.bookForm.patchValue(this.selectedBook);
    } else {
      this.bookForm.reset({
        id: 0,
        name: '',
        author: '',
        genreId: '',
        totalCopies: 0,
        availableCopies: 0,
      });
    }

    this.bookForm.setValidators(this.validateAvailableCopies());
    this.bookForm.updateValueAndValidity();
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedBook = null;
  }

  fetchBooks() {
    const requestBody = {
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
      sortColumn: this.sortColumn,
      sortDirection: this.sortDirection,
      filters: { ...this.filters },
    };

    this.loading = true;

    this._bookService.getBooks(requestBody).subscribe({
      next: (response) => {
        this.books = response.data.items;
        this.totalCount = response.data.totalCount;
        this.totalPages = Math.ceil(this.totalCount / this.pageSize);
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load books';
        this.loading = false;
      },
    });
  }

  fetchBookGenres() {
    this._bookService.getBookGenres().subscribe({
      next: (response) => {
        this.genres = response.data;
      },
      error: (err) => {
        console.error('Error fetching genres:', err);
      },
    });
  }

  deleteBook(bookId: number) {
    if (confirm('Are you sure you want to delete this book?')) {
      this._bookService.deleteBook(bookId).subscribe({
        next: () => {
          this.books = this.books.filter((u) => u.id !== bookId);
          this._toast.showSuccess('Book deleted successfully');
        },
        error: (error) => {
          if (
            error?.error?.message ===
            'Cannot delete the book because it is currently issued to a user.'
          ) {
            this._toast.showError(
              'This book cannot be deleted because it is currently issued.'
            );
          } else {
            this._toast.showError('Failed to delete book.');
          }
        },
      });
    }
  }

  issueBook(bookId: number) {
    const token = localStorage.getItem('token');
    if (!token) return;

    const decoded = JSON.parse(atob(token.split('.')[1]));
    const userId = decoded?.nameid;

    const payload = { bookId, userId };
    if (confirm('Are you sure you want to issue this book?')) {
      this._bookService.issueBook(payload).subscribe({
        next: () => {
          this._toast.showSuccess('Book issued successfully');
          this.fetchBooks();
        },
        error: () => {
          this._toast.showError('Failed to issue book');
        },
      });
    }
  }

  returnBook(issueId: number) {
    if (confirm('Are you sure you want to return this book?')) {
      this._bookService.returnBook({ issueId }).subscribe({
        next: () => {
          this._toast.showSuccess('Book returned successfully');
          this.fetchBooks();
        },
        error: () => {
          this._toast.showError('Failed to return book');
        },
      });
    }
  }

  submitBookForm() {
    if (this.bookForm.invalid) {
      this.bookForm.markAllAsTouched();
      return;
    }

    const formValue = this.bookForm.getRawValue();

    formValue.genreId = Number(formValue.genreId);

    if (!formValue.id || formValue.id === 0) {
      formValue.availableCopies = formValue.totalCopies;
      delete formValue.id;
    }

    this._bookService.upsertBook(formValue).subscribe({
      next: () => {
        this._toast.showSuccess(
          formValue.id ? 'Book updated successfully' : 'Book added successfully'
        );
        this.closeModal();
        this.fetchBooks();
      },
      error: () => {
        this._toast.showError('Failed to save book');
      },
    });
  }

  validateAvailableCopies(): ValidatorFn {
    return (form: AbstractControl): ValidationErrors | null => {
      const total = form.get('totalCopies')?.value ?? 0;
      const available = form.get('availableCopies')?.value ?? 0;
      const issuedUserCount = this.selectedBook?.issuedUserCount ?? 0;

      const errors: ValidationErrors = {};

      if (total < issuedUserCount) {
        errors['totalLessThanIssued'] = true;
      }

      if (available > total) {
        errors['availableExceedsTotal'] = true;
      }

      const expectedAvailable = total - issuedUserCount;
      if (available !== expectedAvailable) {
        errors['invalidAvailableCount'] = {
          expected: expectedAvailable,
          actual: available,
        };
      }

      return Object.keys(errors).length ? errors : null;
    };
  }

  onFilterChange() {
    this.pageNumber = 1;
    this.fetchBooks();
  }

  onSortChange() {
    this.pageNumber = 1;
    this.fetchBooks();
  }

  nextPage() {
    if (this.pageNumber < this.totalPages) {
      this.pageNumber++;
      this.fetchBooks();
    }
  }

  prevPage() {
    if (this.pageNumber > 1) {
      this.pageNumber--;
      this.fetchBooks();
    }
  }
}
