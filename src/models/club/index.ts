import { Event } from '../event';
export interface Club {
  id: string;
  clubName: string;
  createdAt: string;
  updatedAt: string;
  events?: Event[];
}

export interface ClubRequest {
  clubName: string;
}
