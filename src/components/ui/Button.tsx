import React from "react";
import {
  Pressable,
  Text,
  ActivityIndicator,
  type PressableProps,
} from "react-native";
import { cn } from "@/utils/helpers";
import { useHaptics } from "@/hooks/useHaptics";

interface ButtonProps extends Omit<PressableProps, "children"> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  textClassName?: string;
}

const variantStyles = {
  primary: "bg-primary active:bg-primary-dark",
  secondary: "bg-secondary active:bg-secondary-dark",
  outline:
    "bg-transparent border-2 border-primary active:bg-primary-50",
  ghost: "bg-transparent active:bg-navy-50 dark:active:bg-navy-700",
};

const variantTextStyles = {
  primary: "text-white",
  secondary: "text-white",
  outline: "text-primary dark:text-primary-light",
  ghost: "text-navy-800 dark:text-navy-50",
};

const sizeStyles = {
  sm: "px-3 py-2 rounded-lg",
  md: "px-5 py-3 rounded-xl",
  lg: "px-7 py-4 rounded-2xl",
};

const textSizeStyles = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  className,
  textClassName,
  onPress,
  ...props
}: ButtonProps) {
  const haptics = useHaptics();

  const handlePress = (e: any) => {
    haptics.light();
    onPress?.(e);
  };

  return (
    <Pressable
      className={cn(
        "flex-row items-center justify-center",
        variantStyles[variant],
        sizeStyles[size],
        (disabled || loading) && "opacity-50",
        className
      )}
      disabled={disabled || loading}
      onPress={handlePress}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === "outline" || variant === "ghost" ? "#FF6B6B" : "#FFFFFF"}
          size="small"
        />
      ) : (
        <Text
          className={cn(
            "font-semibold text-center",
            variantTextStyles[variant],
            textSizeStyles[size],
            textClassName
          )}
        >
          {children}
        </Text>
      )}
    </Pressable>
  );
}
