export interface DashboardData {
  eventCount: number;
  clubCount: number;
  acceptanceRate: number;
  declineRate: number;
}

export interface DataStat {
  user: {
    createdAt: string;
    major: string;
  };
  event: {
    eventDescription: string;
    acceptedDate: string | null;
    acceptedTime: string | null;
    declinedDate: string | null;
    declinedTime: string | null;
    rescheduledDate: string | null;
    rescheduledTime: string | null;
  };
}
