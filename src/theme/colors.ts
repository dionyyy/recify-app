export const colors = {
  light: {
    background: "#FAFBFC",
    surface: "#FFFFFF",
    primary: "#FF6B6B",
    primaryLight: "#FF8A80",
    secondary: "#4ECDC4",
    secondaryLight: "#64FFDA",
    text: "#1A1A2E",
    textSecondary: "#475569",
    muted: "#6B7280",
    border: "#E2E8F0",
    error: "#EF4444",
    success: "#10B981",
    warning: "#F59E0B",
  },
  dark: {
    background: "#0F0F1A",
    surface: "#1A1A2E",
    primary: "#FF8A80",
    primaryLight: "#FFB3B3",
    secondary: "#64FFDA",
    secondaryLight: "#AEFFF4",
    text: "#F1F5F9",
    textSecondary: "#94A3B8",
    muted: "#94A3B8",
    border: "#334155",
    error: "#F87171",
    success: "#34D399",
    warning: "#FBBF24",
  },
} as const;

export type ColorScheme = "light" | "dark" | "system";
export type ThemeColors = (typeof colors)["light"];
