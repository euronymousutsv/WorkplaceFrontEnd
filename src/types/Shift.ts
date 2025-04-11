export interface Shift {
    id: string;
    location: string;
    description: string;
    startTime: Date;
    endTime: Date;
    employees?: string[];
  }
  