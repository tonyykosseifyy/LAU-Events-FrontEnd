import CrudApi from '..';
import { EventRequest, Event } from '../../../../models/event';
import { UserEvent, UserEventRequest } from '../../../../models/userEvents';
import { ApiParam, CoreApi } from '../../client';

export class UserEventApi extends CrudApi<UserEvent, UserEventRequest> {
  path = '/userEvents';
  constructor(param?: ApiParam) {
    super(param);
  }
}
