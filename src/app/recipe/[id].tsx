import React, { useState } from "react";
import { View, ScrollView, Pressable, Linking, StyleSheet } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
  useAnimatedStyle,
  interpolate,
} from "react-native-reanimated";
import { Text, Badge, Button, Skeleton, IconButton } from "@/components/ui";
import { useRecipeDetail } from "@/features/recipe/hooks/useRecipeQueries";
import { useFavoritesStore } from "@/store/favoritesStore";
import { useHaptics } from "@/hooks/useHaptics";
import Svg, { Path } from "react-native-svg";

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { data: meal, isLoading } = useRecipeDetail(id);
  const { isFavorite, addFavorite, removeFavorite } = useFavoritesStore();
  const haptics = useHaptics();
  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(
    new Set(),
  );

  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const headerStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [150, 250], [0, 1]),
  }));

  const isFav = meal ? isFavorite(meal.id) : false;

  const toggleFavorite = () => {
    if (!meal) return;
    haptics.medium();
    if (isFav) {
      removeFavorite(meal.id);
    } else {
      addFavorite(meal.id, meal, "api");
    }
  };

  const toggleIngredient = (index: number) => {
    haptics.selection();
    setCheckedIngredients((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  if (isLoading || !meal) {
    return (
      <View className="flex-1 bg-background dark:bg-background-dark">
        <Skeleton width="100%" height={300} borderRadius={0} />
        <View className="p-4">
          <Skeleton width="80%" height={28} className="mb-3" />
          <Skeleton width="50%" height={20} className="mb-6" />
          <Skeleton width="100%" height={200} />
        </View>
      </View>
    );
  }

  const instructions = meal.instructions
    .split(/\r?\n/)
    .filter((step) => step.trim().length > 0);

  return (
    <View className="flex-1 bg-background dark:bg-background-dark">
      {/* Floating Header */}
      <Animated.View
        style={[headerStyle]}
        className="absolute top-0 left-0 right-0 z-10 bg-surface/95 dark:bg-surface-dark/95"
      >
        <View
          className="flex-row items-center px-4 pb-3"
          style={{ paddingTop: insets.top }}
        >
          <IconButton variant="ghost" onPress={() => router.back()}>
            <Svg
              width={24}
              height={24}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <Path d="M19 12H5M12 19l-7-7 7-7" />
            </Svg>
          </IconButton>
          <Text
            variant="label"
            className="flex-1 text-center"
            numberOfLines={1}
          >
            {meal.name}
          </Text>
          <IconButton variant="ghost" onPress={toggleFavorite}>
            <Svg
              width={24}
              height={24}
              viewBox="0 0 24 24"
              fill={isFav ? "#FF6B6B" : "none"}
              stroke="#FF6B6B"
              strokeWidth={2}
            >
              <Path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </Svg>
          </IconButton>
        </View>
      </Animated.View>

      {/* Back Button Overlay */}
      <View className="absolute z-20 left-4" style={{ top: insets.top + 8 }}>
        <IconButton
          variant="default"
          onPress={() => router.back()}
          className="bg-black/30"
        >
          <Svg
            width={22}
            height={22}
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth={2.5}
          >
            <Path d="M19 12H5M12 19l-7-7 7-7" />
          </Svg>
        </IconButton>
      </View>

      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Hero Image — keep a solid backdrop + reserved height so a
            slow/failed image never collapses and pushes content under the
            status bar. */}
        <View className="w-full h-72 bg-navy-200 dark:bg-navy-800">
          <Image
            source={{ uri: meal.thumbnail }}
            style={StyleSheet.absoluteFill}
            contentFit="cover"
            transition={200}
          />
        </View>

        {/* Content */}
        <View className="px-4 -mt-6">
          <View className="bg-surface dark:bg-surface-dark rounded-3xl p-5 shadow-sm">
            {/* Title */}
            <Text variant="h2" className="mb-2">
              {meal.name}
            </Text>

            {/* Badges */}
            <View className="flex-row flex-wrap gap-2 mb-4">
              <Badge label={meal.category} variant="primary" />
              <Badge label={meal.area} variant="secondary" />
              {meal.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} label={tag} variant="muted" />
              ))}
            </View>

            {/* Favorite Button */}
            <Button
              variant={isFav ? "outline" : "primary"}
              onPress={toggleFavorite}
              className="mb-4"
            >
              {isFav ? "Remove from Favorites" : "Add to Favorites"}
            </Button>

            {/* YouTube */}
            {meal.youtube && (
              <Button
                variant="ghost"
                onPress={() => Linking.openURL(meal.youtube!)}
                className="mb-4"
              >
                Watch on YouTube
              </Button>
            )}
          </View>

          {/* Ingredients */}
          <View className="mt-5">
            <Text variant="h3" className="mb-3">
              Ingredients ({meal.ingredients.length})
            </Text>
            {meal.ingredients.map((ing, index) => (
              <Pressable
                key={index}
                onPress={() => toggleIngredient(index)}
                className="flex-row items-center py-2.5 border-b border-navy-100 dark:border-navy-700"
              >
                <View
                  className={`w-6 h-6 rounded-full border-2 mr-3 items-center justify-center ${
                    checkedIngredients.has(index)
                      ? "bg-secondary border-secondary"
                      : "border-navy-300 dark:border-navy-500"
                  }`}
                >
                  {checkedIngredients.has(index) && (
                    <Svg
                      width={14}
                      height={14}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth={3}
                    >
                      <Path d="M5 13l4 4L19 7" />
                    </Svg>
                  )}
                </View>
                <Text
                  variant="body"
                  className={
                    checkedIngredients.has(index)
                      ? "line-through text-muted"
                      : ""
                  }
                >
                  {ing.measure} {ing.name}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Instructions */}
          <View className="mt-6">
            <Text variant="h3" className="mb-3">
              Instructions
            </Text>
            {instructions.map((step, index) => (
              <View key={index} className="flex-row mb-4">
                <View className="w-7 h-7 rounded-full bg-primary/10 items-center justify-center mr-3 mt-0.5">
                  <Text variant="caption" className="text-primary font-bold">
                    {index + 1}
                  </Text>
                </View>
                <Text variant="body" className="flex-1">
                  {step.trim()}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </Animated.ScrollView>
    </View>
  );
}
