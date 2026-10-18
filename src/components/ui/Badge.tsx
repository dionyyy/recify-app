import React from "react";
import { View, Text } from "react-native";
import { cn } from "@/utils/helpers";

interface BadgeProps {
  label: string;
  variant?: "primary" | "secondary" | "muted" | "success" | "warning";
  size?: "sm" | "md";
  className?: string;
}

const variantStyles = {
  primary: "bg-primary-50 dark:bg-primary-900",
  secondary: "bg-secondary-50 dark:bg-secondary-900",
  muted: "bg-navy-100 dark:bg-navy-700",
  success: "bg-green-50 dark:bg-green-900",
  warning: "bg-amber-50 dark:bg-amber-900",
};

const variantTextStyles = {
  primary: "text-primary dark:text-primary-light",
  secondary: "text-secondary dark:text-secondary-light",
  muted: "text-navy-600 dark:text-navy-300",
  success: "text-green-700 dark:text-green-300",
  warning: "text-amber-700 dark:text-amber-300",
};

export function Badge({
  label,
  variant = "muted",
  size = "sm",
  className,
}: BadgeProps) {
  return (
    <View
      className={cn(
        "rounded-full",
        variantStyles[variant],
        size === "sm" ? "px-2.5 py-0.5" : "px-3 py-1",
        className
      )}
    >
      <Text
        className={cn(
          "font-medium",
          variantTextStyles[variant],
          size === "sm" ? "text-xs" : "text-sm"
        )}
      >
        {label}
      </Text>
    </View>
  );
}
