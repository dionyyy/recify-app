import React from "react";
import { View, ScrollView, Pressable } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text, Avatar, Card, Divider, Button } from "@/components/ui";
import { useAuthStore } from "@/store/authStore";
import { useSettingsStore } from "@/store/settingsStore";
import { useFavoritesStore } from "@/store/favoritesStore";
import { useMealPlannerStore } from "@/store/mealPlannerStore";
import { capitalize } from "@/utils/formatters";

function SettingsRow({
  label,
  value,
  onPress,
}: {
  label: string;
  value?: string;
  onPress?: () => void;
}) {
  return (
    <Pressable
      className="flex-row items-center justify-between py-3.5"
      onPress={onPress}
    >
      <Text variant="body">{label}</Text>
      <Text variant="bodySmall" className="text-muted dark:text-muted-dark">
        {value || ""}
      </Text>
    </Pressable>
  );
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuthStore();
  const { colorScheme, setColorScheme, units, aiModel, notificationsEnabled } =
    useSettingsStore();
  const { favorites } = useFavoritesStore();
  const plans = useMealPlannerStore((s) => s.plans);

  const handleLogout = async () => {
    await logout();
    router.replace("/(auth)/login");
  };

  const cycleTheme = () => {
    const schemes = ["system", "light", "dark"] as const;
    const currentIndex = schemes.indexOf(colorScheme);
    const next = schemes[(currentIndex + 1) % schemes.length];
    setColorScheme(next);
  };

  return (
    <ScrollView
      className="flex-1 bg-background dark:bg-background-dark"
      contentContainerStyle={{
        paddingTop: insets.top + 16,
        paddingBottom: 100,
      }}
    >
      <View className="px-4">
        <Text variant="h1" className="mb-6">
          Profile
        </Text>

        {/* User Info */}
        <Card className="p-5 mb-6">
          <View className="flex-row items-center">
            <Avatar name={user?.name} size="lg" />
            <View className="ml-4 flex-1">
              <Text variant="h3">{user?.name || "Guest"}</Text>
              <Text
                variant="bodySmall"
                className="text-muted dark:text-muted-dark"
              >
                {user?.email || ""}
              </Text>
            </View>
          </View>
        </Card>

        {/* Stats */}
        <View className="flex-row mb-6">
          <Card className="flex-1 p-4 mr-2 items-center">
            <Text variant="h2" className="text-primary">
              {favorites.length}
            </Text>
            <Text variant="caption">Favorites</Text>
          </Card>
          <Card className="flex-1 p-4 ml-2 items-center">
            <Text variant="h2" className="text-secondary">
              {plans.length}
            </Text>
            <Text variant="caption">Meal Plans</Text>
          </Card>
        </View>

        {/* Settings */}
        <Card className="p-4 mb-6">
          <Text
            variant="label"
            className="mb-2 text-muted dark:text-muted-dark"
          >
            PREFERENCES
          </Text>
          <SettingsRow
            label="Appearance"
            value={capitalize(colorScheme)}
            onPress={cycleTheme}
          />
          <Divider className="my-0" />
          <SettingsRow
            label="Units"
            value={capitalize(units)}
            onPress={() => router.push("/settings")}
          />
          <Divider className="my-0" />
          <SettingsRow
            label="AI Model"
            value={aiModel === "pro" ? "Gemini Pro" : "Gemini Flash"}
            onPress={() => router.push("/settings")}
          />
          <Divider className="my-0" />
          <SettingsRow
            label="Notifications"
            value={notificationsEnabled ? "On" : "Off"}
            onPress={() => router.push("/settings")}
          />
          <Divider className="my-0" />
          <SettingsRow
            label="All Settings"
            value="›"
            onPress={() => router.push("/settings")}
          />
        </Card>

        {/* Logout */}
        <Button variant="ghost" onPress={handleLogout} className="mt-4">
          Sign Out
        </Button>
      </View>
    </ScrollView>
  );
}
