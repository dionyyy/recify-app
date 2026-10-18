import { useColorScheme as useRNColorScheme } from "react-native";
import { useSettingsStore } from "@/store/settingsStore";

export function useColorScheme(): "light" | "dark" {
  const systemScheme = useRNColorScheme();
  const settingsScheme = useSettingsStore((s) => s.colorScheme);

  if (settingsScheme === "system") {
    return systemScheme === "dark" ? "dark" : "light";
  }
  return settingsScheme;
}
