import axios, { AxiosError } from "axios";
import { getToken } from "../auth/token";
import { ApiError, ApiResponse } from "../utils/apiResponse";
import { Chats } from "./chat";

const baseUrl =
  process.env.BASE_URL || "https://workplace-zdzja.ondigitalocean.app";
const API = axios.create({
  baseURL: baseUrl + "/api/v1/chat/",
  timeout: 10000,
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

export const fetchChats = async (channelId: string, limit = 20, page = 1) => {
  try {
    const response = await API.get<
      ApiResponse<{
        chats: [Chats];
        page: number;
        limit: number;
        totalPages: number;
        totalChats: number;
      }>
    >("fetchChats/" + channelId, {
      params: { limit, page },
    });

    // Debugging the API response
    // const { chats, page, limit, totalPages, totalChats } = response.data.data;
    // console.log("API Response :", chats);
    // const chatRes = chats as Chats[];
    // Check if 'chats' exists in the response and is an array

    return response.data; // Return the array of chats
  } catch (error) {
    if (error instanceof AxiosError) {
      const err = error.response?.data as ApiError<{}>;
      return new ApiError(err.statusCode, {}, err.message);
    }
    return new ApiError(400, {}, "Something went wrong");
  }
};
