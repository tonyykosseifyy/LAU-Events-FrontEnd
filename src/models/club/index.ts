import { Event } from '../event';
export interface Club {
  id: string;
  clubName: string;
  createdAt: string;
  updatedAt: string;
  status: ClubStatus;
  events?: Event[];
}

export interface ClubRequest {
  clubName: string;
  status: ClubStatus;
}

export enum ClubStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}
