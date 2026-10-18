import React from "react";
import { Text as RNText, type TextProps as RNTextProps } from "react-native";
import { cn } from "@/utils/helpers";

interface TextProps extends RNTextProps {
  variant?: "h1" | "h2" | "h3" | "body" | "bodySmall" | "caption" | "label";
  className?: string;
  children: React.ReactNode;
}

const variantStyles = {
  h1: "text-3xl font-extrabold text-navy-800 dark:text-navy-50",
  h2: "text-2xl font-bold text-navy-800 dark:text-navy-50",
  h3: "text-xl font-semibold text-navy-800 dark:text-navy-50",
  body: "text-base text-navy-700 dark:text-navy-100",
  bodySmall: "text-sm text-navy-600 dark:text-navy-200",
  caption: "text-xs text-muted dark:text-muted-dark",
  label: "text-sm font-medium text-navy-800 dark:text-navy-100",
};

export function Text({
  variant = "body",
  className,
  children,
  ...props
}: TextProps) {
  return (
    <RNText className={cn(variantStyles[variant], className)} {...props}>
      {children}
    </RNText>
  );
}
