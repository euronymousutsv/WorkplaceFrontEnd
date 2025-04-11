import * as SecureStore from "expo-secure-store";
import { Switch } from "react-native-gesture-handler";

// Save token

// using "Plat name for Platform so that is doesnt collide with "Platform" class from React Native
//  Platform
export enum Plat {
  WEB = "web",
  PHONE = "phone",
}

export async function saveToken(
  key: string,
  value: string,
  plat: Plat = Plat.PHONE
): Promise<void> {
  try {
    switch (plat) {
      // when the platform is web , we store details in Local storage
      case Plat.WEB:
        localStorage.setItem(key, value);
        break;

      // when the platform is web , we store details in Expo secured storage
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
export async function getToken(
  key: string,
  plat: Plat = Plat.WEB // changed t default to web by sabin for testing 
): Promise<string | null> {
 
  try {
    switch (plat) {
      // when the platform is web , we get details in Local storage
      case Plat.WEB:
        return Promise.resolve(localStorage.getItem(key));

      // when the platform is phone , we get details in Expo secured storage
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
export async function deleteToken(
  key: string,
  plat: Plat = Plat.PHONE
): Promise<void> {
  try {
    switch (plat) {
      // when the platform is web , we store details in Local storage
      case Plat.WEB:
        localStorage.removeItem(key);
        break;

      // when the platform is web , we store details in Expo secured storage
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
