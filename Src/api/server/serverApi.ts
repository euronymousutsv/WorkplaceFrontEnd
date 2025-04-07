import axios, { AxiosError } from "axios";
import { loginUser } from "../auth/authApi";
import { getToken } from "../auth/token";
import { ApiError, ApiResponse } from "../utils/apiResponse";

export interface userJoinedServerResponse {
  serverId: string;
}

export interface joinAServerResponse {
  id: string;
  name: string;
  idVerificationRequired: boolean;
  inviteLink: string;
}

export const API = axios.create({
  baseURL: "https://workplace-zdzja.ondigitalocean.app/api/v1",
  // "https://8c1f-2406-2d40-4d55-6c10-bdc3-9abf-864e-c64f.ngrok-free.app/api/v1",
  // "http://localhost:3000/api/v1",

  headers: {
    "Content-Type": "application/json",
  },
});

export const getLoggedInUserServer = async () => {
  try {
    const accessToken = (await getToken("accessToken")) ?? "";
    const response = await API.get("/server/getLoggedInUserServer", {
      params: { accessToken },
    });

    const res = response.data as ApiResponse<userJoinedServerResponse>;
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

export const joinAServer = async (inviteCode: string) => {
  try {
    const accessToken = (await getToken("accessToken")) ?? "";
    const response = await API.post("/server/joinServer", {
      accessToken,
      inviteCode,
    });

    const { data } = response.data.data;
    return data;
  } catch (error) {
    if (error instanceof AxiosError) {
      const err = error.response?.data as ApiError<{}>;
      return new ApiError(err.statusCode, {}, err.message);
    } else {
      return new ApiError(400, {}, "Something went wrong");
    }
  }
};
