import React, { useState } from "react";
import { View, ScrollView, Pressable } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text, Button, Input, Card, Chip, IconButton, Badge } from "@/components/ui";
import { geminiService } from "@/services/ai/gemini";
import { useFavoritesStore } from "@/store/favoritesStore";
import { generatedRecipeQueries } from "@/services/database/queries";
import { generateId } from "@/utils/formatters";
import type { GeneratedRecipe } from "@/types/recipe";
import { CUISINE_TYPES, DIETARY_RESTRICTIONS } from "@/constants";
import Svg, { Path } from "react-native-svg";

export default function RecipeGeneratorScreen() {
  const insets = useSafeAreaInsets();
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState<string>("");
  const [selectedDietary, setSelectedDietary] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<GeneratedRecipe | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { addFavorite } = useFavoritesStore();

  const addIngredient = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !ingredients.includes(trimmed)) {
      setIngredients([...ingredients, trimmed]);
      setInputValue("");
    }
  };

  const removeIngredient = (ing: string) => {
    setIngredients(ingredients.filter((i) => i !== ing));
  };

  const generate = async () => {
    if (ingredients.length < 2) {
      setError("Please add at least 2 ingredients");
      return;
    }
    setIsGenerating(true);
    setError(null);
    setResult(null);

    try {
      const recipe = await geminiService.generateRecipe(ingredients, {
        cuisine: selectedCuisine || undefined,
        dietary: selectedDietary.length ? selectedDietary : undefined,
      });
      setResult(recipe);
      await generatedRecipeQueries.save(recipe, "recipe_generator");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to generate recipe");
    } finally {
      setIsGenerating(false);
    }
  };

  const saveToFavorites = async () => {
    if (!result) return;
    await addFavorite(generateId(), result, "ai_generated");
  };

  return (
    <View
      className="flex-1 bg-background dark:bg-background-dark"
      style={{ paddingTop: insets.top }}
    >
      {/* Header */}
      <View className="flex-row items-center px-4 py-3">
        <IconButton variant="ghost" onPress={() => router.back()}>
          <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="#1A1A2E" strokeWidth={2}>
            <Path d="M19 12H5M12 19l-7-7 7-7" />
          </Svg>
        </IconButton>
        <Text variant="h3" className="ml-3">
          Recipe Generator
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >
        {!result ? (
          <>
            {/* Ingredient Input */}
            <Text variant="label" className="mb-2">
              Add your ingredients
            </Text>
            <View className="flex-row items-center mb-3">
              <View className="flex-1 mr-2">
                <Input
                  placeholder="Type an ingredient..."
                  value={inputValue}
                  onChangeText={setInputValue}
                  onSubmitEditing={addIngredient}
                  returnKeyType="done"
                />
              </View>
              <Button size="sm" onPress={addIngredient}>
                Add
              </Button>
            </View>

            {/* Ingredient Chips */}
            {ingredients.length > 0 && (
              <View className="flex-row flex-wrap gap-2 mb-6">
                {ingredients.map((ing) => (
                  <Pressable
                    key={ing}
                    onPress={() => removeIngredient(ing)}
                    className="flex-row items-center bg-primary/10 px-3 py-1.5 rounded-full"
                  >
                    <Text variant="bodySmall" className="text-primary mr-1">
                      {ing}
                    </Text>
                    <Text variant="bodySmall" className="text-primary">
                      ×
                    </Text>
                  </Pressable>
                ))}
              </View>
            )}

            {/* Cuisine Preference */}
            <Text variant="label" className="mb-2">
              Cuisine (optional)
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="mb-6"
            >
              {CUISINE_TYPES.slice(0, 12).map((cuisine) => (
                <Chip
                  key={cuisine}
                  label={cuisine}
                  selected={selectedCuisine === cuisine}
                  onPress={() =>
                    setSelectedCuisine(selectedCuisine === cuisine ? "" : cuisine)
                  }
                  className="mr-2"
                />
              ))}
            </ScrollView>

            {/* Dietary Restrictions */}
            <Text variant="label" className="mb-2">
              Dietary restrictions (optional)
            </Text>
            <View className="flex-row flex-wrap gap-2 mb-6">
              {DIETARY_RESTRICTIONS.map((diet) => (
                <Chip
                  key={diet}
                  label={diet}
                  selected={selectedDietary.includes(diet)}
                  onPress={() =>
                    setSelectedDietary(
                      selectedDietary.includes(diet)
                        ? selectedDietary.filter((d) => d !== diet)
                        : [...selectedDietary, diet]
                    )
                  }
                />
              ))}
            </View>

            {error && (
              <Text variant="bodySmall" className="text-red-500 mb-3">
                {error}
              </Text>
            )}

            <Button onPress={generate} loading={isGenerating} size="lg">
              {isGenerating ? "Cooking up a recipe..." : "Generate Recipe"}
            </Button>
          </>
        ) : (
          /* Result Display */
          <>
            <Card className="p-5 mb-4">
              <Text variant="h2" className="mb-2">
                {result.title}
              </Text>
              <Text variant="body" className="text-muted dark:text-muted-dark mb-3">
                {result.description}
              </Text>

              <View className="flex-row flex-wrap gap-2 mb-4">
                <Badge label={result.difficulty} variant="primary" />
                <Badge label={result.cuisine} variant="secondary" />
                <Badge label={`${result.prepTime} prep`} variant="muted" />
                <Badge label={`${result.cookTime} cook`} variant="muted" />
                <Badge label={`${result.servings} servings`} variant="muted" />
              </View>

              {/* Nutrition */}
              <View className="flex-row justify-between bg-navy-50 dark:bg-navy-700 p-3 rounded-xl mb-4">
                <View className="items-center">
                  <Text variant="label" className="text-primary">
                    {result.nutrition.calories}
                  </Text>
                  <Text variant="caption">cal</Text>
                </View>
                <View className="items-center">
                  <Text variant="label">{result.nutrition.protein}</Text>
                  <Text variant="caption">protein</Text>
                </View>
                <View className="items-center">
                  <Text variant="label">{result.nutrition.carbs}</Text>
                  <Text variant="caption">carbs</Text>
                </View>
                <View className="items-center">
                  <Text variant="label">{result.nutrition.fat}</Text>
                  <Text variant="caption">fat</Text>
                </View>
              </View>
            </Card>

            {/* Ingredients */}
            <Card className="p-5 mb-4">
              <Text variant="h3" className="mb-3">
                Ingredients
              </Text>
              {result.ingredients.map((ing, i) => (
                <Text key={i} variant="body" className="mb-1.5">
                  • {ing.quantity} {ing.unit} {ing.name}
                </Text>
              ))}
            </Card>

            {/* Instructions */}
            <Card className="p-5 mb-4">
              <Text variant="h3" className="mb-3">
                Instructions
              </Text>
              {result.instructions.map((step, i) => (
                <View key={i} className="flex-row mb-3">
                  <View className="w-6 h-6 rounded-full bg-primary/10 items-center justify-center mr-3">
                    <Text variant="caption" className="text-primary font-bold">
                      {i + 1}
                    </Text>
                  </View>
                  <Text variant="body" className="flex-1">
                    {step}
                  </Text>
                </View>
              ))}
            </Card>

            {/* Tips */}
            {result.tips.length > 0 && (
              <Card className="p-5 mb-4">
                <Text variant="h3" className="mb-3">
                  Tips
                </Text>
                {result.tips.map((tip, i) => (
                  <Text key={i} variant="bodySmall" className="mb-1.5 text-muted dark:text-muted-dark">
                    💡 {tip}
                  </Text>
                ))}
              </Card>
            )}

            {/* Actions */}
            <View className="flex-row gap-3">
              <Button className="flex-1" onPress={saveToFavorites}>
                Save to Favorites
              </Button>
              <Button
                className="flex-1"
                variant="outline"
                onPress={() => setResult(null)}
              >
                Generate Another
              </Button>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}
