import axios, { AxiosError } from "axios";
import { ApiError, ApiResponse } from "../utils/apiResponse";
import { getToken } from "../auth/token";

export type getAllChannelForCurrentServerResponse = {
  id: string;
  name: string;
};

const API = axios.create({
  baseURL: "https://workplace-zdzja.ondigitalocean.app/api/v1/",
  // "https://8c1f-2406-2d40-4d55-6c10-bdc3-9abf-864e-c64f.ngrok-free.app/api/v1/",
  // "http://localhost:3000/api/v1/",

  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use(async (config) => {
  const token = await getToken("accessToken");
  console.log("the token is :::::", token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getAllChannelForCurrentServer = async (serverId: string) => {
  try {
    const response = await API.get("channel/getAllChannelForCurrentServer", {
      params: { serverId },
    });

    const res = response.data as [getAllChannelForCurrentServerResponse];

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
