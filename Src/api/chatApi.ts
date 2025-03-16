import axios, { AxiosError } from "axios";
import { getToken } from "./auth/token";
import { ApiError, ApiResponse } from "./utils/apiResponse";

export class Chats {
  id?: string;
  userId?: string;
  message?: string;
  channelId?: string;
  createdAt?: Date;
  updatedAt?: Date;
  Employee?: {
    firstName: string;
    email: string;
    phoneNumber: string;
    employmentStatus: "Active" | "Inactive";
    role: "admin" | "employee" | "manager";
    profileImage: string | null;
  };

  constructor(chat: any) {
    this.id = chat.id;
    this.userId = chat.userId;
    this.message = chat.message;
    this.channelId = chat.channelId;
    this.createdAt = chat.createdAt;
    this.updatedAt = chat.updatedAt;
    this.Employee = {
      firstName: chat.Employee?.firstName || "",
      email: chat.Employee?.email || "",
      phoneNumber: chat.Employee?.phoneNumber || "",
      employmentStatus: chat.Employee?.employmentStatus || "Inactive",
      role: chat.Employee?.role || "employee",
      profileImage: chat.Employee?.profileImage || null,
    };
  }
}
const API = axios.create({
  baseURL:
    "https://8c1f-2406-2d40-4d55-6c10-bdc3-9abf-864e-c64f.ngrok-free.app/api/v1/",
  // "http://localhost:3000/api/v1/",

  headers: {
    "Content-Type": "application/json",
  },
});

export const fetchChats = async (channelId: string) => {
  try {
    const response = await API.get("chat/fetchChats/" + channelId, {
      params: {
        limit: 20,
        page: 1,
      },
    });
    const res = response.data as ApiResponse<[chat]>;

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
