import axios, { AxiosError } from "axios";
import { getToken, Plat } from "../auth/token";
import { ApiError, ApiResponse } from "../utils/apiResponse";

const API = axios.create({
  baseURL: "https://workhive.space/api/v1/" + "notify/",
  headers: {
    "Content-Type": "application/json",
  },
});

export interface NotificationsResponsePayload {
  id: string;
  employeeId: string;
  title: string;
  body: string;
  createdAt: string;
  updatedAt: string;
}

export const fetchAllNotificationsPhone = async () => {
  try {
    const accessToken = await getToken("accessToken", Plat.PHONE);
    const response = await API.get<ApiResponse<[NotificationsResponsePayload]>>(
      "fetchAllNotifications",
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
