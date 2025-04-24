import { ApiError, ApiResponse } from "../utils/apiResponse";
import { getToken } from "./token";
import axios, { AxiosError } from "axios";

const baseUrl =
  process.env.BASE_URL || "https://workplace-zdzja.ondigitalocean.app";
const API = axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

// Enums
export enum ClockStatus {
    ON_TIME = "on_time",
    LATE = "late",
    EARLY = "early",
    NO_SHIFT = "no_shift",
  }
  
  // Payloads
  export interface ClockInPayload {
    clockInTime: Date;
    long: number;
    lat: number;
  }
  
  export interface ClockOutPayload {
    timeLogId: string;
    clockOutTime: Date;
    long: number;
    lat: number;
  }
  
  export interface BreakPayload {
    timeLogId: string;
    breakStartTime?: Date;
    breakEndTime?: Date;
  }
  
  export interface TimeLogUpdatePayload {
    timeLogId: string;
    clockIn?: Date;
    clockOut?: Date;
    breakStart?: Date;
    breakEnd?: Date;
    hasShift?: boolean;
    clockInStatus?: ClockStatus;
    clockOutStatus?: ClockStatus;
    clockInDiffInMin?: number;
    clockOutDiffInMin?: number;
  }
  
  export interface TimeLog {
    id: string;
    employeeId: string;
    clockIn: Date;
    clockOut?: Date;
    breakStart?: Date;
    breakEnd?: Date;
    hasShift?: boolean;
    clockInStatus?: ClockStatus;
    clockOutStatus?: ClockStatus;
    clockInDiffInMin?: number;
    clockOutDiffInMin?: number;
    officeId?: string;
  }

  const handleError = (error: unknown) => {
    if (error instanceof AxiosError) {
      const err = error.response?.data as ApiError<unknown>;
      return new ApiError(err.statusCode, {}, err.message);
    }
    return new ApiError(400, {}, "Something went wrong");
  };
  

// 1. Clock In
export const clockIn = async (payload: ClockInPayload): Promise<ApiResponse<TimeLog> | ApiError<unknown>> => {
    try {
      const token = await getToken("accessToken");
      const res = await API.post("/api/v1/timeLog/clock-in", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return handleError(err);
    }
  };
  
  // 2. Clock Out
  export const clockOut = async (payload: ClockOutPayload): Promise<ApiResponse<TimeLog> | ApiError<unknown>> => {
    try {
      const token = await getToken("accessToken");
      const res = await API.post("/api/v1/timeLog/clock-out", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return handleError(err);
    }
  };
  
  // 3. Start Break
  export const startBreak = async (payload: { timeLogId: string; breakStartTime: Date }) => {
    try {
      const token = await getToken("accessToken");
      const res = await API.post("/api/v1/timeLog/start-break", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return handleError(err);
    }
  };
  
  // 4. End Break
  export const endBreak = async (payload: { timeLogId: string; breakEndTime: Date }) => {
    try {
      const token = await getToken("accessToken");
      const res = await API.post("/api/v1/timeLog/end-break", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return handleError(err);
    }
  };
  
  // 5. Update Time Log (admin use)
  export const updateTimeLog = async (payload: TimeLogUpdatePayload) => {
    try {
      const token = await getToken("accessToken");
      const res = await API.patch("/api/v1/timeLog/update", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return handleError(err);
    }
  };
  
  // 6. Get Time Logs for Office by Date Range
  export const getTimeLogByDateRange = async (
    startDate: string,
    endDate: string,
    officeId: string
  ) => {
    try {
      const token = await getToken("accessToken");
  
      const res = await API.post(
        "/api/v1/timeLog/date-range",
        {
          startDate,
          endDate,
          officeId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      return res.data;
    } catch (err) {
      return handleError(err);
    }
  };
  
  
  // 7. Get Time Logs for Employee by Date Range
  export const getTimeLogByDateRangeForEmployee = async (startDate: string, endDate: string, employeeId: string) => {
    try {
      const token = await getToken("accessToken");
      const res = await API.get("/api/v1/timeLog/date-range-logged-in-user", {
        headers: { Authorization: `Bearer ${token}` },
        params: { startDate, endDate, employeeId },
      });
      return res.data;
    } catch (err) {
      return handleError(err);
    }
  };
  
  // 8. Get Today’s Time Log (for logged-in employee)
  export const getTodaysTimeLog = async () => {
    try {
      const token = await getToken("accessToken");
      const res = await API.get("/api/v1/timeLog/today", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return handleError(err);
    }
  };