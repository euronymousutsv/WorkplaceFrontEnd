export type ChannelResponse = {
  id: string;
  name: string;
  highestRoleToAccessChannel: string;
};

export interface createChannelResponse {
  serverId: string;
  channelName: string;
}

export interface userJoinedServerResponse {
  serverId: string;
}

export interface SearchServerResponse {
  id: string;
  name: string;
  idVerificationRequired: string;
  ownerId: string;
}

export interface joinAServerResponse {
  id: string;
  name: string;
  idVerificationRequired: boolean;
  inviteLink: string;
}

export const enum Role {
  ADMIN = "admin",
  EMPLOYEE = "employee",
  MANAGER = "manager",
}

export interface ChannelDetailsResponse {
  id: string;
  name: string;
  highestRoleToAccessChannel: Role;
  serverId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface EmployeeDetails {
  id: string;
  serverId: string;
  createdAt: Date;
  updatedAt: Date;
  Employee: Employee;
}

interface EmployeeStatus {
  Active: "Active";
  Inactive: "Inactive";
}

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  employmentStatus: EmployeeStatus;
  profileImage?: string | null;
  role: Role;
}

export interface getAllChannelForCurrentServerResponse
  extends ChannelResponse {}
export interface createChannelResponse extends ChannelResponse {}
