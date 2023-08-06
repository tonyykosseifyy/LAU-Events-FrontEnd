import { Club } from '../club';
import { User } from '../user';

export interface Event {
  id: string;
  eventName: string;
  eventDescription: string;
  startTime: Date;
  endTime: Date;
  clubId?: string;
  Clubs?: Club[];
  Users?: User[];
  status: EventStatus;
  createdAt: string;
  updatedAt: string;
  declinedUsers?: number;
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
