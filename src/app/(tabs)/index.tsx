import React from "react";
import {
  View,
  ScrollView,
  Pressable,
  Dimensions,
  StyleSheet,
} from "react-native";
import { router } from "expo-router";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FlashList } from "@shopify/flash-list";
import { Text, Card, Badge, Skeleton, Avatar } from "@/components/ui";
import { useAuthStore } from "@/store/authStore";
import {
  useRandomMeal,
  useCategories,
  useFilterByCategory,
} from "@/features/recipe/hooks/useRecipeQueries";
import { getGreeting } from "@/utils/formatters";
import { cn } from "@/utils/helpers";

const { width } = Dimensions.get("window");

function HeroSection() {
  const { data: randomMeal, isLoading } = useRandomMeal();

  if (isLoading || !randomMeal) {
    return (
      <View className="mx-4 mb-6">
        <Skeleton width={width - 32} height={220} borderRadius={24} />
      </View>
    );
  }

  return (
    <Pressable
      onPress={() => router.push(`/recipe/${randomMeal.id}`)}
      className="mx-4 mb-6"
    >
      <View className="rounded-3xl overflow-hidden h-56 bg-navy-200 dark:bg-navy-800">
        <Image
          source={{ uri: randomMeal.thumbnail }}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          transition={200}
        />
        <View className="absolute inset-0 bg-black/40 justify-end p-5">
          <Badge
            label="Today's Pick"
            variant="primary"
            className="self-start mb-2"
          />
          <Text variant="h3" className="text-white">
            {randomMeal.name}
          </Text>
          <Text variant="bodySmall" className="text-white/80 mt-1">
            {randomMeal.area} • {randomMeal.category}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

function CategoriesSection() {
  const { data: categories, isLoading } = useCategories();

  return (
    <View className="mb-6">
      <Text variant="h3" className="px-4 mb-3">
        Categories
      </Text>
      {isLoading ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="px-4"
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton
              key={i}
              width={80}
              height={36}
              borderRadius={18}
              className="mr-2"
            />
          ))}
        </ScrollView>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="px-4"
        >
          {categories?.map((cat) => (
            <Pressable
              key={cat.id}
              onPress={() => router.push(`/search?category=${cat.name}`)}
              className="bg-navy-100 dark:bg-navy-700 px-4 py-2 rounded-full mr-2"
            >
              <Text variant="bodySmall" className="font-medium">
                {cat.name}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

function PopularSection() {
  const { data: meals, isLoading } = useFilterByCategory("Seafood");

  return (
    <View className="mb-6">
      <Text variant="h3" className="px-4 mb-3">
        Popular Recipes
      </Text>
      {isLoading ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="px-4"
        >
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton
              key={i}
              width={160}
              height={200}
              borderRadius={16}
              className="mr-3"
            />
          ))}
        </ScrollView>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="px-4"
        >
          {meals?.slice(0, 10).map((meal) => (
            <Card
              key={meal.id}
              pressable
              onPress={() => router.push(`/recipe/${meal.id}`)}
              className="mr-3 w-40 overflow-hidden"
            >
              <Image
                source={{ uri: meal.thumbnail }}
                style={{ width: 160, height: 112 }}
                className="rounded-t-2xl bg-navy-200 dark:bg-navy-800"
                contentFit="cover"
                transition={200}
              />
              <View className="p-3">
                <Text
                  variant="bodySmall"
                  className="font-semibold"
                  numberOfLines={2}
                >
                  {meal.name}
                </Text>
              </View>
            </Card>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

function AiCtaSection() {
  return (
    <View className="mx-4 mb-8">
      <Card
        pressable
        onPress={() => router.push("/(tabs)/ai")}
        className="p-5 bg-gradient-to-r"
      >
        <View className="bg-secondary/10 dark:bg-secondary/20 rounded-2xl p-5">
          <Text
            variant="h3"
            className="text-secondary-dark dark:text-secondary-light mb-1"
          >
            AI Chef Assistant
          </Text>
          <Text
            variant="bodySmall"
            className="text-navy-600 dark:text-navy-300 mb-3"
          >
            Generate recipes, plan meals, and get cooking tips powered by AI
          </Text>
          <View className="bg-secondary px-4 py-2 rounded-full self-start">
            <Text variant="bodySmall" className="text-white font-semibold">
              Explore AI Features →
            </Text>
          </View>
        </View>
      </Card>
    </View>
  );
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const user = useAuthStore((s) => s.user);

  return (
    <ScrollView
      className="flex-1 bg-background dark:bg-background-dark"
      contentContainerStyle={{
        paddingTop: insets.top + 16,
        paddingBottom: 100,
      }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 mb-6">
        <View>
          <Text variant="bodySmall" className="text-muted dark:text-muted-dark">
            {getGreeting()}
          </Text>
          <Text variant="h2">{user?.name || "Chef"}</Text>
        </View>
        <Pressable onPress={() => router.push("/(tabs)/profile")}>
          <Avatar name={user?.name} size="md" />
        </Pressable>
      </View>

      <HeroSection />
      <CategoriesSection />
      <PopularSection />
      <AiCtaSection />
    </ScrollView>
  );
}
