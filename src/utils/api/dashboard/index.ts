import { DashboardData, DataStat } from '../../../models/dashboard';
import { ApiParam, CoreApi } from '../client';

export default class DashboardApi extends CoreApi {
  path = '/dashboard';
  constructor(param?: ApiParam) {
    super(param);
  }

  async getDashboardData(): Promise<DashboardData> {
    return (await this.client.get<DashboardData>(`${this.path}`)).data;
  }

  async getAllData(): Promise<DataStat[]> {
    return (await this.client.get<DataStat[]>(`${this.path}/all`)).data;
  }
}
