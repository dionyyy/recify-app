import { MMKV } from "react-native-mmkv";

export const storage = new MMKV({
  id: "recify-storage",
});

/**
 * Zustand persist storage adapter for MMKV
 */
export const mmkvStorage = {
  getItem: (name: string): string | null => {
    const value = storage.getString(name);
    return value ?? null;
  },
  setItem: (name: string, value: string): void => {
    storage.set(name, value);
  },
  removeItem: (name: string): void => {
    storage.delete(name);
  },
};

/**
 * React Query async storage persister adapter for MMKV
 */
export const mmkvAsyncStorage = {
  getItem: async (key: string): Promise<string | null> => {
    const value = storage.getString(key);
    return value ?? null;
  },
  setItem: async (key: string, value: string): Promise<void> => {
    storage.set(key, value);
  },
  removeItem: async (key: string): Promise<void> => {
    storage.delete(key);
  },
};
