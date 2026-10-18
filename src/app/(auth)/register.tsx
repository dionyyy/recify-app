import React from "react";
import { View, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { Link, router } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Text, Button, Input } from "@/components/ui";
import { useAuthStore } from "@/store/authStore";
import { registerSchema, type RegisterFormData } from "@/utils/validators";

export default function RegisterScreen() {
  const { register: registerUser, isLoading, error, clearError } = useAuthStore();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const onSubmit = async (data: RegisterFormData) => {
    clearError();
    await registerUser(data.name, data.email, data.password);
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
          <View className="items-center mb-10">
            <Text variant="h1" className="text-primary mb-2">
              Recify
            </Text>
            <Text variant="body" className="text-muted dark:text-muted-dark">
              Create your account to get started
            </Text>
          </View>

          <View className="bg-surface dark:bg-surface-dark rounded-3xl p-6 shadow-sm">
            <Text variant="h2" className="mb-6">
              Create Account
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
              name="name"
              render={({ field: { onChange, value, onBlur } }) => (
                <Input
                  label="Full Name"
                  placeholder="John Doe"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.name?.message}
                  containerClassName="mb-4"
                />
              )}
            />

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
                  placeholder="Min. 6 characters"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.password?.message}
                  secureTextEntry
                  containerClassName="mb-4"
                />
              )}
            />

            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, value, onBlur } }) => (
                <Input
                  label="Confirm Password"
                  placeholder="Repeat your password"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.confirmPassword?.message}
                  secureTextEntry
                  containerClassName="mb-6"
                />
              )}
            />

            <Button
              onPress={handleSubmit(onSubmit)}
              loading={isLoading}
              size="lg"
            >
              Create Account
            </Button>
          </View>

          <View className="flex-row items-center justify-center mt-6">
            <Text variant="body" className="text-muted dark:text-muted-dark">
              Already have an account?{" "}
            </Text>
            <Link href="/(auth)/login">
              <Text variant="body" className="text-primary font-semibold">
                Sign in
              </Text>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
