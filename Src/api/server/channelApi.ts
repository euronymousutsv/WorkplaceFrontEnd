import axios, { AxiosError } from "axios";
import { ApiError, ApiResponse } from "../utils/apiResponse";

export type getAllChannelForCurrentServerResponse = {
  id: string;
  name: string;
};
const API = axios.create({
  baseURL:
    // "https://8c1f-2406-2d40-4d55-6c10-bdc3-9abf-864e-c64f.ngrok-free.app/api/v1/",
    "http://localhost:3000/api/v1/",

  headers: {
    "Content-Type": "application/json",
  },
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
