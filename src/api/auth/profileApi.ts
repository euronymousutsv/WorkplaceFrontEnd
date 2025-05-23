import axios, { AxiosError } from "axios";
import { getToken } from "./token"; // Assuming you have this method to get the token

const baseUrl =
  process.env.BASE_URL || "https://workplace-zdzja.ondigitalocean.app";
const API = axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

// Fetch user details
const getCurrentUserDetails = async () => {
  try {
    // Retrieve the access token
    const accessToken = await getToken("accessToken");
    if (!accessToken) {
      throw new Error("Token is missing");
    }

    // Send the GET request to fetch user details
    const response = await API.get("/api/v1/auth/getCurrentUserDetails", {
      headers: {
        Authorization: `Bearer ${accessToken}`, // Pass token in the headers
      },
    });

    return response.data; // Return the response containing the user details
  } catch (error) {
    if (error instanceof AxiosError) {
      const err = error.response?.data;
      console.error("Error fetching user details:", err);
      return null;
    } else {
      console.error("Error:", error);
      return null;
    }
  }
};

// Edit user details (password, full name, phone, etc.) but password for now.
const editCurrentUserDetail = async (
  password: string,
  editType: string, // FullName, Phone, etc.
  newDetail: string
) => {
  try {
    const accessToken = await getToken("accessToken");
    if (!accessToken) {
      throw new Error("Token is missing");
    }
    // Prepare request body based on edit type
    const body = {
      password,
      editType,
      newDetail,
    };

    // Send the POST request to edit user details
    const response = await API.post(
      "/api/v1/auth/editCurrentUserDetail",
      body,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return response.data; // Return the response containing the success message
  } catch (error) {
    if (error instanceof AxiosError) {
      const err = error.response?.data;
      console.error("Error updating user details:", err);
      return err; // Return the error response from the backend
    } else {
      console.error("Error:", error);
      return { message: "Something went wrong while updating the details." };
    }
  }
};

export { getCurrentUserDetails, editCurrentUserDetail };
