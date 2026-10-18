import React, { forwardRef } from "react";
import { View, TextInput, Text, type TextInputProps } from "react-native";
import { cn } from "@/utils/helpers";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: "default" | "search" | "textarea";
  containerClassName?: string;
}

export const Input = forwardRef<TextInput, InputProps>(
  (
    {
      label,
      error,
      leftIcon,
      rightIcon,
      variant = "default",
      containerClassName,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <View className={cn("w-full", containerClassName)}>
        {label && (
          <Text className="text-sm font-medium text-navy-800 dark:text-navy-100 mb-1.5">
            {label}
          </Text>
        )}
        <View
          className={cn(
            "flex-row items-center border rounded-xl px-4",
            "bg-surface dark:bg-surface-dark",
            "border-navy-200 dark:border-navy-600",
            error && "border-red-500",
            variant === "search" && "rounded-full bg-navy-50 dark:bg-navy-700 border-0",
            variant === "textarea" && "items-start min-h-[100px]"
          )}
        >
          {leftIcon && <View className="mr-2">{leftIcon}</View>}
          <TextInput
            ref={ref}
            className={cn(
              "flex-1 py-3 text-base text-navy-800 dark:text-navy-50",
              variant === "textarea" && "py-3 min-h-[100px]",
              className
            )}
            placeholderTextColor="#94A3B8"
            textAlignVertical={variant === "textarea" ? "top" : "center"}
            multiline={variant === "textarea"}
            {...props}
          />
          {rightIcon && <View className="ml-2">{rightIcon}</View>}
        </View>
        {error && (
          <Text className="text-sm text-red-500 mt-1">{error}</Text>
        )}
      </View>
    );
  }
);

Input.displayName = "Input";
