import React from "react";
import { View } from "react-native";
import { Text } from "./Text";
import { Button } from "./Button";
import { cn } from "@/utils/helpers";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  message,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <View className={cn("flex-1 items-center justify-center p-8", className)}>
      {icon && <View className="mb-4">{icon}</View>}
      <Text variant="h3" className="text-center mb-2">
        {title}
      </Text>
      {message && (
        <Text variant="body" className="text-center text-muted dark:text-muted-dark mb-6">
          {message}
        </Text>
      )}
      {actionLabel && onAction && (
        <Button onPress={onAction} size="md">
          {actionLabel}
        </Button>
      )}
    </View>
  );
}
