import React from "react";
import { View, Text } from "react-native";
import { Image } from "expo-image";
import { cn } from "@/utils/helpers";

interface AvatarProps {
  uri?: string | null;
  name?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeStyles = {
  sm: "w-8 h-8",
  md: "w-10 h-10",
  lg: "w-14 h-14",
  xl: "w-20 h-20",
};

// Explicit pixel sizes for expo-image (className dimensions don't reliably
// apply to the native image component).
const sizePx = {
  sm: 32,
  md: 40,
  lg: 56,
  xl: 80,
} as const;

const textSizeStyles = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-lg",
  xl: "text-2xl",
};

function getInitials(name?: string): string {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function Avatar({ uri, name, size = "md", className }: AvatarProps) {
  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={{ width: sizePx[size], height: sizePx[size] }}
        className={cn("rounded-full", className)}
        contentFit="cover"
      />
    );
  }

  return (
    <View
      className={cn(
        "rounded-full items-center justify-center bg-primary",
        sizeStyles[size],
        className,
      )}
    >
      <Text className={cn("text-white font-bold", textSizeStyles[size])}>
        {getInitials(name)}
      </Text>
    </View>
  );
}
