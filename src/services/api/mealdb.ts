import { apiClient } from "./client";
import {
  RawMealSearchResponse,
  RawCategoriesResponse,
  RawFilterResponse,
  RawListResponse,
  RawMeal,
} from "./types";
import type {
  Meal,
  MealSummary,
  Category,
  Area,
  Ingredient,
  IngredientItem,
} from "@/types/recipe";

/**
 * Transform raw MealDB ingredient fields (strIngredient1..20 + strMeasure1..20)
 * into a clean array of { name, measure }
 */
function parseIngredients(raw: RawMeal): Ingredient[] {
  const ingredients: Ingredient[] = [];
  for (let i = 1; i <= 20; i++) {
    const name = raw[`strIngredient${i}` as keyof RawMeal] as string | null;
    const measure = raw[`strMeasure${i}` as keyof RawMeal] as string | null;
    if (name && name.trim()) {
      ingredients.push({
        name: name.trim(),
        measure: measure?.trim() || "",
      });
    }
  }
  return ingredients;
}

/**
 * Transform raw API meal to app domain model
 */
function transformMeal(raw: RawMeal): Meal {
  return {
    id: raw.idMeal,
    name: raw.strMeal,
    category: raw.strCategory,
    area: raw.strArea,
    instructions: raw.strInstructions,
    thumbnail: raw.strMealThumb,
    tags: raw.strTags ? raw.strTags.split(",").map((t) => t.trim()) : [],
    youtube: raw.strYoutube || null,
    ingredients: parseIngredients(raw),
    source: raw.strSource || null,
  };
}

export const mealdbService = {
  /**
   * Search meals by name
   */
  async searchMeals(query: string): Promise<Meal[]> {
    const data = await apiClient<RawMealSearchResponse>(
      `/search.php?s=${encodeURIComponent(query)}`
    );
    if (!data.meals) return [];
    return data.meals.map(transformMeal);
  },

  /**
   * Get a single meal by ID
   */
  async getMealById(id: string): Promise<Meal | null> {
    const data = await apiClient<RawMealSearchResponse>(
      `/lookup.php?i=${id}`
    );
    if (!data.meals || data.meals.length === 0) return null;
    return transformMeal(data.meals[0]);
  },

  /**
   * Get a random meal
   */
  async getRandomMeal(): Promise<Meal> {
    const data = await apiClient<RawMealSearchResponse>("/random.php");
    return transformMeal(data.meals![0]);
  },

  /**
   * List all categories
   */
  async getCategories(): Promise<Category[]> {
    const data = await apiClient<RawCategoriesResponse>("/categories.php");
    return data.categories.map((c) => ({
      id: c.idCategory,
      name: c.strCategory,
      thumbnail: c.strCategoryThumb,
      description: c.strCategoryDescription,
    }));
  },

  /**
   * Filter meals by category name
   */
  async filterByCategory(category: string): Promise<MealSummary[]> {
    const data = await apiClient<RawFilterResponse>(
      `/filter.php?c=${encodeURIComponent(category)}`
    );
    if (!data.meals) return [];
    return data.meals.map((m) => ({
      id: m.idMeal,
      name: m.strMeal,
      thumbnail: m.strMealThumb,
    }));
  },

  /**
   * Filter meals by area/cuisine
   */
  async filterByArea(area: string): Promise<MealSummary[]> {
    const data = await apiClient<RawFilterResponse>(
      `/filter.php?a=${encodeURIComponent(area)}`
    );
    if (!data.meals) return [];
    return data.meals.map((m) => ({
      id: m.idMeal,
      name: m.strMeal,
      thumbnail: m.strMealThumb,
    }));
  },

  /**
   * Filter meals by main ingredient
   */
  async filterByIngredient(ingredient: string): Promise<MealSummary[]> {
    const data = await apiClient<RawFilterResponse>(
      `/filter.php?i=${encodeURIComponent(ingredient)}`
    );
    if (!data.meals) return [];
    return data.meals.map((m) => ({
      id: m.idMeal,
      name: m.strMeal,
      thumbnail: m.strMealThumb,
    }));
  },

  /**
   * List all areas/cuisines
   */
  async listAreas(): Promise<Area[]> {
    const data = await apiClient<RawListResponse>("/list.php?a=list");
    if (!data.meals) return [];
    return data.meals.map((m) => ({ name: m.strArea! }));
  },

  /**
   * List all ingredients
   */
  async listIngredients(): Promise<IngredientItem[]> {
    const data = await apiClient<RawListResponse>("/list.php?i=list");
    if (!data.meals) return [];
    return data.meals.map((m) => ({
      id: m.idIngredient!,
      name: m.strIngredient!,
      description: m.strDescription || null,
    }));
  },
};
