import { useQuery } from "@tanstack/react-query";
import { mealdbService } from "@/services/api/mealdb";

export const recipeKeys = {
  all: ["recipes"] as const,
  search: (query: string) => [...recipeKeys.all, "search", query] as const,
  detail: (id: string) => [...recipeKeys.all, "detail", id] as const,
  categories: () => [...recipeKeys.all, "categories"] as const,
  random: () => [...recipeKeys.all, "random"] as const,
  filterByCategory: (category: string) =>
    [...recipeKeys.all, "filterByCategory", category] as const,
  filterByArea: (area: string) =>
    [...recipeKeys.all, "filterByArea", area] as const,
  filterByIngredient: (ingredient: string) =>
    [...recipeKeys.all, "filterByIngredient", ingredient] as const,
  areas: () => [...recipeKeys.all, "areas"] as const,
};

export function useSearchMeals(query: string) {
  return useQuery({
    queryKey: recipeKeys.search(query),
    queryFn: () => mealdbService.searchMeals(query),
    enabled: query.length > 2,
    staleTime: 5 * 60 * 1000,
  });
}

export function useRecipeDetail(id: string) {
  return useQuery({
    queryKey: recipeKeys.detail(id),
    queryFn: () => mealdbService.getMealById(id),
    enabled: !!id,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: recipeKeys.categories(),
    queryFn: () => mealdbService.getCategories(),
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });
}

export function useRandomMeal() {
  return useQuery({
    queryKey: recipeKeys.random(),
    queryFn: () => mealdbService.getRandomMeal(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useFilterByCategory(category: string) {
  return useQuery({
    queryKey: recipeKeys.filterByCategory(category),
    queryFn: () => mealdbService.filterByCategory(category),
    enabled: !!category,
  });
}

export function useFilterByArea(area: string) {
  return useQuery({
    queryKey: recipeKeys.filterByArea(area),
    queryFn: () => mealdbService.filterByArea(area),
    enabled: !!area,
  });
}

export function useAreas() {
  return useQuery({
    queryKey: recipeKeys.areas(),
    queryFn: () => mealdbService.listAreas(),
    staleTime: 24 * 60 * 60 * 1000,
  });
}
