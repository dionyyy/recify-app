import React from "react";
import { Pressable, type PressableProps } from "react-native";
import { cn } from "@/utils/helpers";
import { useHaptics } from "@/hooks/useHaptics";

interface IconButtonProps extends Omit<PressableProps, "children"> {
  children: React.ReactNode;
  variant?: "default" | "filled" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeStyles = {
  sm: "w-8 h-8 rounded-lg",
  md: "w-10 h-10 rounded-xl",
  lg: "w-12 h-12 rounded-xl",
};

const variantStyles = {
  default:
    "bg-navy-100 dark:bg-navy-700 active:bg-navy-200 dark:active:bg-navy-600",
  filled: "bg-primary active:bg-primary-dark",
  ghost: "bg-transparent active:bg-navy-100 dark:active:bg-navy-700",
};

export function IconButton({
  children,
  variant = "default",
  size = "md",
  className,
  onPress,
  ...props
}: IconButtonProps) {
  const haptics = useHaptics();

  const handlePress = (e: any) => {
    haptics.light();
    onPress?.(e);
  };

  return (
    <Pressable
      className={cn(
        "items-center justify-center",
        sizeStyles[size],
        variantStyles[variant],
        className
      )}
      onPress={handlePress}
      {...props}
    >
      {children}
    </Pressable>
  );
}
