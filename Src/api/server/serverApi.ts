import axios, { AxiosError } from "axios";
import { loginUser } from "../auth/authApi";
import { getToken, Plat } from "../auth/token";
import { ApiError, ApiResponse } from "../utils/apiResponse";
import {
  EmployeeDetails,
  joinAServerResponse,
  Role,
  SearchServerResponse,
  userJoinedServerResponse,
} from "./server";

// creating an instance of axios api wth base url
const API = axios.create({
  baseURL:
    "https://workplace-zdzja.ondigitalocean.app/api/v1",
    // "https://8c1f-2406-2d40-4d55-6c10-bdc3-9abf-864e-c64f.ngrok-free.app/api/v1",
    // "http://localhost:3000/api/v1/server/",

  headers: {
    "Content-Type": "application/json",
  },
});

// // adding accesstoken in the request
// API.interceptors.request.use(async (config) => {
//   try {
//     const token = await getToken("accessToken");
//     console.log("the token is :::::", token);
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//   } catch (error) {
//     console.log("Token is missing");
//   }
//   return config;
// });

const getLoggedInUserServer = async () => {
  try {
    const accessToken = await getToken("accessToken");
    const response = await API.get<ApiResponse<userJoinedServerResponse>>(
      "getLoggedInUserServer",
      {
        params: { accessToken },
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

const joinAServer = async (inviteCode: string) => {
  try {
    const accessToken = await getToken("accessToken");
    const response = await API.post<ApiResponse<joinAServerResponse>>(
      "joinServer",
      {
        accessToken,
        inviteCode,
      },
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

//search  server with invite code
const searchServer = async (inviteCode: string) => {
  try {
    const response = await API.post<ApiResponse<SearchServerResponse>>(
      "search",
      {},
      {
        params: { inviteCode },
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
const registerServer = async (serverName: string, ownerId: string) => {
  try {
    const accessToken = await getToken("accessToken");
    const response = await API.post<ApiResponse<{}>>(
      "register",
      {
        accessToken,
        ownerId,
      },
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

// change server owner
// todo:: Chaek this later
const changeServerOwnership = async (newOwnerId: string) => {
  try {
    const accessToken = await getToken("accessToken");
    const response = await API.put<ApiResponse<{}>>(
      "changeServerOwnership",
      {
        newOwnerId,
      },
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

// delete a server
const deleteServer = async (password: string) => {
  try {
    const accessToken = await getToken("accessToken", Plat.WEB);
    const response = await API.delete<ApiResponse<{}>>("deleteServer", {
      headers: {
        "user-password": password,
        Authorization: `Bearer ${accessToken}`,
      },
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
const kickEmployee = async (userId: string) => {
  try {
    const accessToken = await getToken("accessToken", Plat.WEB);
    const response = await API.delete<ApiResponse<{}>>("kickEmployee", {
      params: { userId },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
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
const updateRole = async (userId: string, role: Role) => {
  try {
    const accessToken = await getToken("accessToken");

    const response = await API.delete<ApiResponse<{}>>("updateRole", {
      params: { userId, role },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
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

// get all users with a server
const fetchAllUsers = async () => {
  const accessToken = await getToken("accessToken", Plat.WEB);
  console.log("---------", accessToken, "----");
  try {
    const response = await API.get<ApiResponse<[EmployeeDetails]>>(
      "server/fetchAllUsers",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("API error:", error);

    if (error instanceof AxiosError) {
      const err = error.response?.data as ApiError<{}>;
      return new ApiError(err.statusCode, {}, err.message);
    } else {
      return new ApiError(400, {}, "Something went wrong");
    }
  }
};

export {
  updateRole,
  kickEmployee,
  deleteServer,
  changeServerOwnership,
  registerServer,
  searchServer,
  joinAServer,
  getLoggedInUserServer,
  fetchAllUsers,
};
