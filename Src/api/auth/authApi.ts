import axios, { AxiosError } from "axios";
import {
  EditUserDetailRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  SendOTPRequest,
  VerifyOTPRequest,
} from "./auth";

import { ApiResponse, ApiError } from "../utils/apiResponse";
import { getToken } from "./token";

export const API = axios.create({
  baseURL:
    // "https://8c1f-2406-2d40-4d55-6c10-bdc3-9abf-864e-c64f.ngrok-free.app",
    "https://workplace-zdzja.ondigitalocean.app/api/v1/auth/",
  // "http://localhost:3000",

  headers: {
    "Content-Type": "application/json",
  },
});

export const loginUser = async (
  email: string,
  password: string
): Promise<any> => {
  try {
    const response = await API.post<ApiResponse<LoginResponse>>("login", {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      const err = error.response?.data as ApiError<{}>;
      return new ApiError(err.statusCode, {}, err.message);
    } else {
      return new ApiError(400, {}, "Something went wrong");
    }
  }
};

export const registerUser = async (userData: RegisterRequest) => {
  try {
    console.log("Request payload:", userData); // Log the data being sent to the server
    const response = await API.post<ApiResponse<RegisterResponse>>(
      "register",
      userData
    );
    console.log("Response received:", response);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      const err = error.response?.data as ApiError<{}>;
      return new ApiError(err.statusCode, {}, err.message);
    } else {
      return new ApiError(400, {}, "Something went wrong");
    }
  }
};

// Send OTP
export const sendOTP = async (reqData: SendOTPRequest) => {
  try {
    console.log("Request payload:", reqData);
    const response = await API.post<ApiResponse<{}>>(
      "sendVerificationCode",
      reqData
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      const err = error.response?.data as ApiError<{}>;
      return new ApiError(err.statusCode, {}, err.message);
    } else {
      return new ApiError(400, {}, "Something went wrong");
    }
  }
};

// Verify the OTP
export const verifyOTP = async (reqData: VerifyOTPRequest) => {
  try {
    console.log("Request payload:", reqData);
    const response = await API.post<ApiResponse<{}>>(
      "validateVerificationCode",
      reqData
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      const err = error.response?.data as ApiError<{}>;
      return new ApiError(err.statusCode, {}, err.message);
    } else {
      return new ApiError(400, {}, "Something went wrong");
    }
  }
};

// editUserDetail
export const editUserDetail = async (reqData: EditUserDetailRequest) => {
  try {
    console.log("Request payload:", reqData);
    const response = await API.post<ApiResponse<{}>>(
      "editCurrentUserDetail",
      reqData
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      const err = error.response?.data as ApiError<{}>;
      return new ApiError(err.statusCode, {}, err.message);
    } else {
      return new ApiError(400, {}, "Something went wrong");
    }
  }
};

export const logOutUser = async () => {
  try {
    const accessToken = await getToken("accessToken");
    const response = await API.post<ApiResponse<{}>>("logOutUser", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      const err = error.response?.data as ApiError<{}>;
      return new ApiError(err.statusCode, {}, err.message);
    } else {
      return new ApiError(400, {}, "Something went wrong");
    }
  }
};
