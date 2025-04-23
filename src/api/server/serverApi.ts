import axios, { AxiosError } from "axios";
import { loginUser } from "../auth/authApi";
import { getToken, Plat } from "../auth/token";
import { ApiError, ApiResponse } from "../utils/apiResponse";
import {
  EmployeeDetails,
  EmployeeDetailsPayload,
  joinAServerResponse,
  Role,
  SearchServerResponse,
  UserJoinedServerResponse,
} from "./server";

const baseUrl = process.env.BASE_URL || "https://workhive.space";

// creating an instance of axios api wth base url
const API = axios.create({
  baseURL: baseUrl + "/api/v1/server/",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

//todo :: pass phone or web
const getLoggedInUserServer = async (plat: Plat) => {
  try {
    const accessToken = await getToken("accessToken", plat);
    const response = await API.get<ApiResponse<UserJoinedServerResponse>>(
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

//leave server
const leaveServer = async () => {
  try {
    const accessToken = await getToken("accessToken");
    const response = await API.delete<ApiResponse<{}>>("leaveServer", {
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

//update employee details

export interface ParitalEmployeePayload {
  serverId: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: Role;
}

// admins can partially register an employee
const partialregisterEmployee = async (reqData: ParitalEmployeePayload) => {
  try {
    const accessToken = await getToken("accessToken", Plat.WEB);
    const response = await API.post<ApiResponse<{}>>(
      "partialRegestrationEmployee",
      reqData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: { serverId: reqData.serverId },
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

const updateEmployeeDetails = async (payload: EmployeeDetailsPayload) => {
  try {
    const accessToken = await getToken("accessToken", Plat.WEB);
    const response = await API.put<ApiResponse<{}>>(
      "updateEmployeeDetails",
      payload,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("unexpected error in updateEmployeeDetails:", error);
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
      "fetchAllUsers",
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

interface EmployeeData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: string;
  employmentStatus: string | { [key: string]: string };
  profileImage?: string;
}

// get employee details by ID
const fetchEmployeeDetails = async (employeeId: string) => {
  try {
    const accessToken = await getToken("accessToken", Plat.WEB);
    console.log('Making API request for employee:', employeeId);
    
    const response = await API.get<ApiResponse<EmployeeData>>(
      `getEmployeeById/${employeeId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    console.log('Raw API Response:', JSON.stringify(response.data, null, 2));
    
    // Check if we have a response
    if (!response.data) {
      console.error('No response data received');
      return new ApiError(400, {}, 'No response data received');
    }

    // Return the entire response data
    return response.data;
  } catch (error) {
    console.error("API error in fetchEmployeeDetails:", error);

    if (error instanceof AxiosError) {
      console.error('Axios Error Details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers,
      });
      const err = error.response?.data as ApiError<{}>;
      return new ApiError(err.statusCode || 500, {}, err.message || 'Failed to fetch employee details');
    } else {
      return new ApiError(500, {}, "An unexpected error occurred");
    }
  }
};

interface EmployeeInfoUpdate {
  employeeId: string;
  username: string;
  baseRate: string;
  contractHours: string;
  employeeType: string;
  department: string;
  position: string;
  hireDate: string;
}

// update employee info
const updateEmployeeInfo = async (employeeData: EmployeeInfoUpdate) => {
  try {
    const accessToken = await getToken("accessToken", Plat.WEB);
    const response = await API.patch<ApiResponse<{}>>(
      "updateEmployeeInfo",
      employeeData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("API error in updateEmployeeInfo:", error);

    if (error instanceof AxiosError) {
      const err = error.response?.data as ApiError<{}>;
      return new ApiError(err.statusCode || 500, {}, err.message || 'Failed to update employee details');
    } else {
      return new ApiError(500, {}, "An unexpected error occurred");
    }
  }
};

interface EmployeeDocument {
  id: string;
  employeeId: string;
  documentType: 'License' | 'National ID';
  documentid: string;
  issueDate: string;
  expiryDate: string;
  docsURL: string;
  isVerified: boolean;
  updatedAt: string;
  createdAt: string;
  deletedAt: string | null;
}

const fetchEmployeeDocuments = async (employeeId: string) => {
  try {
    const accessToken = await getToken("accessToken", Plat.WEB);
    const response = await API.get<ApiResponse<EmployeeDocument>>(
      `document/employee/${employeeId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("API error in fetchEmployeeDocuments:", error);

    if (error instanceof AxiosError) {
      const err = error.response?.data as ApiError<{}>;
      return new ApiError(err.statusCode || 500, {}, err.message || 'Failed to fetch employee documents');
    } else {
      return new ApiError(500, {}, "An unexpected error occurred");
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
  leaveServer,
  partialregisterEmployee,
  updateEmployeeDetails,
  fetchEmployeeDetails,
  updateEmployeeInfo,
  fetchEmployeeDocuments,
};
