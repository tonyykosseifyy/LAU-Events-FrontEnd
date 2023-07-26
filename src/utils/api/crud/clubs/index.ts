import CrudApi from '..';
import { Club, ClubRequest } from '../../../../models/club';
import { ApiParam } from '../../client';

export class ClubApi extends CrudApi<Club, ClubRequest> {
  path = '/clubs';
  constructor(param?: ApiParam) {
    super(param);
  }
}
