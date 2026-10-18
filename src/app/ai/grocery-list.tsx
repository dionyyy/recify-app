import React, { useState } from "react";
import { View, ScrollView, Pressable } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text, Button, Card, Input, IconButton, Badge } from "@/components/ui";
import { geminiService } from "@/services/ai/gemini";
import { useShoppingListStore } from "@/store/shoppingListStore";
import { useMealPlannerStore } from "@/store/mealPlannerStore";
import type { GroceryList } from "@/types/meal-plan";
import { GROCERY_CATEGORIES } from "@/constants";
import Svg, { Path } from "react-native-svg";

export default function GroceryListScreen() {
  const insets = useSafeAreaInsets();
  const [inputRecipes, setInputRecipes] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [groceryList, setGroceryList] = useState<GroceryList | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { addItems } = useShoppingListStore();
  const { plans } = useMealPlannerStore();

  const generateFromText = async () => {
    if (!inputRecipes.trim()) {
      setError("Enter recipe names or descriptions");
      return;
    }
    setIsGenerating(true);
    setError(null);
    try {
      const recipes = inputRecipes
        .split("\n")
        .filter(Boolean)
        .map((line) => ({
          title: line.trim(),
          ingredients: [{ name: line.trim(), quantity: "" }],
        }));
      const list = await geminiService.generateGroceryList(recipes);
      setGroceryList(list);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to generate list");
    } finally {
      setIsGenerating(false);
    }
  };

  const generateFromMealPlan = async (planIndex: number) => {
    const plan = plans[planIndex];
    if (!plan) return;
    setIsGenerating(true);
    setError(null);
    try {
      const recipes = plan.days.flatMap((day) =>
        [day.breakfast, day.lunch, day.dinner, day.snack]
          .filter(Boolean)
          .map((meal) => ({
            title: meal.name,
            ingredients: meal.ingredients.map((i) => ({
              name: i,
              quantity: "",
            })),
          })),
      );
      const list = await geminiService.generateGroceryList(recipes);
      setGroceryList(list);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to generate list");
    } finally {
      setIsGenerating(false);
    }
  };

  const saveToShoppingList = async () => {
    if (!groceryList) return;
    await addItems(
      groceryList.items.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        category: item.category,
      })),
    );
    router.replace("/shopping-list");
  };

  // Group items by category
  const groupedItems = groceryList?.items.reduce(
    (acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    },
    {} as Record<string, typeof groceryList.items>,
  );

  return (
    <View
      className="flex-1 bg-background dark:bg-background-dark"
      style={{ paddingTop: insets.top }}
    >
      <View className="flex-row items-center px-4 py-3">
        <IconButton variant="ghost" onPress={() => router.back()}>
          <Svg
            width={24}
            height={24}
            viewBox="0 0 24 24"
            fill="none"
            stroke="#1A1A2E"
            strokeWidth={2}
          >
            <Path d="M19 12H5M12 19l-7-7 7-7" />
          </Svg>
        </IconButton>
        <Text variant="h3" className="ml-3 flex-1">
          Grocery List
        </Text>
        <Pressable
          onPress={() => router.push("/shopping-list")}
          hitSlop={8}
          className="py-2 px-2"
        >
          <Text variant="bodySmall" className="text-primary font-semibold">
            My List
          </Text>
        </Pressable>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}
      >
        {!groceryList ? (
          <>
            <Text
              variant="body"
              className="text-muted dark:text-muted-dark mb-4"
            >
              Generate a smart grocery list from recipes or meal plans
            </Text>

            {/* From Meal Plans */}
            {plans.length > 0 && (
              <View className="mb-6">
                <Text variant="label" className="mb-2">
                  From saved meal plans
                </Text>
                {plans.map((plan, i) => (
                  <Card
                    key={plan.id}
                    className="p-4 mb-2"
                    pressable
                    onPress={() => generateFromMealPlan(i)}
                  >
                    <Text variant="label">{plan.title}</Text>
                    <Text variant="caption">
                      {plan.duration} days • Tap to generate grocery list
                    </Text>
                  </Card>
                ))}
              </View>
            )}

            {/* Manual Input */}
            <Text variant="label" className="mb-2">
              Or enter recipe names (one per line)
            </Text>
            <Input
              variant="textarea"
              placeholder={"Chicken stir fry\nGreek salad\nPasta carbonara"}
              value={inputRecipes}
              onChangeText={setInputRecipes}
              containerClassName="mb-4"
            />

            {error && (
              <Text variant="bodySmall" className="text-red-500 mb-3">
                {error}
              </Text>
            )}

            <Button onPress={generateFromText} loading={isGenerating} size="lg">
              {isGenerating ? "Generating..." : "Generate Grocery List"}
            </Button>
          </>
        ) : (
          <>
            <Text
              variant="body"
              className="text-muted dark:text-muted-dark mb-4"
            >
              {groceryList.items.length} items organized by store section
            </Text>

            {groupedItems &&
              Object.entries(groupedItems).map(([category, items]) => (
                <View key={category} className="mb-5">
                  <Badge
                    label={category}
                    variant="secondary"
                    className="self-start mb-2"
                  />
                  {items.map((item) => (
                    <View
                      key={item.id}
                      className="flex-row items-center justify-between py-2 border-b border-navy-100 dark:border-navy-700"
                    >
                      <Text variant="body">{item.name}</Text>
                      <Text
                        variant="bodySmall"
                        className="text-muted dark:text-muted-dark"
                      >
                        {item.quantity}
                      </Text>
                    </View>
                  ))}
                </View>
              ))}

            <View className="flex-row gap-3 mt-4">
              <Button className="flex-1" onPress={saveToShoppingList}>
                Add to Shopping List
              </Button>
              <Button
                className="flex-1"
                variant="outline"
                onPress={() => setGroceryList(null)}
              >
                Regenerate
              </Button>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}
