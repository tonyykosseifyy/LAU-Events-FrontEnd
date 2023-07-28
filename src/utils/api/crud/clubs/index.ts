import CrudApi from '..';
import { Club, ClubRequest } from '../../../../models/club';
import { Uid } from '../../../../models/user';
import { ApiParam } from '../../client';

export class ClubApi extends CrudApi<Club, ClubRequest> {
  path = '/clubs';
  constructor(param?: ApiParam) {
    super(param);
  }

  // Override to include events
  async findOne(id: Uid): Promise<Club> {
    return (await this.client.get<Club>(`${this.path}/${id}/events`)).data;
  }
}
