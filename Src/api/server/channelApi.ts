import axios, { AxiosError } from "axios";
import { ApiError, ApiResponse } from "../utils/apiResponse";
import { getToken } from "../auth/token";
import {
  ChannelDetailsResponse,
  createChannelResponse,
  getAllChannelForCurrentServerResponse,
} from "./server";

const API = axios.create({
  baseURL: "https://workplace-zdzja.ondigitalocean.app/api/v1/channel/",
  headers: {
    "Content-Type": "application/json",
  },
});

// sending access token to the server
API.interceptors.request.use(async (config) => {
  const token = await getToken("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// create a new channel inside current server
// only admins can create a new channels
const createNewChannel = async (reqData: createChannelResponse) => {
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

// sends a get request for all the channels that are in the server
const getAllChannelForCurrentServer = async (serverId: string) => {
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

// delete a channel
// User requires a certain role to delete a channel.
const deleteChannel = async (reqData: {
  channelId: string;
  channelName: string;
}) => {
  try {
    const channelId = reqData.channelId;
    const response = await API.delete<ApiResponse<{}>>("delete", {
      params: {
        channelId,
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

// add access to channel
// employees cannot change access to channel
const addAccessToChannel = async (reqData: {
  channelId: string;
  highestRoleToAccessServer: string;
}) => {
  try {
    const { channelId, highestRoleToAccessServer } = reqData;

    const response = await API.post<ApiResponse<{}>>("addAccessToChannel", {
      channelId,
      highestRoleToAccessServer,
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

// change channel name
// Manager and admin can change channel name
const changeChannelName = async (reqData: {
  channelId: string;
  newChannelName: string;
}) => {
  try {
    const { channelId, newChannelName } = reqData;
    const response = await API.put<ApiResponse<{}>>("addAccessToChannel", {
      channelId,
      newChannelName,
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

// get channel details
const getChannelDetails = async (reqData: {
  channelId: string;
  newChannelName: string;
}) => {
  try {
    const { channelId } = reqData;
    const response = await API.get<ApiResponse<ChannelDetailsResponse>>(
      "getChannelDetails",
      {
        params: { channelId },
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

export {
  getAllChannelForCurrentServer,
  createNewChannel,
  deleteChannel,
  changeChannelName,
  getChannelDetails,
};
