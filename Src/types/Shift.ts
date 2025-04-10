export interface Shift {
    id: string | number;
    location: string;
    description: string;
    startTime: Date;
    endTime: Date;
    employees?: string[];
  }
  