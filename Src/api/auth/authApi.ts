import axios, { AxiosError } from "axios";
import { LoginResponse, RegisterRequest, RegisterResponse } from "./auth";
import { ApiResponse, ApiError } from "../utils/apiResponse";
import { getToken } from "./token";

export const API = axios.create({
  baseURL:
    // "https://8c1f-2406-2d40-4d55-6c10-bdc3-9abf-864e-c64f.ngrok-free.app",
    "https://workplace-zdzja.ondigitalocean.app",
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
    const response = await API.post("/api/v1/auth/login", { email, password });
    const res = response.data as ApiResponse<LoginResponse>;
    return res;
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
    const response = await API.post("/api/v1/auth/register", userData);
    console.log("Response received:", response);

    if (response.status !== 200) {
      const res = response.data as RegisterResponse;
      return res;
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      const err = error.response?.data as ApiError<{}>;
      return new ApiError(err.statusCode, {}, err.message);
    } else {
      return new ApiError(400, {}, "Something went wrong");
    }
  }
};
