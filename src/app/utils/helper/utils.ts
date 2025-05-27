import { AllRoleType, UserRole } from '../enums/enums';

export const getRoleKey = (value: number): string => {
  switch (value) {
    case UserRole.ADMIN:
      return AllRoleType.ADMIN;
    case UserRole.HOD:
      return AllRoleType.HOD;
    case UserRole.TEACHER:
      return AllRoleType.TEACHER;
    case UserRole.ASSISTANT_TEACHER:
      return AllRoleType.ASSISTANT_TEACHER;
    default:
      return AllRoleType.STUDENT;
  }
};
