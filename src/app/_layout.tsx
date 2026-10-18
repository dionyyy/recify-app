import "../global.css";
import React, { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useColorScheme as useNativewindColorScheme } from "nativewind";
import { useAuthStore } from "@/store/authStore";
import { useFavoritesStore } from "@/store/favoritesStore";
import { useShoppingListStore } from "@/store/shoppingListStore";
import { useAiChatStore } from "@/store/aiChatStore";
import { useMealPlannerStore } from "@/store/mealPlannerStore";
import { useSettingsStore } from "@/store/settingsStore";
import { useColorScheme } from "@/hooks/useColorScheme";
import { QUERY_STALE_TIME, QUERY_GC_TIME } from "@/constants";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: QUERY_STALE_TIME,
      gcTime: QUERY_GC_TIME,
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});

function AppContent() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const segments = useSegments();
  // Drive NativeWind's `dark:` variants from the user's saved preference.
  // tailwind darkMode is "class", so without this every `dark:` class is a
  // no-op. This single sync activates dark mode across every screen.
  const settingsScheme = useSettingsStore((s) => s.colorScheme);
  const { setColorScheme: setNativewindScheme } = useNativewindColorScheme();
  const hydrate = useAuthStore((s) => s.hydrate);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);
  const loadFavorites = useFavoritesStore((s) => s.loadFavorites);
  const loadShoppingItems = useShoppingListStore((s) => s.loadItems);
  const loadChatSessions = useAiChatStore((s) => s.loadSessions);
  const loadMealPlans = useMealPlannerStore((s) => s.loadPlans);

  useEffect(() => {
    hydrate();
    loadFavorites();
    loadShoppingItems();
    loadChatSessions();
    loadMealPlans();
  }, []);

  // Keep NativeWind's color scheme in sync with the saved setting
  // (system / light / dark).
  useEffect(() => {
    setNativewindScheme(settingsScheme);
  }, [settingsScheme, setNativewindScheme]);

  // Route gating: redirect based on auth state once hydration settles.
  useEffect(() => {
    if (isLoading) return;
    const inAuthGroup = segments[0] === "(auth)";
    if (!isAuthenticated && !inAuthGroup) {
      router.replace("/(auth)/login");
    } else if (isAuthenticated && inAuthGroup) {
      router.replace("/(tabs)");
    }
  }, [isLoading, isAuthenticated, segments]);

  // Hold on a splash-style loader until auth state is known, to avoid a
  // flash of the wrong screen.
  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background dark:bg-background-dark">
        <ActivityIndicator size="large" color="#FF6B6B" />
      </View>
    );
  }

  return (
    <>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: colorScheme === "dark" ? "#0F0F1A" : "#FAFBFC",
          },
        }}
      >
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="recipe/[id]"
          options={{ animation: "slide_from_right" }}
        />
        <Stack.Screen
          name="ai/recipe-generator"
          options={{ animation: "slide_from_right" }}
        />
        <Stack.Screen
          name="ai/meal-planner"
          options={{ animation: "slide_from_right" }}
        />
        <Stack.Screen
          name="ai/cooking-assistant"
          options={{ animation: "slide_from_right" }}
        />
        <Stack.Screen
          name="ai/leftover-generator"
          options={{ animation: "slide_from_right" }}
        />
        <Stack.Screen
          name="ai/grocery-list"
          options={{ animation: "slide_from_right" }}
        />
        <Stack.Screen
          name="settings"
          options={{ animation: "slide_from_right" }}
        />
        <Stack.Screen
          name="shopping-list"
          options={{ animation: "slide_from_right" }}
        />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <AppContent />
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
