import { User } from '../user';

export interface Event {
  id: string;
  eventName: string;
  eventDescription: string;
  startTime: Date;
  endTime: Date;
  clubId: string;
  studentsAccepted: User[];
  status: EventStatus;
}

export interface EventRequest {
  eventName: string;
  eventDescription: string;
  startTime: Date;
  endTime: Date;
  clubId: string;
  studentsAccepted: User[];
  status: EventStatus;
}

export enum EventStatus {
  Active = 'Active',
  Cancelled = 'Cancelled',
}
