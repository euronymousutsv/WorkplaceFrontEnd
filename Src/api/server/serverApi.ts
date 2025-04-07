import axios, { AxiosError } from "axios";
import { loginUser } from "../auth/authApi";
import { getToken } from "../auth/token";
import { ApiError, ApiResponse } from "../utils/apiResponse";
import {
  joinAServerResponse,
  Role,
  SearchServerResponse,
  userJoinedServerResponse,
} from "./server";

export const API = axios.create({
  baseURL:
    // "https://workplace-zdzja.ondigitalocean.app/api/v1",
    // "https://8c1f-2406-2d40-4d55-6c10-bdc3-9abf-864e-c64f.ngrok-free.app/api/v1",
    "http://localhost:3000/api/v1",

  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use(async (config) => {
  if (config.headers["Skip-Auth"]) {
    delete config.headers["Skip-Auth"]; // Clean it up before sending the request
    return config;
  } else {
    const token = await getToken("accessToken");
    console.log("the token is :::::", token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }
});

export const getLoggedInUserServer = async () => {
  try {
    const accessToken = await getToken("accessToken");
    const response = await API.get<ApiResponse<userJoinedServerResponse>>(
      "/server/getLoggedInUserServer",
      {
        params: { accessToken },
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

export const joinAServer = async (inviteCode: string) => {
  try {
    const accessToken = await getToken("accessToken");
    const response = await API.post<ApiResponse<joinAServerResponse>>(
      "/server/joinServer",
      {
        accessToken,
        inviteCode,
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

//search  server with invite code
export const searchServer = async (inviteCode: string) => {
  try {
    const response = await API.post<ApiResponse<SearchServerResponse>>(
      "/server/search",
      {},
      {
        params: { inviteCode },

        headers: {
          "Skip-Auth": true,
        },
      }
    );
    return response;
  } catch (error) {
    if (error instanceof AxiosError) {
      const err = error.response?.data as ApiError<{}>;
      return new ApiError(err.statusCode, {}, err.message);
    } else {
      return new ApiError(400, {}, "Something went wrong");
    }
  }
};

// register a new Server
export const registerServer = async (serverName: string, ownerId: string) => {
  try {
    const accessToken = await getToken("accessToken");
    const response = await API.post<ApiResponse<{}>>("/server/register", {
      accessToken,
      ownerId,
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

// change server owner
// todo:: Chaek this later
export const changeServerOwnership = async (newOwnerId: string) => {
  try {
    const response = await API.put<ApiResponse<{}>>(
      "/server/changeServerOwnership",
      {
        newOwnerId,
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

// delete a server
export const deleteServer = async (password: string) => {
  try {
    const response = await API.delete<ApiResponse<{}>>("/server/deleteServer", {
      headers: { "user-password": password },
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

//kick an employee
export const kickEmployee = async (userId: string) => {
  try {
    const response = await API.delete<ApiResponse<{}>>("/server/kickEmployee", {
      params: { userId },
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

//update a user role
export const updateRole = async (userId: string, role: Role) => {
  try {
    const response = await API.delete<ApiResponse<{}>>("/server/updateRole", {
      params: { userId, role },
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
