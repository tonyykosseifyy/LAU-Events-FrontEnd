import { Event } from '../event';
export interface Club {
  id: string;
  clubName: string;
  createdAt: string;
  updatedAt: string;
  status: ClubStatus;
  events?: Event[];
  imagePath?: string;
}

export interface ClubRequest {
  clubName: string;
  status: ClubStatus;
  imagePath?: string;
}

export enum ClubStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}
