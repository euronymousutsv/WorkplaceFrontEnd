import * as SecureStore from "expo-secure-store";

// Save token
export async function saveToken(key: string, value: string): Promise<void> {
  await SecureStore.setItemAsync(key, value, {
    keychainAccessible: SecureStore.WHEN_UNLOCKED,
  });
}

// Get token
export async function getToken(key: string): Promise<string | null> {
  return await SecureStore.getItemAsync(key);
}

// Delete token
export async function deleteToken(key: string): Promise<void> {
  await SecureStore.deleteItemAsync(key);
}
