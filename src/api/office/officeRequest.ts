export interface CreateOfficeRequest {
  serverId: string;
  lat: string;
  long: string;
  radius: number;
  name: string;
  address: string;
}

export interface JoinOfficeRequest {
  officeId: string;
  employeeId: string;
}

export interface UpdateOfficeRequest {
  officeId: string;
  newValue: string;
  editField: string;
}
