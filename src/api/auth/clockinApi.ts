// src/api/auth/clockinApi.ts

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

export type ClockInPayload = {
  employeeId: string;
  shiftId?: string;
  latitude?: string;
  longitude?: string;
};

export type ClockStatus = "in" | "out" | "break-start" | "break-end";

export type ClockInOutResponse = {
  message: string;
  clockInEvent?: any;
  clockOutEvent?: any;
  breakStartEvent?: any;
  breakEndEvent?: any;
};

export const clockIn = async (payload: ClockInPayload): Promise<ClockInOutResponse | string> => {
  try {
    const token = await getToken("accessToken");
    const response = await API.post("/api/clock/clockIn", payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    return handleClockError(error);
  }
};

export const clockOut = async (payload: ClockInPayload): Promise<ClockInOutResponse | string> => {
  try {
    const token = await getToken("accessToken");
    const response = await API.put("/api/clock/clockOut", payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    return handleClockError(error);
  }
};

export const startBreak = async (payload: ClockInPayload): Promise<ClockInOutResponse | string> => {
  try {
    const token = await getToken("accessToken");
    const response = await API.post("/api/clock/startBreak", payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    return handleClockError(error);
  }
};

export const endBreak = async (payload: ClockInPayload): Promise<ClockInOutResponse | string> => {
  try {
    const token = await getToken("accessToken");
    const response = await API.post("/api/clock/endBreak", payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    return handleClockError(error);
  }
};

const handleClockError = (error: unknown): string => {
  if (error instanceof AxiosError && error.response) {
    return error.response.data?.error || "Unexpected error occurred.";
  }
  return "Server error or network issue.";
};
