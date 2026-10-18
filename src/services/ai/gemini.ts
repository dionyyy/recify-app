import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";
import { GEMINI_API_KEY } from "@/constants";
import { recipeGeneratorPrompt, mealPlannerPrompt, cookingAssistantSystemPrompt, leftoverPrompt, groceryListPrompt } from "./prompts";
import type { GeneratedRecipe } from "@/types/recipe";
import type { MealPlan, MealPlanConfig, GroceryList } from "@/types/meal-plan";
import type { ChatMessage } from "./types";
import { safeJsonParse } from "@/utils/helpers";
import { generateId } from "@/utils/formatters";
import { useSettingsStore } from "@/store/settingsStore";

const MODEL_NAMES = {
  flash: "gemini-1.5-flash",
  pro: "gemini-1.5-pro",
} as const;

let genAI: GoogleGenerativeAI | null = null;
const modelCache = new Map<string, GenerativeModel>();

function getGenAI(): GoogleGenerativeAI {
  if (!genAI) {
    genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  }
  return genAI;
}

/**
 * Resolve the generative model based on the user's selected AI model in
 * settings (flash vs pro). Instances are cached per model name.
 */
function getModel(): GenerativeModel {
  const selected = useSettingsStore.getState().aiModel;
  const modelName = MODEL_NAMES[selected] ?? MODEL_NAMES.flash;
  let model = modelCache.get(modelName);
  if (!model) {
    model = getGenAI().getGenerativeModel({ model: modelName });
    modelCache.set(modelName, model);
  }
  return model;
}

export const geminiService = {
  /**
   * Generate a recipe from a list of ingredients
   */
  async generateRecipe(
    ingredients: string[],
    preferences?: {
      cuisine?: string;
      dietary?: string[];
      maxTime?: string;
    }
  ): Promise<GeneratedRecipe> {
    const model = getModel();
    const prompt = recipeGeneratorPrompt(ingredients, preferences);

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Failed to parse recipe response from AI");
    }

    const recipe = safeJsonParse<GeneratedRecipe>(jsonMatch[0], null as unknown as GeneratedRecipe);
    if (!recipe) {
      throw new Error("Invalid recipe format from AI");
    }

    return recipe;
  },

  /**
   * Generate a multi-day meal plan
   */
  async generateMealPlan(config: MealPlanConfig): Promise<MealPlan> {
    const model = getModel();
    const prompt = mealPlannerPrompt(config);

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Failed to parse meal plan response from AI");
    }

    const planData = safeJsonParse<Omit<MealPlan, "id" | "createdAt" | "config">>(
      jsonMatch[0],
      null as unknown as Omit<MealPlan, "id" | "createdAt" | "config">
    );
    if (!planData) {
      throw new Error("Invalid meal plan format from AI");
    }

    return {
      ...planData,
      id: generateId(),
      config,
      createdAt: Date.now(),
    };
  },

  /**
   * Stream a chat response for the cooking assistant
   */
  async *streamChat(
    history: ChatMessage[],
    userMessage: string
  ): AsyncGenerator<string, void, unknown> {
    const model = getModel();

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: "System: " + cookingAssistantSystemPrompt() }],
        },
        {
          role: "model",
          parts: [
            {
              text: "I understand! I'm your helpful cooking assistant. I can help with recipes, cooking techniques, ingredient substitutions, and more. What would you like to cook today?",
            },
          ],
        },
        ...history.map((msg) => ({
          role: msg.role as "user" | "model",
          parts: [{ text: msg.content }],
        })),
      ],
    });

    const result = await chat.sendMessageStream(userMessage);

    for await (const chunk of result.stream) {
      const text = chunk.text();
      if (text) {
        yield text;
      }
    }
  },

  /**
   * Generate recipes from leftover ingredients
   */
  async generateFromLeftovers(
    ingredients: string[]
  ): Promise<GeneratedRecipe[]> {
    const model = getModel();
    const prompt = leftoverPrompt(ingredients);

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error("Failed to parse leftover recipes response from AI");
    }

    const recipes = safeJsonParse<GeneratedRecipe[]>(jsonMatch[0], []);
    if (!recipes.length) {
      throw new Error("No recipes generated from leftovers");
    }

    return recipes;
  },

  /**
   * Generate a grocery list from recipes or meal plan
   */
  async generateGroceryList(
    recipes: { title: string; ingredients: { name: string; quantity: string }[] }[]
  ): Promise<GroceryList> {
    const model = getModel();
    const prompt = groceryListPrompt(recipes);

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Failed to parse grocery list response from AI");
    }

    const listData = safeJsonParse<{ items: GroceryList["items"] }>(
      jsonMatch[0],
      { items: [] }
    );

    return {
      id: generateId(),
      title: "Grocery List",
      items: listData.items.map((item) => ({
        ...item,
        id: generateId(),
        checked: false,
      })),
      createdAt: Date.now(),
    };
  },
};
