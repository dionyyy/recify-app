import React from "react";
import { View, Text } from "react-native";
import { cn } from "@/utils/helpers";

interface DividerProps {
  label?: string;
  className?: string;
}

export function Divider({ label, className }: DividerProps) {
  if (label) {
    return (
      <View className={cn("flex-row items-center my-4", className)}>
        <View className="flex-1 h-px bg-navy-200 dark:bg-navy-700" />
        <Text className="px-3 text-sm text-muted dark:text-muted-dark">
          {label}
        </Text>
        <View className="flex-1 h-px bg-navy-200 dark:bg-navy-700" />
      </View>
    );
  }

  return (
    <View
      className={cn("h-px bg-navy-200 dark:bg-navy-700 my-4", className)}
    />
  );
}
