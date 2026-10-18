import { create } from "zustand";
import { mealPlanQueries } from "@/services/database/queries";
import type { MealPlan } from "@/types/meal-plan";

interface MealPlannerState {
  currentPlan: MealPlan | null;
  plans: MealPlan[];
  isLoaded: boolean;
  isGenerating: boolean;
  loadPlans: () => Promise<void>;
  savePlan: (plan: MealPlan) => Promise<void>;
  setCurrentPlan: (plan: MealPlan | null) => void;
  removePlan: (id: string) => Promise<void>;
  setIsGenerating: (generating: boolean) => void;
}

export const useMealPlannerStore = create<MealPlannerState>((set, get) => ({
  currentPlan: null,
  plans: [],
  isLoaded: false,
  isGenerating: false,

  loadPlans: async () => {
    try {
      const plans = await mealPlanQueries.getAll();
      set({ plans, isLoaded: true });
    } catch {
      set({ isLoaded: true });
    }
  },

  savePlan: async (plan) => {
    await mealPlanQueries.save(plan);
    await get().loadPlans();
    set({ currentPlan: plan });
  },

  setCurrentPlan: (plan) => set({ currentPlan: plan }),

  removePlan: async (id) => {
    await mealPlanQueries.remove(id);
    set((state) => ({
      plans: state.plans.filter((p) => p.id !== id),
      currentPlan: state.currentPlan?.id === id ? null : state.currentPlan,
    }));
  },

  setIsGenerating: (generating) => set({ isGenerating: generating }),
}));
