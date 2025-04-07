import axios, { AxiosError } from "axios";
import { ApiError, ApiResponse } from "../utils/apiResponse";
import { getToken } from "./token";

export const API = axios.create({
  baseURL:
    // "https://8c1f-2406-2d40-4d55-6c10-bdc3-9abf-864e-c64f.ngrok-free.app",
    "http://localhost:3000",

  headers: {
    "Content-Type": "application/json",
  },
});

type getShiftsForLoggedInUserResponse = {
  id: string;
  employeeId: string;
  officeId: string;
  startTime: string;
  endTime: string;
};

export class Shifts {
  id: string;
  employeeId: string;
  officeId: string;
  startTime: string;
  endTime: string;
  officeLocation: OfficeLocation;

  constructor(
    id: string,
    employeeId: string,
    officeId: string,
    startTime: string,
    endTime: string,
    officeLocation: OfficeLocation
  ) {
    this.id = id;
    this.employeeId = employeeId;
    this.officeId = officeId;
    this.startTime = startTime;
    this.endTime = endTime;
    this.officeLocation = officeLocation;
  }
}
class OfficeLocation {
  id: string;
  name: string;
  latitude: string;
  longitude: string;
  radius: number;

  constructor(
    id: string,
    name: string,
    latitude: string,
    longitude: string,
    radius: number
  ) {
    this.id = id;
    this.name = name;
    this.latitude = latitude;
    this.longitude = longitude;
    this.radius = radius;
  }

  // You can also add any methods to manipulate or display the data as needed
  getCoordinates(): string {
    return `Latitude: ${this.latitude}, Longitude: ${this.longitude}`;
  }

  // You can implement any other methods you need for your application
}

export const getShiftsForLoggedInUser = async () => {
  try {
    const accessToken = (await getToken("accessToken")) ?? "";
    const response = await API.get("api/roster/getShiftsForLoggedInUser", {
      params: { accessToken },
    });

    const res = response.data as ApiResponse<[Shifts]>;
    return res;
  } catch (error) {
    if (error instanceof AxiosError) {
      const err = error.response?.data as ApiError<{}>;
      return new ApiError(err.statusCode, {}, err.message);
    } else {
      return new ApiError(400, {}, "Something went wrong");
    }
  }
};
