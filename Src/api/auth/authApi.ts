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
import { Role } from "../server/server";

const API = axios.create({
  baseURL:
    // "https://8c1f-2406-2d40-4d55-6c10-bdc3-9abf-864e-c64f.ngrok-free.app",
    "https://workplace-zdzja.ondigitalocean.app/api/v1/auth/",
  // "http://localhost:3000/api/v1/auth/",
  // "https://569a-110-175-196-31.ngrok-free.app/api/v1/auth/",

  headers: {
    "Content-Type": "application/json",
  },
});

const loginUser = async (email: string, password: string): Promise<any> => {
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

const registerUser = async (userData: RegisterRequest) => {
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
const sendOTP = async (reqData: SendOTPRequest) => {
  try {
    console.log("Request payload:", reqData);
    const response = await API.post<ApiResponse<{}>>(
      "sendVerificationCode",
      reqData
    );
    console.log(response);
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
const verifyOTP = async (reqData: VerifyOTPRequest) => {
  try {
    console.log("Request payload:", reqData);
    const response = await API.post<ApiResponse<{}>>(
      "validateVerificationCode",
      reqData
    );
    console.log(response.data.message);
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

const partialregisterComplete = async (
  phoneNumber: string,
  password: string
) => {
  console.log(password, phoneNumber);
  try {
    const response = await API.post<ApiResponse<{}>>(
      "partialRegestrationPasswordSet",

      {
        phoneNumber,
        password,
      }
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
const editUserDetail = async (reqData: EditUserDetailRequest) => {
  try {
    const accessToken = await getToken("accessToken");
    const response = await API.post<ApiResponse<{}>>(
      "editCurrentUserDetail",
      reqData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
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

// logs out an user
const logOutUser = async () => {
  try {
    const accessToken = await getToken("accessToken");
    const response = await API.get<ApiResponse<{}>>("logOutUser", {
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

export {
  loginUser,
  registerUser,
  sendOTP,
  verifyOTP,
  editUserDetail,
  logOutUser,
  partialregisterComplete,
};
