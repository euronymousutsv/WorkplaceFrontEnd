import axios from "axios";
import {
  AllOfficesResponse,
  EmployeesInOfficeResponse,
} from "./officeResponse";
import {
  CreateOfficeRequest,
  JoinOfficeRequest,
  UpdateOfficeRequest,
} from "./officeRequest";
import { ApiError, ApiResponse } from "../utils/apiResponse";
import { getToken, Plat } from "../auth/token";

const baseUrl =
  process.env.BASE_URL || "https://workplace-zdzja.ondigitalocean.app";
// creating an instance of axios api wth base url
const API = axios.create({
  baseURL: baseUrl + "/api/v1/office/",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// this function takes in a serverId and returns all the offices within that server
export const getAllOffices = async (reqData: { serverId: string }) => {
  try {
    const accessToken = await getToken("accessToken", Plat.WEB);
    console.log(accessToken);

    const response = await API.get<ApiResponse<AllOfficesResponse[]>>(
      "getAllOffices",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          serverId: reqData.serverId,
        },
      }
    );
    console.log(response.data.data);
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const statusCode = error.response?.status ?? 500;
      const message =
        error.response?.data?.message || "An unexpected error occurred";
      return new ApiError(statusCode, {}, message);
    } else {
      return new ApiError(400, {}, "Something went wrong");
    }
  }
};

// this function creates a new office inside a server
// a server id is required to create an office
export const creteOffice = async (reqData: CreateOfficeRequest) => {
  try {
    const response = await API.post<ApiResponse<{}>>("getAllOffices", {
      params: reqData,
    });
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const statusCode = error.response?.status ?? 500;
      const message =
        error.response?.data?.message || "An unexpected error occurred";
      return new ApiError(statusCode, {}, message);
    } else {
      return new ApiError(400, {}, "Something went wrong");
    }
  }
};

// this function will join an employee to an office
// it takes in the office id and the employee id
export const joinEmployeeToOffice = async (reqData: JoinOfficeRequest) => {
  try {
    const response = await API.post<ApiResponse<{}>>("joinOffice", {
      params: reqData,
    });
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const statusCode = error.response?.status ?? 500;
      const message =
        error.response?.data?.message || "An unexpected error occurred";
      return new ApiError(statusCode, {}, message);
    } else {
      return new ApiError(400, {}, "Something went wrong");
    }
  }
};

// this function will update an office detail
// this function will join an employee to an office
// it takes in the office id and the employee id
export const updateOffice = async (reqData: UpdateOfficeRequest) => {
  try {
    const response = await API.patch<ApiResponse<{}>>("updateOfficeDetails", {
      params: reqData,
    });
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const statusCode = error.response?.status ?? 500;
      const message =
        error.response?.data?.message || "An unexpected error occurred";
      return new ApiError(statusCode, {}, message);
    } else {
      return new ApiError(400, {}, "Something went wrong");
    }
  }
};

// this function gets all employees in an office
export const getAllEmployeeInOffice = async (reqData: { officeId: string }) => {
  try {
    const response = await API.get<EmployeesInOfficeResponse[]>(
      "getAllEmployeeInOffice",
      {
        params: {
          serverId: reqData.officeId,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const statusCode = error.response?.status ?? 500;
      const message =
        error.response?.data?.message || "An unexpected error occurred";
      return new ApiError(statusCode, {}, message);
    } else {
      return new ApiError(400, {}, "Something went wrong");
    }
  }
};
