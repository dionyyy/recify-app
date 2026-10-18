export const MEALDB_BASE_URL =
  process.env.EXPO_PUBLIC_MEALDB_BASE_URL ||
  "https://www.themealdb.com/api/json/v1/1";

export const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY || "";

export const APP_NAME = "Recify";

export const QUERY_STALE_TIME = 5 * 60 * 1000; // 5 minutes
export const QUERY_GC_TIME = 24 * 60 * 60 * 1000; // 24 hours

export const SEARCH_DEBOUNCE_MS = 300;
export const MIN_SEARCH_LENGTH = 2;

export const MAX_RECENT_SEARCHES = 10;

export const MEAL_PLAN_DURATIONS = [7, 14, 30] as const;

export const DIETARY_RESTRICTIONS = [
  "Vegetarian",
  "Vegan",
  "Gluten-Free",
  "Dairy-Free",
  "Keto",
  "Paleo",
  "Low-Carb",
  "Nut-Free",
] as const;

export const CUISINE_TYPES = [
  "American",
  "British",
  "Canadian",
  "Chinese",
  "Croatian",
  "Dutch",
  "Egyptian",
  "Filipino",
  "French",
  "Greek",
  "Indian",
  "Irish",
  "Italian",
  "Jamaican",
  "Japanese",
  "Kenyan",
  "Malaysian",
  "Mexican",
  "Moroccan",
  "Polish",
  "Portuguese",
  "Russian",
  "Spanish",
  "Thai",
  "Tunisian",
  "Turkish",
  "Vietnamese",
] as const;

export const BUDGET_LEVELS = ["low", "medium", "high"] as const;

export const INGREDIENT_CATEGORIES = {
  proteins: [
    "Chicken",
    "Beef",
    "Pork",
    "Fish",
    "Shrimp",
    "Tofu",
    "Eggs",
    "Turkey",
  ],
  vegetables: [
    "Onion",
    "Garlic",
    "Tomato",
    "Potato",
    "Carrot",
    "Broccoli",
    "Bell Pepper",
    "Spinach",
    "Mushroom",
    "Zucchini",
  ],
  grains: [
    "Rice",
    "Pasta",
    "Bread",
    "Flour",
    "Oats",
    "Quinoa",
    "Noodles",
    "Tortilla",
  ],
  dairy: [
    "Milk",
    "Cheese",
    "Butter",
    "Yogurt",
    "Cream",
    "Cream Cheese",
    "Sour Cream",
  ],
  condiments: [
    "Soy Sauce",
    "Olive Oil",
    "Salt",
    "Pepper",
    "Vinegar",
    "Hot Sauce",
    "Mustard",
    "Ketchup",
    "Honey",
    "Lemon",
  ],
} as const;

export const GROCERY_CATEGORIES = [
  "Produce",
  "Meat & Seafood",
  "Dairy & Eggs",
  "Grains & Bread",
  "Canned Goods",
  "Condiments & Spices",
  "Frozen",
  "Snacks",
  "Beverages",
  "Other",
] as const;
