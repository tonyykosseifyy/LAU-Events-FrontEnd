import { AxiosInstance } from 'axios';
import { createClient } from './client';
import { Session } from '../../../../types/auth';

export type ApiParam = Session | null;

export class CoreApi {
  client: AxiosInstance;

  constructor(param?: ApiParam) {
    if (param) {
      this.client = createClient(<Session>param);
    } else {
      this.client = createClient();
    }
  }
}
