import axios, { AxiosError } from "axios";
import { LoginResponse, RegisterRequest, RegisterResponse } from "./auth";
import { ApiResponse, ApiError } from "../utils/apiResponse";

export const API = axios.create({
  baseURL:
    // "https://8c1f-2406-2d40-4d55-6c10-bdc3-9abf-864e-c64f.ngrok-free.app",
    "http://localhost:3000",

  headers: {
    "Content-Type": "application/json",
  },
});

export const loginUser = async (
  email: string,
  password: string
): Promise<ApiResponse<LoginResponse>> => {
  const response = await API.post("/api/v1/auth/login", { email, password });
  return response.data;
};

export const registerUser = async (userData: RegisterRequest) => {
  try {
    console.log("Request payload:", userData); // Log the data being sent to the server
    const response = await API.post("/api/v1/auth/register", userData);
    console.log("Response received:", response);

    if (response.status !== 200) {
      console.log("Response status is not 200:", response.status);
      const { statusCode, message } = response.data;
      console.log("Error data:", { statusCode, message });

      throw new ApiError(statusCode, {}, message);
    } else {
      console.log("Registration successful:", response.data);

      const res = response.data as RegisterResponse;
      return res;
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      return error;
    } else if (error instanceof ApiError) {
      return error;
    } else {
      return new ApiError(400, {}, "Something went wrong");
    }
  }
};
