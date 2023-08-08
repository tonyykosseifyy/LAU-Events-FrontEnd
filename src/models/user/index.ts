export interface User {
  id: string;
  email: string;
  accessToken?: string;
  refreshToken?: string;
  role?: UserRole;
  major: string;
  createdAt: string;
}

export type Uid = string | number;

export enum UserRole {
  ADMIN = 'Admin',
  USER = 'User',
}
