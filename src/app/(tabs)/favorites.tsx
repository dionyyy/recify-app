import React from "react";
import { View, FlatList, Pressable } from "react-native";
import { router } from "expo-router";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text, Card, EmptyState } from "@/components/ui";
import { useFavoritesStore } from "@/store/favoritesStore";
import type { Meal, GeneratedRecipe } from "@/types/recipe";
import Svg, { Path } from "react-native-svg";

function HeartIcon() {
  return (
    <Svg
      width={48}
      height={48}
      viewBox="0 0 24 24"
      fill="none"
      stroke="#FF6B6B"
      strokeWidth={1.5}
    >
      <Path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </Svg>
  );
}

function isMeal(recipe: Meal | GeneratedRecipe): recipe is Meal {
  return "id" in recipe && "thumbnail" in recipe;
}

export default function FavoritesScreen() {
  const insets = useSafeAreaInsets();
  const { favorites, isLoaded } = useFavoritesStore();

  if (isLoaded && favorites.length === 0) {
    return (
      <View
        className="flex-1 bg-background dark:bg-background-dark"
        style={{ paddingTop: insets.top }}
      >
        <View className="px-4 pt-4 mb-4">
          <Text variant="h1">Favorites</Text>
        </View>
        <EmptyState
          icon={<HeartIcon />}
          title="No favorites yet"
          message="Save recipes you love and they'll show up here"
          actionLabel="Browse Recipes"
          onAction={() => router.push("/(tabs)/search")}
        />
      </View>
    );
  }

  return (
    <View
      className="flex-1 bg-background dark:bg-background-dark"
      style={{ paddingTop: insets.top }}
    >
      <View className="px-4 pt-4 mb-4">
        <Text variant="h1">Favorites</Text>
        <Text
          variant="bodySmall"
          className="text-muted dark:text-muted-dark mt-1"
        >
          {favorites.length} saved recipe{favorites.length !== 1 ? "s" : ""}
        </Text>
      </View>

      <FlatList
        data={favorites}
        numColumns={2}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 10, paddingBottom: 100 }}
        renderItem={({ item }) => {
          const recipe = item.recipe;
          const name = isMeal(recipe) ? recipe.name : recipe.title;
          const thumbnail = isMeal(recipe) ? recipe.thumbnail : null;

          return (
            <Card
              pressable
              onPress={() => {
                if (isMeal(recipe)) {
                  router.push(`/recipe/${recipe.id}`);
                }
              }}
              className="flex-1 m-1.5 overflow-hidden"
            >
              {thumbnail ? (
                <Image
                  source={{ uri: thumbnail }}
                  style={{ width: "100%", height: 128 }}
                  className="rounded-t-2xl bg-navy-200 dark:bg-navy-800"
                  contentFit="cover"
                  transition={200}
                />
              ) : (
                <View className="w-full h-32 rounded-t-2xl bg-primary/10 items-center justify-center">
                  <Text variant="h3" className="text-primary">
                    AI
                  </Text>
                </View>
              )}
              <View className="p-3">
                <Text
                  variant="bodySmall"
                  className="font-semibold"
                  numberOfLines={2}
                >
                  {name}
                </Text>
                <Text variant="caption" className="mt-1">
                  {item.source === "ai_generated"
                    ? "AI Generated"
                    : "TheMealDB"}
                </Text>
              </View>
            </Card>
          );
        }}
      />
    </View>
  );
}
