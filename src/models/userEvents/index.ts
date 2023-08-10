export interface UserEvent {
  id: string;
}

export interface UserEventRequest {
  userId: string;
  eventId: string;
  status: UserEventStatus;
}

export enum UserEventStatus {
  Accepted = 'Accepted',
  Declined = 'Declined',
  Ignored = 'Ignored',
}
