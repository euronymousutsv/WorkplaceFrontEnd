import axios, { AxiosError } from "axios";
import { getToken, Plat } from "../auth/token";
import { ApiError, ApiResponse } from "../utils/apiResponse";

const baseUrl = process.env.BASE_URL || "http://localhost:3000";
const API = axios.create({
  baseURL: baseUrl + "/api/document/",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Document Types
export interface Document {
  id: string;
  employeeId: string;
  documentType: 'License' | 'National ID';
  documentid: string;
  expiryDate: string;
  issueDate: string;
  docsURL: string;
  isVerified: boolean;
}

// Request Types
export interface UploadDocumentRequest {
  file: File;
  employeeId: string;
  documentType: 'License' | 'National ID';
  documentid: string;
  expiryDate: string;
  issueDate: string;
}

export interface GetEmployeeDocumentsRequest {
  employeeId: string;
}

// Response Types
export interface GetEmployeeDocumentsResponse {
  documents: Document[];
}

// API Functions
export const uploadEmployeeDocument = async (reqData: UploadDocumentRequest) => {
  try {
    const accessToken = await getToken("accessToken", Plat.WEB);
    const formData = new FormData();
    formData.append("file", reqData.file);
    formData.append("employeeId", reqData.employeeId);
    formData.append("documentType", reqData.documentType);
    formData.append("documentid", reqData.documentid);
    formData.append("expiryDate", reqData.expiryDate);
    formData.append("issueDate", reqData.issueDate);

    const response = await API.post<ApiResponse<Document>>("uploadEmployeeDocument", formData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "multipart/form-data",
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

export const getEmployeeDocuments = async (reqData: GetEmployeeDocumentsRequest) => {
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
    const accessToken = await getToken("accessToken", Plat.WEB);
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
    const accessToken = await getToken("accessToken", Plat.WEB);
    const response = await API.delete<ApiResponse<{}>>(`deleteDocument/${documentId}`, {
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