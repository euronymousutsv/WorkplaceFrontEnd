import axios, { AxiosError } from "axios";
import { getToken, Plat } from "../auth/token";
import { ApiError, ApiResponse } from "../utils/apiResponse";

const baseUrl = process.env.BASE_URL || "";
const API = axios.create({
  baseURL: baseUrl + "/api/document",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Document Types
export interface Document {
  id: string;
  employeeId: string;
  documentType: "License" | "National ID";
  documentid: number;
  expiryDate: string;
  issueDate: string;
  docsURL: string;
  isVerified: boolean;
}

// Request Types
export interface UploadDocumentRequest {
  employeeId: string;
  documentType: "License" | "National ID";
  documentid: number;
  issueDate: string;
  expiryDate: string;
  docsURL: string;
}

export interface GetEmployeeDocumentsRequest {
  employeeId: string;
}

// Response Types
export interface GetEmployeeDocumentsResponse {
  documents: Document[];
}

// API Functions
export const uploadEmployeeDocument = async (
  reqData: UploadDocumentRequest
) => {
  try {
    const response = await axios.post(`${baseUrl}/addDocument`, reqData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export const getEmployeeDocuments = async (
  reqData: GetEmployeeDocumentsRequest
) => {
  try {
    console.log(reqData.employeeId);
    const response = await API.get<ApiResponse<Document[]>>(
      `employee/${reqData.employeeId}`,
      {
        // Removed authorization header since it's not needed at the moment
      }
    );

    console.log(response.data);
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

export const verifyDocument = async (documentId: string) => {
  try {
    const accessToken = await getToken("accessToken");
    const response = await API.put<ApiResponse<Document>>(
      `update/${documentId}`,
      { isVerified: true },
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

export const deleteDocument = async (documentId: string) => {
  try {
    const accessToken = await getToken("accessToken");
    const response = await API.delete<ApiResponse<{}>>(
      `deleteDocument/${documentId}`,
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
