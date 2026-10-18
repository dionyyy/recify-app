import React from "react";
import { Pressable, View, type ViewProps } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { cn } from "@/utils/helpers";

interface CardProps extends ViewProps {
  children: React.ReactNode;
  variant?: "elevated" | "flat" | "outlined";
  pressable?: boolean;
  onPress?: () => void;
  className?: string;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const variantStyles = {
  elevated:
    "bg-surface dark:bg-surface-dark rounded-2xl shadow-sm shadow-navy-900/10",
  flat: "bg-surface dark:bg-surface-dark rounded-2xl",
  outlined:
    "bg-surface dark:bg-surface-dark rounded-2xl border border-navy-200 dark:border-navy-600",
};

export function Card({
  children,
  variant = "elevated",
  pressable = false,
  onPress,
  className,
  ...props
}: CardProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  if (pressable || onPress) {
    return (
      <AnimatedPressable
        style={animatedStyle}
        className={cn(variantStyles[variant], className)}
        onPressIn={() => {
          scale.value = withSpring(0.97, { damping: 15, stiffness: 200 });
        }}
        onPressOut={() => {
          scale.value = withSpring(1, { damping: 15, stiffness: 200 });
        }}
        onPress={onPress}
      >
        {children}
      </AnimatedPressable>
    );
  }

  return (
    <View className={cn(variantStyles[variant], className)} {...props}>
      {children}
    </View>
  );
}
