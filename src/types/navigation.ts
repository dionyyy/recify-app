export type RootStackParamList = {
  "(tabs)": undefined;
  "(auth)": undefined;
  "recipe/[id]": { id: string };
  "ai/recipe-generator": undefined;
  "ai/meal-planner": undefined;
  "ai/cooking-assistant": undefined;
  "ai/leftover-generator": undefined;
  "ai/grocery-list": undefined;
  settings: undefined;
};

export type TabParamList = {
  index: undefined;
  search: undefined;
  ai: undefined;
  favorites: undefined;
  profile: undefined;
};
