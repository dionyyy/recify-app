import React from "react";
import { View, ScrollView, Switch } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text, Card, Divider, IconButton, Chip } from "@/components/ui";
import { useSettingsStore } from "@/store/settingsStore";
import type { ColorScheme } from "@/theme/colors";
import Svg, { Path } from "react-native-svg";

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const {
    colorScheme,
    units,
    notificationsEnabled,
    aiModel,
    setColorScheme,
    setUnits,
    setNotificationsEnabled,
    setAiModel,
  } = useSettingsStore();

  return (
    <View
      className="flex-1 bg-background dark:bg-background-dark"
      style={{ paddingTop: insets.top }}
    >
      <View className="flex-row items-center px-4 py-3">
        <IconButton variant="ghost" onPress={() => router.back()}>
          <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="#1A1A2E" strokeWidth={2}>
            <Path d="M19 12H5M12 19l-7-7 7-7" />
          </Svg>
        </IconButton>
        <Text variant="h3" className="ml-3">Settings</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}>
        {/* Appearance */}
        <Card className="p-4 mb-4">
          <Text variant="label" className="mb-3 text-muted dark:text-muted-dark">
            APPEARANCE
          </Text>
          <Text variant="body" className="mb-2">Color Theme</Text>
          <View className="flex-row gap-2 mb-4">
            {(["system", "light", "dark"] as ColorScheme[]).map((scheme) => (
              <Chip
                key={scheme}
                label={scheme.charAt(0).toUpperCase() + scheme.slice(1)}
                selected={colorScheme === scheme}
                onPress={() => setColorScheme(scheme)}
              />
            ))}
          </View>
        </Card>

        {/* Preferences */}
        <Card className="p-4 mb-4">
          <Text variant="label" className="mb-3 text-muted dark:text-muted-dark">
            PREFERENCES
          </Text>

          <View className="flex-row items-center justify-between mb-3">
            <Text variant="body">Measurement Units</Text>
            <View className="flex-row gap-2">
              <Chip
                label="Metric"
                selected={units === "metric"}
                onPress={() => setUnits("metric")}
              />
              <Chip
                label="Imperial"
                selected={units === "imperial"}
                onPress={() => setUnits("imperial")}
              />
            </View>
          </View>

          <Divider className="my-2" />

          <View className="flex-row items-center justify-between">
            <Text variant="body">Notifications</Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ true: "#4ECDC4" }}
            />
          </View>
        </Card>

        {/* AI Settings */}
        <Card className="p-4 mb-4">
          <Text variant="label" className="mb-3 text-muted dark:text-muted-dark">
            AI MODEL
          </Text>
          <Text variant="bodySmall" className="text-muted dark:text-muted-dark mb-3">
            Choose the AI model for recipe generation
          </Text>
          <View className="flex-row gap-2">
            <Chip
              label="Gemini Flash (Fast)"
              selected={aiModel === "flash"}
              onPress={() => setAiModel("flash")}
            />
            <Chip
              label="Gemini Pro (Better)"
              selected={aiModel === "pro"}
              onPress={() => setAiModel("pro")}
            />
          </View>
        </Card>

        {/* About */}
        <Card className="p-4">
          <Text variant="label" className="mb-2 text-muted dark:text-muted-dark">
            ABOUT
          </Text>
          <Text variant="body">Recify v1.0.0</Text>
          <Text variant="bodySmall" className="text-muted dark:text-muted-dark mt-1">
            AI-powered recipe app built with Expo & Gemini
          </Text>
        </Card>
      </ScrollView>
    </View>
  );
}
