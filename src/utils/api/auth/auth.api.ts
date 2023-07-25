import { ApiParam, CoreApi } from '../client';

export class AuthApi extends CoreApi {
  path = '/auth';
  constructor(param?: ApiParam) {
    super(param);
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
}

export interface LoginResponse {
  refreshToken: string;
  accessToken: string;
  email: string;
  id: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}
