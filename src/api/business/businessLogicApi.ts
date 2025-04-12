import axios, { AxiosError } from "axios";
import { ApiError, ApiResponse } from "../utils/apiResponse";
import { getToken } from "../auth/token";

const API = axios.create({
  baseURL:
    // "https://workplace-zdzja.ondigitalocean.app/api/businessLogic/",
    "http://localhost:3000/api/businessLogic/",
  headers: {
    "Content-Type": "application/json",
  },
});

// API.interceptors.request.use(async (config) => {
//   const token = await getToken("accessToken");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// sends a get request for all the channels that are in the server
// const calculatePayrate = async (serverId: string) => {
//   try {
//     const response = await API.get<
//       ApiResponse<[getAllChannelForCurrentServerResponse]>
//     >("getAllChannelForCurrentServer", {
//       params: { serverId },
//     });

//     return response.data;
//   } catch (error) {
//     if (error instanceof AxiosError) {
//       const err = error.response?.data as ApiError<{}>;
//       return new ApiError(err.statusCode, {}, err.message);
//     } else {
//       return new ApiError(400, {}, "Something went wrong");
//     }
//   }
// };
