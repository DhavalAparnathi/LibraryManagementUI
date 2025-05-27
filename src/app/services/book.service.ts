import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments';
import { ApiResponse, PaginatedListData } from '../models';
import { ApiEndpoints } from '../utils';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  getBooks(requestBody: any): Observable<ApiResponse<PaginatedListData>> {
    return this.http.post<ApiResponse<PaginatedListData>>(
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

  getBookGenres(): Observable<ApiResponse<string[]>> {
    return this.http.get<ApiResponse<string[]>>(
      `${this.baseUrl}/${ApiEndpoints.BOOK_LIST_GENRES}`
    );
  }
}
