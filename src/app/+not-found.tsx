import React from "react";
import { View } from "react-native";
import { Link, Stack } from "expo-router";
import { Text } from "@/components/ui";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Not Found" }} />
      <View className="flex-1 items-center justify-center bg-background dark:bg-background-dark p-6">
        <Text variant="h1" className="mb-4">
          404
        </Text>
        <Text variant="body" className="text-center text-muted dark:text-muted-dark mb-6">
          This screen doesn't exist.
        </Text>
        <Link href="/(tabs)" className="text-primary font-semibold text-base">
          Go to home screen
        </Link>
      </View>
    </>
  );
}
