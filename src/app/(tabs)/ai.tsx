import React from "react";
import { View, ScrollView, Pressable } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text, Card } from "@/components/ui";
import Svg, { Path } from "react-native-svg";

interface AiFeatureCardProps {
  title: string;
  description: string;
  icon: string;
  color: string;
  route: string;
  available?: boolean;
}

function AiFeatureCard({
  title,
  description,
  icon,
  color,
  route,
  available = true,
}: AiFeatureCardProps) {
  return (
    <Card
      pressable={available}
      onPress={available ? () => router.push(route as any) : undefined}
      className="p-4 mb-3"
    >
      <View className="flex-row items-start">
        <View
          className="w-12 h-12 rounded-xl items-center justify-center mr-4"
          style={{ backgroundColor: color + "20" }}
        >
          <Svg
            width={24}
            height={24}
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <Path d={icon} />
          </Svg>
        </View>
        <View className="flex-1">
          <View className="flex-row items-center">
            <Text variant="label" className="font-semibold">
              {title}
            </Text>
            {!available && (
              <View className="ml-2 bg-navy-100 dark:bg-navy-700 px-2 py-0.5 rounded-full">
                <Text variant="caption">Coming Soon</Text>
              </View>
            )}
          </View>
          <Text
            variant="bodySmall"
            className="text-muted dark:text-muted-dark mt-1"
          >
            {description}
          </Text>
        </View>
      </View>
    </Card>
  );
}

export default function AiHubScreen() {
  const insets = useSafeAreaInsets();

  const features: AiFeatureCardProps[] = [
    {
      title: "Recipe Generator",
      description: "Create custom recipes from your ingredients",
      icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
      color: "#FF6B6B",
      route: "/ai/recipe-generator",
    },
    {
      title: "Meal Planner",
      description: "Generate multi-day meal plans tailored to your goals",
      icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
      color: "#4ECDC4",
      route: "/ai/meal-planner",
    },
    {
      title: "Cooking Assistant",
      description: "Chat with AI for real-time cooking help and tips",
      icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",
      color: "#7C3AED",
      route: "/ai/cooking-assistant",
    },
    {
      title: "Leftover Recipes",
      description: "Turn your leftovers into delicious meals",
      icon: "M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4",
      color: "#F59E0B",
      route: "/ai/leftover-generator",
    },
    {
      title: "Smart Grocery List",
      description: "AI-generated shopping lists organized by store section",
      icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4",
      color: "#10B981",
      route: "/ai/grocery-list",
    },
    {
      title: "Shopping List",
      description: "View and check off items you've saved to your list",
      icon: "M9 2L6 6H2m0 0l2 13a2 2 0 002 2h12a2 2 0 002-2l1-9H4m5-4h11l-1 4",
      color: "#14B8A6",
      route: "/shopping-list",
    },
    {
      title: "Nutrition Analyzer",
      description: "Analyze the nutritional content of any recipe",
      icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
      color: "#6366F1",
      route: "/ai/recipe-generator",
      available: false,
    },
    {
      title: "Recipe Improver",
      description: "Get suggestions to improve your existing recipes",
      icon: "M13 10V3L4 14h7v7l9-11h-7z",
      color: "#EC4899",
      route: "/ai/recipe-generator",
      available: false,
    },
    {
      title: "Smart Scanner",
      description: "Scan ingredients with your camera to find recipes",
      icon: "M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z M15 13a3 3 0 11-6 0 3 3 0 016 0z",
      color: "#0EA5E9",
      route: "/ai/recipe-generator",
      available: false,
    },
  ];

  return (
    <ScrollView
      className="flex-1 bg-background dark:bg-background-dark"
      contentContainerStyle={{
        paddingTop: insets.top + 16,
        paddingBottom: 100,
      }}
      showsVerticalScrollIndicator={false}
    >
      <View className="px-4">
        <Text variant="h1" className="mb-2">
          AI Kitchen
        </Text>
        <Text variant="body" className="text-muted dark:text-muted-dark mb-6">
          Powered by Google Gemini — your personal chef assistant
        </Text>

        {features.map((feature) => (
          <AiFeatureCard key={feature.title} {...feature} />
        ))}
      </View>
    </ScrollView>
  );
}
