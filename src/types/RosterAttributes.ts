// src/types/RosterAttributes.ts

export interface RosterAttributes {
  id: string;
  employeeId: string;
  officeId: string;
  officeLocation: {
    id: string;
    name: string;
    latitude: string;
    longitude: string;
    radius: number;
  };
  startTime: Date;
  endTime: Date;
  date: Date;
  description: string;
}
