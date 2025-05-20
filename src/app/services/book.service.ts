import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiEndpoints } from '../utils/constants/api-endpoints';
import { BookListData } from '../models/types.model';

interface ApiResponse<T> {
  isSuccessfull: boolean;
  statusCode: number;
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  getBooks(requestBody: any): Observable<ApiResponse<BookListData>> {
    return this.http.post<ApiResponse<BookListData>>(
      `${this.baseUrl}/${ApiEndpoints.BOOK_LIST}`,
      requestBody
    );
  }

  deleteBook(bookId: number) {
    return this.http.delete(`${this.baseUrl}/${ApiEndpoints.BOOKS}/${bookId}`);
  }

  issueBook(payload: { bookId: number; userId: number }) {
    return this.http.post(
      `${this.baseUrl}/${ApiEndpoints.ISSUE_BOOK}`,
      payload
    );
  }

  returnBook(payload: { issueId: number }) {
    return this.http.post(
      `${this.baseUrl}/${ApiEndpoints.RETURN_BOOK}`,
      payload
    );
  }

  upsertBook(book: any) {
    return this.http.post(`${this.baseUrl}/${ApiEndpoints.UPSERT_BOOK}`, book);
  }
}
