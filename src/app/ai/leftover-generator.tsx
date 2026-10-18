import React, { useState } from "react";
import { View, ScrollView, Pressable, Dimensions } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text, Button, Card, Chip, IconButton, Badge } from "@/components/ui";
import { geminiService } from "@/services/ai/gemini";
import { useFavoritesStore } from "@/store/favoritesStore";
import { generateId } from "@/utils/formatters";
import type { GeneratedRecipe } from "@/types/recipe";
import { INGREDIENT_CATEGORIES } from "@/constants";
import Svg, { Path } from "react-native-svg";

const { width } = Dimensions.get("window");

export default function LeftoverGeneratorScreen() {
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<GeneratedRecipe[]>([]);
  const [activeCard, setActiveCard] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const { addFavorite } = useFavoritesStore();

  const toggle = (item: string) => {
    setSelected((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const generate = async () => {
    if (selected.length < 2) {
      setError("Select at least 2 ingredients");
      return;
    }
    setIsGenerating(true);
    setError(null);
    try {
      const recipes = await geminiService.generateFromLeftovers(selected);
      setResults(recipes);
      setActiveCard(0);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to generate recipes");
    } finally {
      setIsGenerating(false);
    }
  };

  const currentRecipe = results[activeCard];

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
        <Text variant="h3" className="ml-3">Leftover Recipes</Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}
      >
        {results.length === 0 ? (
          <>
            <Text variant="body" className="text-muted dark:text-muted-dark mb-4">
              What's left in your fridge? Select ingredients below.
            </Text>

            {Object.entries(INGREDIENT_CATEGORIES).map(([category, items]) => (
              <View key={category} className="mb-5">
                <Text variant="label" className="mb-2 capitalize">{category}</Text>
                <View className="flex-row flex-wrap gap-2">
                  {items.map((item) => (
                    <Chip
                      key={item}
                      label={item}
                      selected={selected.includes(item)}
                      onPress={() => toggle(item)}
                    />
                  ))}
                </View>
              </View>
            ))}

            {selected.length > 0 && (
              <View className="bg-primary/10 rounded-xl p-3 mb-4">
                <Text variant="bodySmall">
                  Selected: {selected.join(", ")}
                </Text>
              </View>
            )}

            {error && (
              <Text variant="bodySmall" className="text-red-500 mb-3">{error}</Text>
            )}

            <Button onPress={generate} loading={isGenerating} size="lg">
              {isGenerating ? "Finding recipes..." : `Find Recipes (${selected.length} items)`}
            </Button>
          </>
        ) : (
          <>
            {/* Recipe Card Navigation */}
            <View className="flex-row justify-center gap-2 mb-4">
              {results.map((_, i) => (
                <Pressable
                  key={i}
                  onPress={() => setActiveCard(i)}
                  className={`w-3 h-3 rounded-full ${
                    activeCard === i ? "bg-primary" : "bg-navy-200 dark:bg-navy-600"
                  }`}
                />
              ))}
            </View>

            {currentRecipe && (
              <Card className="p-5 mb-4">
                <View className="flex-row items-center justify-between mb-2">
                  <Text variant="h3" className="flex-1">{currentRecipe.title}</Text>
                  {selected.length ===
                    currentRecipe.ingredients.filter((i) =>
                      selected.some(
                        (s) => i.name.toLowerCase().includes(s.toLowerCase())
                      )
                    ).length && (
                    <Badge label="Uses All!" variant="success" size="sm" />
                  )}
                </View>

                <Text variant="bodySmall" className="text-muted dark:text-muted-dark mb-3">
                  {currentRecipe.description}
                </Text>

                <View className="flex-row flex-wrap gap-2 mb-4">
                  <Badge label={currentRecipe.difficulty} variant="primary" />
                  <Badge label={`${currentRecipe.prepTime} prep`} variant="muted" />
                  <Badge label={`${currentRecipe.cookTime} cook`} variant="muted" />
                </View>

                <Text variant="label" className="mb-2">Ingredients</Text>
                {currentRecipe.ingredients.map((ing, i) => (
                  <Text key={i} variant="bodySmall" className="mb-1">
                    • {ing.quantity} {ing.unit} {ing.name}
                  </Text>
                ))}

                <Text variant="label" className="mt-4 mb-2">Instructions</Text>
                {currentRecipe.instructions.map((step, i) => (
                  <View key={i} className="flex-row mb-2">
                    <Text variant="bodySmall" className="text-primary font-bold mr-2">
                      {i + 1}.
                    </Text>
                    <Text variant="bodySmall" className="flex-1">{step}</Text>
                  </View>
                ))}
              </Card>
            )}

            {/* Navigation & Actions */}
            <View className="flex-row gap-2 mb-4">
              <Button
                variant="ghost"
                className="flex-1"
                disabled={activeCard === 0}
                onPress={() => setActiveCard((p) => p - 1)}
              >
                ← Previous
              </Button>
              <Button
                variant="ghost"
                className="flex-1"
                disabled={activeCard === results.length - 1}
                onPress={() => setActiveCard((p) => p + 1)}
              >
                Next →
              </Button>
            </View>

            <View className="flex-row gap-3">
              <Button
                className="flex-1"
                onPress={() => {
                  if (currentRecipe) addFavorite(generateId(), currentRecipe, "ai_generated");
                }}
              >
                Save
              </Button>
              <Button className="flex-1" variant="outline" onPress={() => setResults([])}>
                Start Over
              </Button>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}
