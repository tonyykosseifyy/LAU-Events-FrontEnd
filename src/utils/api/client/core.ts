import { AxiosInstance } from 'axios';
import { createClient } from './client';
import { Session } from '../../../../types/auth';

export type ApiParam = Session | null;
export interface ApiFilter {
  _limit?: number;
  _sort?: string;
  _start?: number;
  [key: string]: any;
}

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
