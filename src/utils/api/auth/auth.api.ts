import { ApiParam, CoreApi } from '../client';

export class AuthApi extends CoreApi {
  path = '/auth';
  constructor(param?: ApiParam) {
    super(param);
  }

  async signup(email: string, password: string, major: string): Promise<SignUpResposne> {
    const res = await this.client.post(`${this.path}/signup`, {
      email,
      password,
      major,
    });
    return res.data;
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    const res = await this.client.post(`${this.path}/signin`, {
      email,
      password,
    });
    return res.data;
  }

  async refresh(refreshToken: string): Promise<RefreshTokenResponse> {
    const res = await this.client.post(`${this.path}/refreshToken`, {
      refreshToken,
    });
    return res.data;
  }

  async verify(code: string, userId: string): Promise<LoginResponse> {
    return (await this.client.post<LoginResponse>(`${this.path}/verify`, { code, userId })).data;
  }
}

export interface LoginResponse {
  refreshToken: string;
  accessToken: string;
  email: string;
  id: string;
  major: string;
  createdAt: string;
}

export interface SignUpResposne {
  message: string;
  userId: number;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}
