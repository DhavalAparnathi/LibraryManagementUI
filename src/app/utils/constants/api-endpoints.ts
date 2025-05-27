export const ApiEndpoints = {
  LOGIN: 'authorize/login',
  RESET: 'authorize/reset-pass',
  // REGISTER: 'authorize/register',

  BOOKS: 'books',
  BOOK_LIST: 'books/list',
  ISSUE_BOOK: 'issue/issue-book',
  RETURN_BOOK: 'issue/return-book',
  UPSERT_BOOK: 'books/upsert',
  BOOK_LIST_GENRES: 'books/get-all-genres',

  USERS: 'users',
  UPSERT_USER: 'users/upsert',
  USER_LIST: 'users/list',

  DEPARTMENTS: 'departments',
  DEPARTMENTS_LIST: 'departments/list',
  UPSERT_DEPARTMENT: 'departments/upsert',

  SUBJECTS: 'subjects',
  // SUBJECT_LIST: 'subjects/list',
  SUBJECT_GET_ALL: 'subjects/get-all',
};
