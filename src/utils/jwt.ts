// utils/jwt.ts
import JWT from "expo-jwt"; 
import { getToken } from "../api/auth/token";

interface DecodedToken {
  userId: string;
  role: string;
  iat: number;
  exp: number;
}

export const getUserIdFromToken = async (): Promise<string | null> => {
  try {
    const token = await getToken("accessToken");
    if (!token) return null;

    const decoded = JWT.decode(token, null);
    return decoded.userId;
  } catch (err) {
    console.error("Failed to decode token", err);
    return null;
  }
};
