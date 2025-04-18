import { RosterAttributes } from "../types/RosterAttributes"; 

export const mockShifts: RosterAttributes[] = [
  {
    id: "shift-1",
    employeeId: "emp-001",
    officeId: "office-001",
    officeLocation: {
      id: "office-001",
      name: "Main Office",
      latitude: "40.7128",
      longitude: "-74.0060",
      radius: 50,
    },
    startTime: new Date("2025-04-13T20:00:00"),
    endTime: new Date("2025-04-13T23:00:00"),
    date: new Date("2025-04-14"),
    description: "Morning shift at reception",
  },
  {
    id: "shift-2",
    employeeId: "emp-002",
    officeId: "office-002",
    startTime: new Date("2025-04-14T13:00:00"),
    endTime: new Date("2025-04-14T17:00:00"),
    date: new Date("2025-04-14"),
    description: "Afternoon support duties",
    officeLocation: {
      id: "",
      name: "",
      latitude: "",
      longitude: "",
      radius: 0
    }
  },
  {
    id: "shift-3",
    employeeId: "emp-003",
    officeId: "office-001",
    startTime: new Date("2025-04-15T09:00:00"),
    endTime: new Date("2025-04-15T17:00:00"),
    date: new Date("2025-04-15"),
    description: "Full-day field visit",
    officeLocation: {
      id: "",
      name: "",
      latitude: "",
      longitude: "",
      radius: 0
    }
  },
  {
    id: "shift-4",
    employeeId: "emp-001",
    officeId: "office-003",
    startTime: new Date("2025-04-16T07:00:00"),
    endTime: new Date("2025-04-16T15:00:00"),
    date: new Date("2025-04-16"),
    description: "Warehouse supervision",
    officeLocation: {
      id: "",
      name: "",
      latitude: "",
      longitude: "",
      radius: 0
    }
  },
  {
    id: "shift-5",
    employeeId: "emp-004",
    officeId: "office-002",
    startTime: new Date("2025-04-17T14:00:00"),
    endTime: new Date("2025-04-17T22:00:00"),
    date: new Date("2025-04-17"),
    description: "Evening coverage",
    officeLocation: {
      id: "office-002",
      name: "Branch Office",
      latitude: "34.0522",
      longitude: "-118.2437",
      radius: 30,
    }
  },
     
  {
    id: "shift-6",
    employeeId: "emp-002",
    officeId: "office-003",
    startTime: new Date("2025-04-18T10:00:00"),
    endTime: new Date("2025-04-18T16:00:00"),
    date: new Date("2025-04-18"),
    description: "Training and documentation",
    officeLocation: {
      id: "office-003",
      name: "Remote Office",
      latitude: "37.7749",
      longitude: "-122.4194",
      radius: 20,
    }
  },
 
  {
    id: "shift-7",
    employeeId: "emp-003",
    officeId: "office-001",
    startTime: new Date("2025-04-19T12:00:00"),
    endTime: new Date("2025-04-19T18:00:00"),
    date: new Date("2025-04-19"),
    description: "Client visit assistance",
    officeLocation: {
      id: "office-001",   
      name: "main office",
      latitude: "40.7128",
      longitude: "-74.0060",
      radius: 50,
    }
  },
  {
    id: "shift-8",
    employeeId: "emp-004",
    officeId: "office-002",
    startTime: new Date("2025-04-20T08:30:00"),
    endTime: new Date("2025-04-20T14:30:00"),
    date: new Date("2025-04-13"),
    description: "Facility maintenance",
    officeLocation: {
      id: "office-002",
      name: "Branch Office",
      latitude: "34.0522",
      longitude: "-118.2437",
      radius: 30,
    }
  },
      
  {
    id: "shift-9",
    employeeId: "emp-001",
    officeId: "office-001",
    startTime: new Date("2025-04-13T09:00:00"),
    endTime: new Date("2025-04-13T20:00:00"),
    date: new Date("2025-04-13"),
    description: "Office admin shift",
    officeLocation: {
      id: "office-001",
      name: "Main Office",
      latitude: "40.7128",
      longitude: "-74.0060",
      radius: 50,
    }
  },
     
  {
    id: "shift-10",
    employeeId: "emp-005",
    officeId: "office-003",
    startTime: new Date("2025-04-22T11:00:00"),
    endTime: new Date("2025-04-22T19:00:00"),
    date: new Date("2025-04-22"),
    description: "Backup shift for leave coverage",
    officeLocation: {
      id: "office-003",
      name: "Remote Office",
      latitude: "37.7749",
      longitude: "-122.4194",
      radius: 20,
    }
  },
      
];
