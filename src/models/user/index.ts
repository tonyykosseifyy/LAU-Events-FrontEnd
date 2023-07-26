export interface User {
  id: string;
  email: string;
  accessToken: string;
  refreshToken: string;
}

export type Uid = string | number;
