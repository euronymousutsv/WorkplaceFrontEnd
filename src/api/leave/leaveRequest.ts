import { Employee } from "../server/server";
import { LeaveTypeAttributes } from "./leaveResponse";

export interface Leave {
  id?: string;
  officeId?: string;
  employeeId?: string;
  startDate?: string;
  endDate?: string;
  reason?: string;
  leaveType?: LeaveTypeAttributes;
  isApproved?: boolean | null;
  Employee?: Employee | null;
}

export interface CreateALeaveRequestPayload {
  startDate: string;
  endDate: string;
  reason: string;
  leaveType: LeaveTypeAttributes;
}
