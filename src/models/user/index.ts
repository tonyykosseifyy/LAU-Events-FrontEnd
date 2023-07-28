export interface User {
  id: string;
  email: string;
  accessToken: string;
  refreshToken: string;
  role: UserRole;
}

export type Uid = string | number;

export enum UserRole {
  ADMIN = 'Admin',
  USER = 'User',
}
