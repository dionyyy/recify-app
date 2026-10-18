import { getDatabase } from "./index";
import type { Meal, GeneratedRecipe } from "@/types/recipe";
import type { MealPlan } from "@/types/meal-plan";
import type { ChatMessage, ChatSession } from "@/services/ai/types";
import { generateId } from "@/utils/formatters";

// =====================
// FAVORITES
// =====================

export interface FavoriteRecord {
  id: string;
  recipe_id: string;
  recipe_data: string;
  created_at: number;
  source: "api" | "ai_generated";
}

export const favoritesQueries = {
  async getAll(): Promise<FavoriteRecord[]> {
    const db = await getDatabase();
    return db.getAllAsync<FavoriteRecord>(
      "SELECT * FROM favorites ORDER BY created_at DESC"
    );
  },

  async add(
    recipeId: string,
    recipeData: Meal | GeneratedRecipe,
    source: "api" | "ai_generated" = "api"
  ): Promise<void> {
    const db = await getDatabase();
    const id = generateId();
    await db.runAsync(
      "INSERT OR REPLACE INTO favorites (id, recipe_id, recipe_data, created_at, source) VALUES (?, ?, ?, ?, ?)",
      [id, recipeId, JSON.stringify(recipeData), Date.now(), source]
    );
  },

  async remove(recipeId: string): Promise<void> {
    const db = await getDatabase();
    await db.runAsync("DELETE FROM favorites WHERE recipe_id = ?", [recipeId]);
  },

  async isFavorite(recipeId: string): Promise<boolean> {
    const db = await getDatabase();
    const result = await db.getFirstAsync<{ count: number }>(
      "SELECT COUNT(*) as count FROM favorites WHERE recipe_id = ?",
      [recipeId]
    );
    return (result?.count ?? 0) > 0;
  },
};

// =====================
// CHAT SESSIONS
// =====================

export const chatQueries = {
  async getSessions(): Promise<ChatSession[]> {
    const db = await getDatabase();
    const sessions = await db.getAllAsync<{
      id: string;
      title: string;
      created_at: number;
      updated_at: number;
    }>("SELECT * FROM chat_sessions ORDER BY updated_at DESC");

    const result: ChatSession[] = [];
    for (const session of sessions) {
      const messages = await db.getAllAsync<{
        id: string;
        session_id: string;
        role: string;
        content: string;
        created_at: number;
      }>(
        "SELECT * FROM chat_messages WHERE session_id = ? ORDER BY created_at ASC",
        [session.id]
      );

      result.push({
        id: session.id,
        title: session.title,
        messages: messages.map((m) => ({
          id: m.id,
          role: m.role as "user" | "model",
          content: m.content,
          createdAt: m.created_at,
        })),
        createdAt: session.created_at,
        updatedAt: session.updated_at,
      });
    }
    return result;
  },

  async createSession(title: string): Promise<string> {
    const db = await getDatabase();
    const id = generateId();
    const now = Date.now();
    await db.runAsync(
      "INSERT INTO chat_sessions (id, title, created_at, updated_at) VALUES (?, ?, ?, ?)",
      [id, title, now, now]
    );
    return id;
  },

  async addMessage(
    sessionId: string,
    role: "user" | "model",
    content: string
  ): Promise<ChatMessage> {
    const db = await getDatabase();
    const id = generateId();
    const now = Date.now();
    await db.runAsync(
      "INSERT INTO chat_messages (id, session_id, role, content, created_at) VALUES (?, ?, ?, ?, ?)",
      [id, sessionId, role, content, now]
    );
    await db.runAsync(
      "UPDATE chat_sessions SET updated_at = ? WHERE id = ?",
      [now, sessionId]
    );
    return { id, role, content, createdAt: now };
  },

  async deleteSession(sessionId: string): Promise<void> {
    const db = await getDatabase();
    await db.runAsync("DELETE FROM chat_messages WHERE session_id = ?", [sessionId]);
    await db.runAsync("DELETE FROM chat_sessions WHERE id = ?", [sessionId]);
  },
};

