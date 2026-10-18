import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const mealPlanConfigSchema = z.object({
  duration: z.union([z.literal(7), z.literal(14), z.literal(30)]),
  dailyCalories: z.number().min(1000).max(5000),
  budget: z.enum(["low", "medium", "high"]),
  cuisinePreferences: z.array(z.string()),
  dietaryRestrictions: z.array(z.string()),
  allergies: z.array(z.string()),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type MealPlanConfigFormData = z.infer<typeof mealPlanConfigSchema>;
