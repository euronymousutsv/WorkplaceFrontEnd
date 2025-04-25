import axios from "axios";
import { ApiError, ApiResponse } from "../utils/apiResponse";
import { getToken } from "../auth/token";
import { handleErrorRes } from "../leave/leaveApi";

const baseUrl =
  process.env.BASE_URL || "https://workplace-zdzja.ondigitalocean.app";
const API = axios.create({
  baseURL: baseUrl + "/api/v1/payroll/",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export interface ApprovedHours {
  id: string;
  employeeId: string;
  payrollId: string;
  officeId: string;
  date: string;
  bonus: number;
  deductions: number;
  startTime: string;
  endTime: string;
  totalHours: number;
  createdAt: string;
  updatedAt: string;
}

export interface Payroll {
  id: string;
  employeeId: string;
  basicSalary: number;
  bonus: number;
  deductions: number;
  netPay: number;
  payPeriodStart: string;
  payPeriodEnd: string;
  createdAt: string;
  updatedAt: string;
  ApprovedHours?: ApprovedHours[];
}

export const getPayrollForLoggedInUser = async (): Promise<
  Payroll[] | ApiError<{}>
> => {
  try {
    const accessToken = (await getToken("accessToken")) ?? "";
    const response = await API.get<ApiResponse<Payroll[]>>(
      "fetchAllPayrollForLoggedInEmployee",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    return response.data.data;
  } catch (error) {
    return handleErrorRes(error);
  }
};