// =====================
// MEAL PLANS
// =====================

export const mealPlanQueries = {
  async getAll(): Promise<MealPlan[]> {
    const db = await getDatabase();
    const rows = await db.getAllAsync<{
      id: string;
      title: string;
      plan_data: string;
      duration: number;
      created_at: number;
    }>("SELECT * FROM meal_plans ORDER BY created_at DESC");

    return rows.map((row) => ({
      ...JSON.parse(row.plan_data),
      id: row.id,
      title: row.title,
      duration: row.duration,
      createdAt: row.created_at,
    }));
  },

  async save(plan: MealPlan): Promise<void> {
    const db = await getDatabase();
    await db.runAsync(
      "INSERT OR REPLACE INTO meal_plans (id, title, plan_data, duration, created_at) VALUES (?, ?, ?, ?, ?)",
      [plan.id, plan.title, JSON.stringify(plan), plan.duration, plan.createdAt]
    );
  },

  async remove(id: string): Promise<void> {
    const db = await getDatabase();
    await db.runAsync("DELETE FROM meal_plans WHERE id = ?", [id]);
  },
};

// =====================
// SHOPPING LIST
// =====================

export interface ShoppingItemRecord {
  id: string;
  name: string;
  quantity: string;
  category: string;
  checked: number;
  meal_plan_id: string | null;
  created_at: number;
}

export const shoppingQueries = {
  async getAll(): Promise<ShoppingItemRecord[]> {
    const db = await getDatabase();
    return db.getAllAsync<ShoppingItemRecord>(
      "SELECT * FROM shopping_items ORDER BY category, name"
    );
  },

  async addItems(
    items: { name: string; quantity: string; category: string; mealPlanId?: string }[]
  ): Promise<void> {
    const db = await getDatabase();
    const now = Date.now();
    for (const item of items) {
      const id = generateId();
      await db.runAsync(
        "INSERT INTO shopping_items (id, name, quantity, category, checked, meal_plan_id, created_at) VALUES (?, ?, ?, ?, 0, ?, ?)",
        [id, item.name, item.quantity, item.category, item.mealPlanId || null, now]
      );
    }
  },

  async toggleItem(id: string): Promise<void> {
    const db = await getDatabase();
    await db.runAsync(
      "UPDATE shopping_items SET checked = CASE WHEN checked = 0 THEN 1 ELSE 0 END WHERE id = ?",
      [id]
    );
  },

  async removeItem(id: string): Promise<void> {
    const db = await getDatabase();
    await db.runAsync("DELETE FROM shopping_items WHERE id = ?", [id]);
  },

  async clearChecked(): Promise<void> {
    const db = await getDatabase();
    await db.runAsync("DELETE FROM shopping_items WHERE checked = 1");
  },

  async clearAll(): Promise<void> {
    const db = await getDatabase();
    await db.runAsync("DELETE FROM shopping_items");
  },
};

// =====================
// GENERATED RECIPES
// =====================

export const generatedRecipeQueries = {
  async getAll(source?: string): Promise<{ id: string; recipe: GeneratedRecipe; createdAt: number }[]> {
    const db = await getDatabase();
    const query = source
      ? "SELECT * FROM generated_recipes WHERE source = ? ORDER BY created_at DESC"
      : "SELECT * FROM generated_recipes ORDER BY created_at DESC";
    const params = source ? [source] : [];

    const rows = await db.getAllAsync<{
      id: string;
      recipe_data: string;
      source: string;
      created_at: number;
    }>(query, params);

    return rows.map((row) => ({
      id: row.id,
      recipe: JSON.parse(row.recipe_data),
      createdAt: row.created_at,
    }));
  },

  async save(recipe: GeneratedRecipe, source: string = "recipe_generator"): Promise<string> {
    const db = await getDatabase();
    const id = generateId();
    await db.runAsync(
      "INSERT INTO generated_recipes (id, recipe_data, source, created_at) VALUES (?, ?, ?, ?)",
      [id, JSON.stringify(recipe), source, Date.now()]
    );
    return id;
  },
};
