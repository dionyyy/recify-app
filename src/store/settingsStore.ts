import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { mmkvStorage } from "@/services/storage/mmkv";
import type { ColorScheme } from "@/theme/colors";

interface SettingsState {
  colorScheme: ColorScheme;
  units: "metric" | "imperial";
  notificationsEnabled: boolean;
  aiModel: "flash" | "pro";
  setColorScheme: (scheme: ColorScheme) => void;
  setUnits: (units: "metric" | "imperial") => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  setAiModel: (model: "flash" | "pro") => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      colorScheme: "system",
      units: "metric",
      notificationsEnabled: true,
      aiModel: "flash",

      setColorScheme: (scheme) => set({ colorScheme: scheme }),
      setUnits: (units) => set({ units }),
      setNotificationsEnabled: (enabled) =>
        set({ notificationsEnabled: enabled }),
      setAiModel: (model) => set({ aiModel: model }),
    }),
    {
      name: "recify-settings",
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
);
