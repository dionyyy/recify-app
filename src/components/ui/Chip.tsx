import React from "react";
import { Pressable, Text } from "react-native";
import { cn } from "@/utils/helpers";
import { useHaptics } from "@/hooks/useHaptics";

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  className?: string;
}

export function Chip({ label, selected = false, onPress, className }: ChipProps) {
  const haptics = useHaptics();

  const handlePress = () => {
    haptics.selection();
    onPress?.();
  };

  return (
    <Pressable
      className={cn(
        "px-4 py-2 rounded-full border",
        selected
          ? "bg-primary border-primary"
          : "bg-transparent border-navy-200 dark:border-navy-600",
        className
      )}
      onPress={handlePress}
    >
      <Text
        className={cn(
          "text-sm font-medium",
          selected
            ? "text-white"
            : "text-navy-700 dark:text-navy-200"
        )}
      >
        {label}
      </Text>
    </Pressable>
  );
}
