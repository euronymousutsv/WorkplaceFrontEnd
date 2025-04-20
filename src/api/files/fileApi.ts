import axios from "axios";
import { getToken } from "../auth/token";
import { ApiResponse } from "../utils/apiResponse";

export const uploadFile = async (file: FormData, bucketName: string) => {
  const baseUrl = process.env.BASE_URL || "https://workhive.space";

  const accessToken = await getToken("accessToken");
  try {
    const response = await axios.post<ApiResponse<{ fileUrl: string }>>(
      `${baseUrl}/api/v1/file/upload`,
      file,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          bucketName: bucketName,
        },
      }
    );

    return response.data.data;
  } catch (error) {
    console.error("File upload failed:", error);
    throw error;
  }
};
