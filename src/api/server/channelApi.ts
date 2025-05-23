import axios, { AxiosError } from "axios";
import { ApiError, ApiResponse } from "../utils/apiResponse";
import { getToken, Plat } from "../auth/token";
import {
  ChannelDetailsResponse,
  createChannelResponse,
  getAllChannelForCurrentServerResponse,
} from "./server";

const baseUrl =
  process.env.BASE_URL || "https://workplace-zdzja.ondigitalocean.app";

console.log("baseUrl:", baseUrl + "/api/v1/server/channel/");

const API = axios.create({
  baseURL: baseUrl + "/api/v1/channel/",

  headers: {
    "Content-Type": "application/json",
  },
});

type CreateChannelRequest = {
  serverId: string;
  channelName: string;
};

// create a new channel inside current server
// only admins can create a new channels
const createNewChannel = async (reqData: CreateChannelRequest) => {
  try {
    const accessToken = await getToken("accessToken");
    const response = await API.post<ApiResponse<createChannelResponse>>(
      "create",
      reqData,
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

// sends a get request for all the channels that are in the server
const getAllChannelForCurrentServer = async (serverId: string, plat: Plat) => {
  try {
    const accessToken = await getToken("accessToken");
    const response = await API.get<
      ApiResponse<[getAllChannelForCurrentServerResponse]>
    >("getAllChannelForCurrentServer", {
      params: { serverId },
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

// get all channels for current office
const getAllChannelForCurrentOffice = async (officeId: string, plat: Plat) => {
  try {
    const accessToken = await getToken("accessToken");
    const response = await API.get<
      ApiResponse<[getAllChannelForCurrentServerResponse]>
    >("getAllChannelForCurrentOffice", {
      params: { officeId },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log("response:", response.data);
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
    const accessToken = await getToken("accessToken");
    const channelId = reqData.channelId;
    const response = await API.delete<ApiResponse<{}>>("delete", {
      params: {
        channelId,
      },
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

// add access to channel
// employees cannot change access to channel
const addAccessToChannel = async (reqData: {
  channelId: string;
  highestRoleToAccessServer: string;
}) => {
  try {
    const { channelId, highestRoleToAccessServer } = reqData;
    const accessToken = await getToken("accessToken");

    const response = await API.post<ApiResponse<{}>>(
      "addAccessToChannel",
      {
        channelId,
        highestRoleToAccessServer,
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

// change channel name
// Manager and admin can change channel name
const changeChannelName = async (reqData: {
  channelId: string;
  newChannelName: string;
}) => {
  try {
    const { channelId, newChannelName } = reqData;
    console.log("channelID:", channelId);
    const accessToken = await getToken("accessToken");
    const response = await API.put<ApiResponse<{}>>(
      "changeAChannelName",
      { channelId, newChannelName },

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

// get channel details
const getChannelDetails = async (reqData: {
  channelId: string;
  newChannelName: string;
  plat: Plat;
}) => {
  try {
    const { channelId } = reqData;
    const accessToken = await getToken("accessToken");
    const response = await API.get<ApiResponse<ChannelDetailsResponse>>(
      "getChannelDetails",
      {
        params: { channelId },
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

export {
  getAllChannelForCurrentServer,
  getAllChannelForCurrentOffice,
  createNewChannel,
  deleteChannel,
  changeChannelName,
  getChannelDetails,
  addAccessToChannel,
};
