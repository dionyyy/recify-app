import { create } from "zustand";
import { favoritesQueries } from "@/services/database/queries";
import type { Meal, GeneratedRecipe } from "@/types/recipe";

interface FavoriteItem {
  id: string;
  recipeId: string;
  recipe: Meal | GeneratedRecipe;
  createdAt: number;
  source: "api" | "ai_generated";
}

interface FavoritesState {
  favorites: FavoriteItem[];
  isLoaded: boolean;
  loadFavorites: () => Promise<void>;
  addFavorite: (
    recipeId: string,
    recipe: Meal | GeneratedRecipe,
    source?: "api" | "ai_generated"
  ) => Promise<void>;
  removeFavorite: (recipeId: string) => Promise<void>;
  isFavorite: (recipeId: string) => boolean;
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favorites: [],
  isLoaded: false,

  loadFavorites: async () => {
    try {
      const records = await favoritesQueries.getAll();
      const favorites: FavoriteItem[] = records.map((record) => ({
        id: record.id,
        recipeId: record.recipe_id,
        recipe: JSON.parse(record.recipe_data),
        createdAt: record.created_at,
        source: record.source as "api" | "ai_generated",
      }));
      set({ favorites, isLoaded: true });
    } catch {
      set({ isLoaded: true });
    }
  },

  addFavorite: async (recipeId, recipe, source = "api") => {
    await favoritesQueries.add(recipeId, recipe, source);
    await get().loadFavorites();
  },

  removeFavorite: async (recipeId) => {
    await favoritesQueries.remove(recipeId);
    set((state) => ({
      favorites: state.favorites.filter((f) => f.recipeId !== recipeId),
    }));
  },

  isFavorite: (recipeId) => {
    return get().favorites.some((f) => f.recipeId === recipeId);
  },
}));
