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
  USER_GET_ALL_ROLES: 'users/get-all-roles',
  // GET_USERS_BY_ROLE: 'users/get-users-by-role',

  DEPARTMENTS: 'departments',
  DEPARTMENTS_LIST: 'departments/list',
  DEPARTMENTS_GET_ALL: 'departments/get-all',
  UPSERT_DEPARTMENT: 'departments/upsert',

  SUBJECTS: 'subjects',
  SUBJECT_LIST: 'subjects/list',
  SUBJECT_GET_ALL: 'subjects/get-all',
  TIMETABLE: 'timetable',
  UPSERT_SUBJECT: 'subjects/upsert',
};
