import { DashboardData, DataStat } from '../../../models/dashboard';
import { ApiParam, CoreApi } from '../client';

export default class ImageApi extends CoreApi {
  path = '/upload';
  constructor(param?: ApiParam) {
    super(param);
  }

  async uploadImage(formData: FormData): Promise<ImageUploadResposne> {
    return (await this.client.post<ImageUploadResposne>(`${this.path}`, formData)).data;
  }

  async test() {
    return await this.client.post(`${this.path}`);
  }
}

export interface ImageUploadResposne {
  imagePath: string;
  message: string;
}
