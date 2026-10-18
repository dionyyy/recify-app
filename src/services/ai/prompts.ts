import type { MealPlanConfig } from "@/types/meal-plan";

export function recipeGeneratorPrompt(
  ingredients: string[],
  preferences?: {
    cuisine?: string;
    dietary?: string[];
    maxTime?: string;
  }
): string {
  let prompt = `You are a professional chef. Generate a detailed recipe using these ingredients: ${ingredients.join(", ")}.`;

  if (preferences?.cuisine) {
    prompt += ` Cuisine style: ${preferences.cuisine}.`;
  }
  if (preferences?.dietary?.length) {
    prompt += ` Dietary restrictions: ${preferences.dietary.join(", ")}.`;
  }
  if (preferences?.maxTime) {
    prompt += ` Maximum cooking time: ${preferences.maxTime}.`;
  }

  prompt += `

Respond ONLY with a valid JSON object in this exact format (no markdown, no extra text):
{
  "title": "Recipe Title",
  "description": "Brief description of the dish",
  "prepTime": "15 mins",
  "cookTime": "30 mins",
  "servings": 4,
  "difficulty": "Easy",
  "ingredients": [
    {"name": "ingredient", "quantity": "1", "unit": "cup"}
  ],
  "instructions": [
    "Step 1 description",
    "Step 2 description"
  ],
  "tips": [
    "Helpful cooking tip"
  ],
  "nutrition": {
    "calories": 350,
    "protein": "25g",
    "carbs": "40g",
    "fat": "12g"
  },
  "tags": ["quick", "healthy"],
  "cuisine": "Italian"
}

Difficulty must be one of: "Easy", "Medium", "Hard".
Include realistic nutrition estimates.
Provide 3-5 useful tips.
Make instructions clear and detailed.`;

  return prompt;
}

export function mealPlannerPrompt(config: MealPlanConfig): string {
  return `You are a professional nutritionist and meal planner. Create a ${config.duration}-day meal plan with the following requirements:

- Daily calorie target: ${config.dailyCalories} kcal
- Budget level: ${config.budget}
- Cuisine preferences: ${config.cuisinePreferences.length ? config.cuisinePreferences.join(", ") : "Any"}
- Dietary restrictions: ${config.dietaryRestrictions.length ? config.dietaryRestrictions.join(", ") : "None"}
- Allergies: ${config.allergies.length ? config.allergies.join(", ") : "None"}

Respond ONLY with a valid JSON object in this exact format (no markdown, no extra text):
{
  "title": "7-Day Balanced Meal Plan",
  "duration": ${config.duration},
  "days": [
    {
      "day": 1,
      "date": "Day 1",
      "breakfast": {
        "name": "Meal name",
        "description": "Brief description",
        "calories": 400,
        "prepTime": "15 mins",
        "ingredients": ["ingredient1", "ingredient2"]
      },
      "lunch": { ... same format ... },
      "dinner": { ... same format ... },
      "snack": { ... same format ... },
      "totalCalories": 1600
    }
  ]
}

Generate exactly ${config.duration} days. Each day should have breakfast, lunch, dinner, and a snack.
Keep daily total calories close to ${config.dailyCalories}.
Ensure variety across days and meals.`;
}

export function cookingAssistantSystemPrompt(): string {
  return `You are a friendly and knowledgeable cooking assistant. Your expertise includes:
- Recipe suggestions and modifications
- Cooking techniques and methods
- Ingredient substitutions
- Food safety and storage
- Kitchen equipment recommendations
- Meal prep tips
- Dietary modifications

Guidelines:
- Keep answers concise but helpful
- Use bullet points or numbered lists for steps
- Suggest alternatives when possible
- Be encouraging and supportive
- Use bold for important terms
- If a question is not food/cooking related, politely redirect to cooking topics`;
}

export function leftoverPrompt(ingredients: string[]): string {
  return `You are a creative chef specializing in using leftover ingredients. Given these leftover ingredients: ${ingredients.join(", ")}

Generate 3-4 creative recipe options that use as many of these ingredients as possible.

Respond ONLY with a valid JSON array in this exact format (no markdown, no extra text):
[
  {
    "title": "Recipe Title",
    "description": "Brief description",
    "prepTime": "10 mins",
    "cookTime": "20 mins",
    "servings": 2,
    "difficulty": "Easy",
    "ingredients": [
      {"name": "ingredient", "quantity": "1", "unit": "cup"}
    ],
    "instructions": [
      "Step 1",
      "Step 2"
    ],
    "tips": ["Tip 1"],
    "nutrition": {
      "calories": 300,
      "protein": "20g",
      "carbs": "35g",
      "fat": "10g"
    },
    "tags": ["leftover", "quick"],
    "cuisine": "Fusion"
  }
]

Prioritize recipes that:
1. Use the most input ingredients
2. Are quick and easy to prepare
3. Are creative and delicious
4. Require minimal additional ingredients`;
}

export function groceryListPrompt(
  recipes: { title: string; ingredients: { name: string; quantity: string }[] }[]
): string {
  const recipeList = recipes
    .map(
      (r) =>
        `${r.title}: ${r.ingredients.map((i) => `${i.quantity} ${i.name}`).join(", ")}`
    )
    .join("\n");

  return `You are a smart grocery list organizer. Given these recipes and their ingredients:

${recipeList}

Consolidate all ingredients into a single grocery list, organized by store section. Combine duplicate ingredients (e.g., if two recipes need onions, list the total amount needed).

Respond ONLY with a valid JSON object in this exact format (no markdown, no extra text):
{
  "items": [
    {"name": "Chicken Breast", "quantity": "2 lbs", "category": "Meat & Seafood"},
    {"name": "Onion", "quantity": "3 medium", "category": "Produce"},
    {"name": "Olive Oil", "quantity": "1 bottle", "category": "Condiments & Spices"}
  ]
}

Categories must be one of: "Produce", "Meat & Seafood", "Dairy & Eggs", "Grains & Bread", "Canned Goods", "Condiments & Spices", "Frozen", "Snacks", "Beverages", "Other".
Combine and consolidate quantities where possible.`;
}
