import React, { useState } from "react";
import { View, ScrollView, Pressable } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text, Button, Card, Chip, Input, IconButton, Badge } from "@/components/ui";
import { geminiService } from "@/services/ai/gemini";
import { useMealPlannerStore } from "@/store/mealPlannerStore";
import { CUISINE_TYPES, DIETARY_RESTRICTIONS, MEAL_PLAN_DURATIONS } from "@/constants";
import type { MealPlan, MealPlanConfig } from "@/types/meal-plan";
import Svg, { Path } from "react-native-svg";

export default function MealPlannerScreen() {
  const insets = useSafeAreaInsets();
  const { savePlan, isGenerating, setIsGenerating } = useMealPlannerStore();

  // Config state
  const [duration, setDuration] = useState<7 | 14 | 30>(7);
  const [dailyCalories, setDailyCalories] = useState("2000");
  const [budget, setBudget] = useState<"low" | "medium" | "high">("medium");
  const [cuisines, setCuisines] = useState<string[]>([]);
  const [dietary, setDietary] = useState<string[]>([]);

  // Result state
  const [plan, setPlan] = useState<MealPlan | null>(null);
  const [selectedDay, setSelectedDay] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const generate = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const config: MealPlanConfig = {
        duration,
        dailyCalories: parseInt(dailyCalories) || 2000,
        budget,
        cuisinePreferences: cuisines,
        dietaryRestrictions: dietary,
        allergies: [],
      };
      const result = await geminiService.generateMealPlan(config);
      setPlan(result);
      setSelectedDay(0);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to generate meal plan");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (plan) {
      await savePlan(plan);
    }
  };

  const currentDay = plan?.days?.[selectedDay];

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
        <Text variant="h3" className="ml-3">Meal Planner</Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}
      >
        {!plan ? (
          <>
            {/* Duration */}
            <Text variant="label" className="mb-2">Duration</Text>
            <View className="flex-row gap-2 mb-5">
              {MEAL_PLAN_DURATIONS.map((d) => (
                <Chip
                  key={d}
                  label={`${d} days`}
                  selected={duration === d}
                  onPress={() => setDuration(d)}
                />
              ))}
            </View>

            {/* Calories */}
            <Input
              label="Daily calorie target"
              value={dailyCalories}
              onChangeText={setDailyCalories}
              keyboardType="numeric"
              containerClassName="mb-5"
            />

            {/* Budget */}
            <Text variant="label" className="mb-2">Budget</Text>
            <View className="flex-row gap-2 mb-5">
              {(["low", "medium", "high"] as const).map((b) => (
                <Chip
                  key={b}
                  label={b.charAt(0).toUpperCase() + b.slice(1)}
                  selected={budget === b}
                  onPress={() => setBudget(b)}
                />
              ))}
            </View>

            {/* Cuisine */}
            <Text variant="label" className="mb-2">Cuisine preferences</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-5">
              {CUISINE_TYPES.slice(0, 10).map((c) => (
                <Chip
                  key={c}
                  label={c}
                  selected={cuisines.includes(c)}
                  onPress={() =>
                    setCuisines(
                      cuisines.includes(c)
                        ? cuisines.filter((x) => x !== c)
                        : [...cuisines, c]
                    )
                  }
                  className="mr-2"
                />
              ))}
            </ScrollView>

            {/* Dietary */}
            <Text variant="label" className="mb-2">Dietary restrictions</Text>
            <View className="flex-row flex-wrap gap-2 mb-6">
              {DIETARY_RESTRICTIONS.map((d) => (
                <Chip
                  key={d}
                  label={d}
                  selected={dietary.includes(d)}
                  onPress={() =>
                    setDietary(
                      dietary.includes(d)
                        ? dietary.filter((x) => x !== d)
                        : [...dietary, d]
                    )
                  }
                />
              ))}
            </View>

            {error && (
              <Text variant="bodySmall" className="text-red-500 mb-3">{error}</Text>
            )}

            <Button onPress={generate} loading={isGenerating} size="lg">
              {isGenerating ? "Generating plan..." : "Generate Meal Plan"}
            </Button>
          </>
        ) : (
          <>
            {/* Day Selector */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
              {plan.days.map((day, i) => (
                <Pressable
                  key={i}
                  onPress={() => setSelectedDay(i)}
                  className={`w-12 h-12 rounded-full items-center justify-center mr-2 ${
                    selectedDay === i ? "bg-primary" : "bg-navy-100 dark:bg-navy-700"
                  }`}
                >
                  <Text
                    variant="bodySmall"
                    className={`font-bold ${selectedDay === i ? "text-white" : ""}`}
                  >
                    {i + 1}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>

            {currentDay && (
              <>
                <Text variant="h3" className="mb-3">Day {selectedDay + 1}</Text>
                <Badge
                  label={`~${currentDay.totalCalories} kcal total`}
                  variant="secondary"
                  className="self-start mb-4"
                />

                {(["breakfast", "lunch", "dinner", "snack"] as const).map((mealType) => {
                  const meal = currentDay[mealType];
                  if (!meal) return null;
                  return (
                    <Card key={mealType} className="p-4 mb-3">
                      <Text variant="caption" className="text-primary uppercase font-bold mb-1">
                        {mealType}
                      </Text>
                      <Text variant="label" className="mb-1">{meal.name}</Text>
                      <Text variant="bodySmall" className="text-muted dark:text-muted-dark mb-2">
                        {meal.description}
                      </Text>
                      <View className="flex-row gap-2">
                        <Badge label={`${meal.calories} kcal`} variant="muted" size="sm" />
                        <Badge label={meal.prepTime} variant="muted" size="sm" />
                      </View>
                    </Card>
                  );
                })}
              </>
            )}

            <View className="flex-row gap-3 mt-4">
              <Button className="flex-1" onPress={handleSave}>
                Save Plan
              </Button>
              <Button className="flex-1" variant="outline" onPress={() => setPlan(null)}>
                New Plan
              </Button>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}
