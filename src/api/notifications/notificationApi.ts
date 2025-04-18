import axios, { AxiosError } from "axios";
import { getToken, Plat } from "../auth/token";
import { ApiError, ApiResponse } from "../utils/apiResponse";

const baseUrl =
  process.env.BASE_URL || "https://workplace-zdzja.ondigitalocean.app";
// creating an instance of axios api wth base url
const API = axios.create({
  baseURL: baseUrl + "/api/v1/notify/",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const sendAnnouncementToSelectedUsers = async (
  userIds: string[],
  title: string,
  body: string
) => {
  const accessToken = await getToken("accessToken", Plat.WEB);

  try {
    const response = await API.post(
      "sendNotificationToSelectedUsers",
      {
        userIds,
        title,
        body,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("Error sending announcement:", error);

    const err = error.response?.data as ApiError<{}>;
    return new ApiError(
      err?.statusCode || 500,
      {},
      err?.message || "Unknown error"
    );
  }
};
