import { User } from '../user';

export interface Event {
  id: string;
  eventName: string;
  eventDescription: string;
  startTime: Date;
  endTime: Date;
  clubId?: string;
  studentsAccepted?: User[];
  status: EventStatus;
  createdAt: string;
  updatedAt: string;
}

export interface EventRequest {
  eventName: string;
  eventDescription: string;
  startTime: Date;
  endTime: Date;
  clubIds: string[];
  status: EventStatus;
}

export enum EventStatus {
  Active = 'Active',
  Cancelled = 'Cancelled',
}
