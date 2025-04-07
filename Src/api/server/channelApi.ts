import axios, { AxiosError } from "axios";
import { ApiError, ApiResponse } from "../utils/apiResponse";
import { getToken } from "../auth/token";
import {
  createChannelResponse,
  getAllChannelForCurrentServerResponse,
} from "./server";

const API = axios.create({
  baseURL: "https://workplace-zdzja.ondigitalocean.app/api/v1/channel/",
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use(async (config) => {
  const token = await getToken("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// sends a get request for all the channels that are in the server
export const getAllChannelForCurrentServer = async (serverId: string) => {
  try {
    const response = await API.get<
      ApiResponse<[getAllChannelForCurrentServerResponse]>
    >("getAllChannelForCurrentServer", {
      params: { serverId },
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

// create a new channel inside current server
// only admins can create a new channels
export const createNewChannel = async (reqData: createChannelResponse) => {
  try {
    const response = await API.post<ApiResponse<[createChannelResponse]>>(
      "getAllChannelForCurrentServer",
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
