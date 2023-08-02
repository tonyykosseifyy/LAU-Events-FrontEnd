import { ApiParam, CoreApi } from '../client';

export class AuthApi extends CoreApi {
  path = '/auth';
  constructor(param?: ApiParam) {
    super(param);
  }

  async login(email: string, password: string): Promise<LoginOrSignupResponse> {
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
}

export interface SignUpResposne {
  message: string;
  userId: number;
}

// on signin, either return SignIn or the SignupResponse for verification
export type LoginOrSignupResponse = LoginResponse | SignUpResposne;

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}
