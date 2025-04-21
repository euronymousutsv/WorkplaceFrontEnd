// Cleaned and Typed Shift API
import axios, { AxiosError } from "axios";
import { ApiError, ApiResponse } from "../utils/apiResponse";
import { getToken, Plat } from "./token";

const baseUrl = process.env.BASE_URL || "https://workplace-zdzja.ondigitalocean.app";

export const API = axios.create({
  baseURL: baseUrl,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

export class OfficeLocation {
  constructor(
    public id: string,
    public name: string,
    public latitude: string,
    public longitude: string,
    public radius: number
  ) {}

  getCoordinates(): string {
    return `Latitude: ${this.latitude}, Longitude: ${this.longitude}`;
  }
}

export class Shifts {
  constructor(
    public id: string,
    public employeeId: string,
    public employeeName: string,
    public officeId: string,
    public startTime: string,
    public endTime: string,
    public notes: string,
    public officeLocation: OfficeLocation
  ) {}
}

export type ShiftPayload = {
  employeeId: string;
  officeId: string;
  startTime: string;
  endTime: string;
  status?: string;
  notes?: string;
  repeatFrequency?: string;
  repeatEndDate?: string;
};

const handleError = (error: unknown) => {
  if (error instanceof AxiosError) {
    const err = error.response?.data as ApiError<unknown>;
    return new ApiError(err.statusCode, {}, err.message);
  }
  return new ApiError(400, {}, "Something went wrong");
};

//   try {
//     const accessToken = (await getToken("accessToken")) ?? "";
//     const response = await API.get("api/roster/getShiftsForLoggedInUser", {
//       params: { accessToken },
//     });
//     return response.data as ApiResponse<Shifts[]>;
//   } catch (error) {
//     return handleError(error);
//   }
// };

export const getShiftsForAllUsers = async (): Promise<ApiResponse<Shifts[]> | ApiError<unknown>> => {
  try {
    const accessToken = (await getToken("accessToken")) ?? "";
    const response = await API.get("api/roster/", {
      params: { accessToken },
    });
    return response.data as ApiResponse<Shifts[]>;
  } catch (error) {
    return handleError(error);
  }
};

export const createShift = async (payload: ShiftPayload): Promise<ApiResponse<Shifts> | ApiError<unknown>> => {
  try {
    const accessToken = (await getToken("accessToken")) ?? "";
    const response = await API.post("api/schedule/create", payload, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return response.data as ApiResponse<Shifts>;
  } catch (error) {
    return handleError(error);
  }
};

export const getShiftsByOffice = async (
  officeId: string
): Promise<ApiResponse<Shifts[]> | ApiError<unknown>> => {
  try {
    const accessToken = (await getToken("accessToken")) ?? "";

    const response = await API.get("api/schedule/getShiftsByOffice", {
      headers: { Authorization: `Bearer ${accessToken}` },
      params: { officeId }, 
    });

    return response.data as ApiResponse<Shifts[]>;
  } catch (error) {
    return handleError(error);
  }
};


export const getShiftsByEmployee = async (employeeId: string): Promise<ApiResponse<Shifts[]> | ApiError<unknown>> => {
  try {
    const accessToken = (await getToken("accessToken")) ?? "";
    
    const response = await API.get("api/schedule/getShiftsByEmployee", {
      params: { employeeId },
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return response.data as ApiResponse<Shifts[]>;
  } catch (error) {
    return handleError(error);
  }
};


export const getEmployeeShiftsByDate = async (employeeId: string, date: string): Promise<ApiResponse<Shifts[]> | ApiError<unknown>> => {
  try {
    const accessToken = (await getToken("accessToken")) ?? "";
    const response = await API.get(`api/shifts/employee/${employeeId}/date`, {
      params: { date },
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return response.data as ApiResponse<Shifts[]>;
  } catch (error) {
    return handleError(error);
  }
};

export const getShiftsByDateRangeForOffice = async (
  officeId: string,
  start: string,
  end: string
): Promise<ApiResponse<Shifts[]> | ApiError<unknown>> => {
  try {
    const accessToken = (await getToken("accessToken")) ?? "";
    const response = await API.get(`api/shifts/range`, {
      params: { officeId, start, end },
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return response.data as ApiResponse<Shifts[]>;
  } catch (error) {
    return handleError(error);
  }
};

export const updateShift = async (shiftId: string, payload: Partial<ShiftPayload>): Promise<ApiResponse<Shifts> | ApiError<unknown>> => {
  try {
    const accessToken = (await getToken("accessToken")) ?? "";
    const response = await API.put(`api/schedule/updateShift?shiftId=${shiftId}`, payload, {

      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return response.data as ApiResponse<Shifts>;
  } catch (error) {
    return handleError(error);
  }
};

export const getShiftWithDetails = async (id: string): Promise<ApiResponse<Shifts> | ApiError<unknown>> => {
  try {
    const accessToken = (await getToken("accessToken")) ?? "";
    const response = await API.get(`api/shifts/details/${id}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return response.data as ApiResponse<Shifts>;
  } catch (error) {
    return handleError(error);
  }
};

export const getAllShiftsWithDetailsWithinAnOffice = async (officeId: string): Promise<ApiResponse<Shifts[]> | ApiError<unknown>> => {
  try {
    const accessToken = (await getToken("accessToken")) ?? "";
    const response = await API.get(`api/shifts/office/${officeId}/details`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return response.data as ApiResponse<Shifts[]>;
  } catch (error) {
    return handleError(error);
  }
};

export const deleteShift = async (shiftId: string): Promise<ApiResponse<Shifts> | ApiError<unknown>> => {
  try {
    const accessToken = (await getToken("accessToken")) ?? "";
    const response = await API.delete(`api/roster/deleteShift/${shiftId}`, {
      params: { accessToken },
    });
    return response.data as ApiResponse<Shifts>;
  } catch (error) {
    return handleError(error);
  }
};
