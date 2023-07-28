import { AxiosRequestConfig } from 'axios';
import { ApiFilter, ApiParam, CoreApi } from '../client';
import { Uid } from '../../../models/user';
import { DashboardData } from '../../../models/dashboard';

export default class DashboardApi extends CoreApi {
  path = '/dashboard';
  constructor(param?: ApiParam) {
    super(param);
  }

  async getDashboardData(): Promise<DashboardData> {
    return (await this.client.get<DashboardData>(`${this.path}`)).data;
  }
}
