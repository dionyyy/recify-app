export interface Ingredient {
  name: string;
  measure: string;
}

export interface Meal {
  id: string;
  name: string;
  category: string;
  area: string;
  instructions: string;
  thumbnail: string;
  tags: string[];
  youtube: string | null;
  ingredients: Ingredient[];
  source: string | null;
}

export interface MealSummary {
  id: string;
  name: string;
  thumbnail: string;
}

export interface Category {
  id: string;
  name: string;
  thumbnail: string;
  description: string;
}

export interface Area {
  name: string;
}

export interface IngredientItem {
  id: string;
  name: string;
  description: string | null;
}

export interface GeneratedRecipe {
  title: string;
  description: string;
  prepTime: string;
  cookTime: string;
  servings: number;
  difficulty: "Easy" | "Medium" | "Hard";
  ingredients: {
    name: string;
    quantity: string;
    unit: string;
  }[];
  instructions: string[];
  tips: string[];
  nutrition: {
    calories: number;
    protein: string;
    carbs: string;
    fat: string;
  };
  tags: string[];
  cuisine: string;
}
