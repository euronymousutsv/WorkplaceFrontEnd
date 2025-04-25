// src/api/payrollApi.ts

import { ApiError, ApiResponse } from "../utils/apiResponse";
import { getToken } from "../auth/token";
import axios, { AxiosError } from "axios";

// API setup
const baseUrl = process.env.BASE_URL || "https://workplace-zdzja.ondigitalocean.app";
const API = axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

// Types
export interface ApprovedHours {
  id: string;
  payrollId?: string;
  employeeId: string;
  officeId: string;
  date: string;
  startTime: string;
  endTime: string;
  totalHours: number;
}

export interface Payroll {
  id: string;
  employeeId: string;
  basicSalary: number;
  bonus?: number;
  deductions: number;
  netPay: number;
  payPeriodStart: string;
  payPeriodEnd: string;
  ApprovedHours?: ApprovedHours[];
}

// Error handling
const handleError = (error: unknown) => {
  if (error instanceof AxiosError) {
    const err = error.response?.data as ApiError<unknown>;
    return new ApiError(err.statusCode, {}, err.message);
  }
  return new ApiError(400, {}, "Something went wrong");
};

// 1. Approve hours for a specific TimeLog
export const approveHours = async (timeLogId: string): Promise<ApiResponse<ApprovedHours> | ApiError<unknown>> => {
  try {
    const token = await getToken("accessToken");
    const res = await API.post("/api/v1/payroll/approve-hours", { timeLogId }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    return handleError(err);
  }
};

// 2. Fetch approved hours by date range for an office
export const fetchApprovedHoursByOffice = async (
  startDate: string,
  endDate: string,
  officeId: string
): Promise<ApiResponse<ApprovedHours[]> | ApiError<unknown>> => {
  try {
    const token = await getToken("accessToken");
    const res = await API.get("/api/v1/payroll/fetch-approve-hours-within-date-range", {
      headers: { Authorization: `Bearer ${token}` },
      params: { startDate, endDate, officeId },
    });
    return res.data;
  } catch (err) {
    return handleError(err);
  }
};

// 3. Fetch approved hours for logged-in employee by date range
export const fetchApprovedHoursForEmployee = async (
    startDate: string,
    endDate: string,
    officeId: string
  ): Promise<ApiResponse<ApprovedHours[]> | ApiError<unknown>> => {
    try {
      const token = await getToken("accessToken");
      const res = await API.get("/api/v1/payroll/fetch-approved-hours-for-employee-in-date-range", {
        headers: { Authorization: `Bearer ${token}` },
        params: { startDate, endDate, officeId },
      });
      return res.data;
    } catch (err) {
      return handleError(err);
    }
  };
  

// 4. Send approved hours to payroll (for admins)
export const sendApprovedHoursToPayroll = async (
  startDate: string,
  endDate: string,
  officeId: string
): Promise<ApiResponse<null> | ApiError<unknown>> => {
  try {
    const token = await getToken("accessToken");
    const res = await API.post("/api/v1/payroll/send-approved-hours", {}, {
      headers: { Authorization: `Bearer ${token}` },
      params: { startDate, endDate, officeId },
    });
    return res.data;
  } catch (err) {
    return handleError(err);
  }
};

// 5. Fetch payrolls for logged-in employee
export const fetchPayrollsForEmployee = async (): Promise<ApiResponse<Payroll[]> | ApiError<unknown>> => {
  try {
    const token = await getToken("accessToken");
    const res = await API.get("/api/v1/payroll/fetchAllPayrollForLoggedInEmployee", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    return handleError(err);
  }
};
