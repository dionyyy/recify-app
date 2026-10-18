export interface MealPlanConfig {
  duration: 7 | 14 | 30;
  dailyCalories: number;
  budget: "low" | "medium" | "high";
  cuisinePreferences: string[];
  dietaryRestrictions: string[];
  allergies: string[];
}

export interface PlanMeal {
  name: string;
  description: string;
  calories: number;
  prepTime: string;
  ingredients: string[];
}

export interface MealPlanDay {
  day: number;
  date: string;
  breakfast: PlanMeal;
  lunch: PlanMeal;
  dinner: PlanMeal;
  snack: PlanMeal;
  totalCalories: number;
}

export interface MealPlan {
  id: string;
  title: string;
  duration: number;
  days: MealPlanDay[];
  config: MealPlanConfig;
  createdAt: number;
}

export interface GroceryItem {
  id: string;
  name: string;
  quantity: string;
  category: string;
  checked: boolean;
}

export interface GroceryList {
  id: string;
  title: string;
  items: GroceryItem[];
  mealPlanId?: string;
  createdAt: number;
}
