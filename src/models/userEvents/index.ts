export interface UserEvent {
  id: string;
}

export interface UserEventRequest {
  eventId?: string;
  status: UserEventStatus;
}

export enum UserEventStatus {
  Accepted = 'Accepted',
  Declined = 'Declined',
  Ignored = 'Ignored',
}
