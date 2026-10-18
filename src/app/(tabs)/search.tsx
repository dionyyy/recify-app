import React, { useState, useCallback, useEffect } from "react";
import { View, FlatList } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text, Input, Card, Skeleton, Chip, EmptyState } from "@/components/ui";
import {
  useSearchMeals,
  useCategories,
  useFilterByCategory,
} from "@/features/recipe/hooks/useRecipeQueries";
import { useDebouncedSearch } from "@/features/search/hooks/useSearch";
import type { MealSummary, Meal } from "@/types/recipe";
import Svg, { Path } from "react-native-svg";

function SearchIcon() {
  return (
    <Svg
      width={20}
      height={20}
      viewBox="0 0 24 24"
      fill="none"
      stroke="#94A3B8"
      strokeWidth={2}
    >
      <Path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </Svg>
  );
}

function RecipeCard({ meal }: { meal: Meal | MealSummary }) {
  const name = meal.name;
  const thumbnail = meal.thumbnail;
  const category = "category" in meal ? meal.category : undefined;
  const area = "area" in meal ? meal.area : undefined;

  return (
    <Card
      pressable
      onPress={() => router.push(`/recipe/${meal.id}`)}
      className="flex-1 m-1.5 overflow-hidden"
    >
      <Image
        source={{ uri: thumbnail }}
        style={{ width: "100%", height: 128 }}
        className="rounded-t-2xl bg-navy-200 dark:bg-navy-800"
        contentFit="cover"
        transition={200}
      />
      <View className="p-3">
        <Text variant="bodySmall" className="font-semibold" numberOfLines={2}>
          {name}
        </Text>
        {(category || area) && (
          <Text variant="caption" className="mt-1">
            {[category, area].filter(Boolean).join(" • ")}
          </Text>
        )}
      </View>
    </Card>
  );
}

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ category?: string }>();
  const [selectedCategory, setSelectedCategory] = useState(
    params.category || "",
  );
  const { query, setQuery, debouncedQuery } = useDebouncedSearch();
  const { data: categories } = useCategories();

  // Keep selection in sync with the incoming route param (e.g. from Home).
  useEffect(() => {
    if (params.category && params.category !== selectedCategory) {
      setSelectedCategory(params.category);
      setQuery("");
    }
  }, [params.category]);

  const hasQuery = debouncedQuery.length > 2;

  // Text search and category browsing are mutually exclusive sources.
  const { data: searchResults, isLoading: isSearching } =
    useSearchMeals(debouncedQuery);
  const { data: categoryResults, isLoading: isFiltering } = useFilterByCategory(
    hasQuery ? "" : selectedCategory,
  );

  const handleCategoryPress = useCallback(
    (category: string) => {
      setSelectedCategory((prev) => (prev === category ? "" : category));
      setQuery("");
    },
    [setQuery],
  );

  const handleQueryChange = useCallback(
    (text: string) => {
      setQuery(text);
      // Typing a search clears any active category browse.
      if (text.length > 0) setSelectedCategory("");
    },
    [setQuery],
  );

  const isLoading = hasQuery ? isSearching : !!selectedCategory && isFiltering;
  const results: (Meal | MealSummary)[] = hasQuery
    ? searchResults || []
    : selectedCategory
      ? categoryResults || []
      : [];

  return (
    <View
      className="flex-1 bg-background dark:bg-background-dark"
      style={{ paddingTop: insets.top + 8 }}
    >
      {/* Search Bar */}
      <View className="px-4 mb-4">
        <Input
          variant="search"
          placeholder="Search recipes..."
          value={query}
          onChangeText={handleQueryChange}
          leftIcon={<SearchIcon />}
        />
      </View>

      {/* Category Filters */}
      <View className="mb-4">
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categories || []}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 16 }}
          renderItem={({ item }) => (
            <Chip
              label={item.name}
              selected={selectedCategory === item.name}
              onPress={() => handleCategoryPress(item.name)}
              className="mr-2"
            />
          )}
        />
      </View>

      {/* Results */}
      {isLoading ? (
        <View className="flex-row flex-wrap px-2.5">
          {Array.from({ length: 6 }).map((_, i) => (
            <View key={i} className="w-1/2 p-1.5">
              <Skeleton width="100%" height={180} borderRadius={16} />
            </View>
          ))}
        </View>
      ) : results.length > 0 ? (
        <FlatList
          data={results}
          numColumns={2}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 10, paddingBottom: 100 }}
          renderItem={({ item }) => <RecipeCard meal={item} />}
        />
      ) : hasQuery || selectedCategory ? (
        <EmptyState
          title="No recipes found"
          message={
            selectedCategory
              ? `No recipes in ${selectedCategory}. Try another category.`
              : "Try different keywords or browse categories"
          }
        />
      ) : (
        <EmptyState
          title="Discover recipes"
          message="Search by name or select a category to browse"
        />
      )}
    </View>
  );
}
