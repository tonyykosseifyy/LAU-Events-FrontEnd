import CrudApi from '..';
import { EventRequest, Event } from '../../../../models/event';
import { ApiParam, CoreApi } from '../../client';

export class EventApi extends CrudApi<Event, EventRequest> {
  path = '/events';
  constructor(param?: ApiParam) {
    super(param);
  }
}
