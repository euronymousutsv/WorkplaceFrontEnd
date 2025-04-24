import axios from "axios";
import { ApiError, ApiResponse } from "../utils/apiResponse";
import { getToken } from "../auth/token";
import { CreateALeaveRequestPayload, Leave } from "./leaveRequest";

const baseUrl =
  process.env.BASE_URL || "https://workplace-zdzja.ondigitalocean.app";
const API = axios.create({
  baseURL: baseUrl + "/api/v1/leave/",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// helper function to handle errors
export const handleErrorRes = (error: any) => {
  if (axios.isAxiosError(error)) {
    const statusCode = error.response?.status ?? 500;
    const message =
      error.response?.data?.message || "An unexpected error occurred";
    return new ApiError(statusCode, {}, message);
  } else {
    return new ApiError(400, {}, "Something went wrong");
  }
};

// create a leave request
export const createALeaveRequest = async (
  reqData: CreateALeaveRequestPayload
): Promise<Leave | ApiError<{}>> => {
  try {
    const accessToken = (await getToken("accessToken")) ?? "";
    const response = await API.post<ApiResponse<Leave>>(
      "createALeaveRequest",
      reqData,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    return response.data.data;
  } catch (error) {
    return handleErrorRes(error);
  }
};

// delete a leave request
export const deleteLeaveRequest = async (id: string) => {
  try {
    const accessToken = (await getToken("accessToken")) ?? "";
    const response = await API.delete<ApiResponse<object>>(`delete`, {
      params: { id },
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return response.data;
  } catch (error) {
    return handleErrorRes(error);
  }
};

// update leave request details
export const updateLeaveRequestDetails = async (reqData: Leave) => {
  try {
    const accessToken = (await getToken("accessToken")) ?? "";
    const response = await API.post<ApiResponse<Leave>>(
      "updateLeaveRequestDetails",
      reqData,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    return response.data;
  } catch (error) {
    return handleErrorRes(error);
  }
};

// Fetch all leave requests in an office
export const fetchAllLeaveRequestInAnOffice = async (reqData: {
  officeId: string;
}) => {
  try {
    const accessToken = (await getToken("accessToken")) ?? "";
    const response = await API.get<ApiResponse<Leave[]>>(
      "fetchAllLeaveRequestInAnOffice",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: {
          officeId: reqData.officeId,
        },
      }
    );
    return response.data;
  } catch (error) {
    return handleErrorRes(error);
  }
};

// Fetch leave requests for the logged-in employee
export const fetchLeaveRequestForLoggedInEmployee = async (): Promise<
  Leave[] | ApiError<{}>
> => {
  try {
    const accessToken = (await getToken("accessToken")) ?? "";
    const response = await API.get<ApiResponse<Leave[]>>(
      "fetchLeaveRequestForLoggedInEmployee",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    return response.data.data;
  } catch (error) {
    return handleErrorRes(error);
  }
};
