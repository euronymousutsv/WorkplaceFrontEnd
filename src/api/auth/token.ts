import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

export enum Plat {
  WEB = "web",
  PHONE = "phone",
}

// Save token
export async function saveToken(key: string, value: string): Promise<void> {
  try {
    const plat = Platform.OS === "web" ? Plat.WEB : Plat.PHONE;
    switch (plat) {
      // when the platform is web, store details in LocalStorage
      case Plat.WEB:
        localStorage.setItem(key, value);
        break;

      // when the platform is phone, store details in Expo SecureStore
      case Plat.PHONE:
      default:
        await SecureStore.setItemAsync(key, value, {
          keychainAccessible: SecureStore.WHEN_UNLOCKED,
        });
        break;
    }
  } catch (error) {
    console.error("Error saving token:", error);
    throw new Error("Failed to save token");
  }
}

// Get token
export async function getToken(key: string): Promise<string | null> {
  try {
    const plat = Platform.OS === "web" ? Plat.WEB : Plat.PHONE;

    switch (plat) {
      // when the platform is web, get details from LocalStorage
      case Plat.WEB:
        return localStorage.getItem(key);

      // when the platform is phone, get details from Expo SecureStore
      case Plat.PHONE:
      default:
        return await SecureStore.getItemAsync(key);
    }
  } catch (error) {
    console.error("Error retrieving token:", error);
    throw new Error("Failed to retrieve token");
  }
}

// Delete token
export async function deleteToken(key: string): Promise<void> {
  try {
    const plat = Platform.OS === "web" ? Plat.WEB : Plat.PHONE;

    switch (plat) {
      // when the platform is web, remove details from LocalStorage
      case Plat.WEB:
        localStorage.removeItem(key);
        break;

      // when the platform is phone, delete details from Expo SecureStore
      case Plat.PHONE:
      default:
        await SecureStore.deleteItemAsync(key);
        break;
    }
  } catch (error) {
    console.error("Error deleting token:", error);
    throw new Error("Failed to delete token");
  }
}
