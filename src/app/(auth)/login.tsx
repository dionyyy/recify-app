import React, { useState } from "react";
import { View, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { Link, router } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Text, Button, Input, Divider } from "@/components/ui";
import { useAuthStore } from "@/store/authStore";
import { loginSchema, type LoginFormData } from "@/utils/validators";

export default function LoginScreen() {
  const { login, isLoading, error, clearError } = useAuthStore();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginFormData) => {
    clearError();
    await login(data.email, data.password);
    router.replace("/(tabs)");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <ScrollView
        className="flex-1 bg-background dark:bg-background-dark"
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="px-6 py-12">
          {/* Header */}
          <View className="items-center mb-10">
            <Text variant="h1" className="text-primary mb-2">
              Recify
            </Text>
            <Text variant="body" className="text-muted dark:text-muted-dark">
              AI-powered recipes at your fingertips
            </Text>
          </View>

          {/* Form */}
          <View className="bg-surface dark:bg-surface-dark rounded-3xl p-6 shadow-sm">
            <Text variant="h2" className="mb-6">
              Welcome back
            </Text>

            {error && (
              <View className="bg-red-50 dark:bg-red-900/30 p-3 rounded-xl mb-4">
                <Text variant="bodySmall" className="text-red-600 dark:text-red-400">
                  {error}
                </Text>
              </View>
            )}

            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value, onBlur } }) => (
                <Input
                  label="Email"
                  placeholder="your@email.com"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.email?.message}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  containerClassName="mb-4"
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value, onBlur } }) => (
                <Input
                  label="Password"
                  placeholder="Enter your password"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.password?.message}
                  secureTextEntry
                  containerClassName="mb-6"
                />
              )}
            />

            <Button
              onPress={handleSubmit(onSubmit)}
              loading={isLoading}
              size="lg"
              className="mb-4"
            >
              Sign In
            </Button>

            <Divider label="or" />

            <Button variant="outline" size="lg" className="mb-3" disabled>
              Continue with Google
            </Button>

            <Button variant="outline" size="lg" disabled>
              Continue with Apple
            </Button>
          </View>

          {/* Register link */}
          <View className="flex-row items-center justify-center mt-6">
            <Text variant="body" className="text-muted dark:text-muted-dark">
              Don't have an account?{" "}
            </Text>
            <Link href="/(auth)/register">
              <Text variant="body" className="text-primary font-semibold">
                Create one
              </Text>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
