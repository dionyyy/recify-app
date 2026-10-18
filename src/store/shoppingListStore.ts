import { create } from "zustand";
import { shoppingQueries } from "@/services/database/queries";

export interface ShoppingItem {
  id: string;
  name: string;
  quantity: string;
  category: string;
  checked: boolean;
  mealPlanId?: string;
  createdAt: number;
}

interface ShoppingListState {
  items: ShoppingItem[];
  isLoaded: boolean;
  loadItems: () => Promise<void>;
  addItems: (
    items: { name: string; quantity: string; category: string; mealPlanId?: string }[]
  ) => Promise<void>;
  toggleItem: (id: string) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  clearChecked: () => Promise<void>;
  clearAll: () => Promise<void>;
}

export const useShoppingListStore = create<ShoppingListState>((set, get) => ({
  items: [],
  isLoaded: false,

  loadItems: async () => {
    try {
      const records = await shoppingQueries.getAll();
      const items: ShoppingItem[] = records.map((r) => ({
        id: r.id,
        name: r.name,
        quantity: r.quantity,
        category: r.category,
        checked: r.checked === 1,
        mealPlanId: r.meal_plan_id || undefined,
        createdAt: r.created_at,
      }));
      set({ items, isLoaded: true });
    } catch {
      set({ isLoaded: true });
    }
  },

  addItems: async (items) => {
    await shoppingQueries.addItems(items);
    await get().loadItems();
  },

  toggleItem: async (id) => {
    await shoppingQueries.toggleItem(id);
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      ),
    }));
  },

  removeItem: async (id) => {
    await shoppingQueries.removeItem(id);
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    }));
  },

  clearChecked: async () => {
    await shoppingQueries.clearChecked();
    set((state) => ({
      items: state.items.filter((item) => !item.checked),
    }));
  },

  clearAll: async () => {
    await shoppingQueries.clearAll();
    set({ items: [] });
  },
}));
