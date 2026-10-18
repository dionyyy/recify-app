import React, { useState, useRef, useEffect } from "react";
import { View, FlatList, TextInput, Pressable, KeyboardAvoidingView, Platform } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text, IconButton } from "@/components/ui";
import { useAiChatStore } from "@/store/aiChatStore";
import { geminiService } from "@/services/ai/gemini";
import type { ChatMessage } from "@/services/ai/types";
import Svg, { Path } from "react-native-svg";

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  return (
    <View
      className={`mb-3 max-w-[85%] ${isUser ? "self-end" : "self-start"}`}
    >
      <View
        className={`px-4 py-3 rounded-2xl ${
          isUser
            ? "bg-primary rounded-br-md"
            : "bg-surface dark:bg-surface-dark border border-navy-100 dark:border-navy-700 rounded-bl-md"
        }`}
      >
        <Text
          variant="body"
          className={isUser ? "text-white" : ""}
        >
          {message.content}
        </Text>
      </View>
    </View>
  );
}

const SUGGESTED_QUESTIONS = [
  "What can I make with chicken?",
  "How do I make pasta al dente?",
  "Substitute for eggs in baking?",
  "Quick 15-min dinner ideas",
];

export default function CookingAssistantScreen() {
  const insets = useSafeAreaInsets();
  const flatListRef = useRef<FlatList>(null);
  const [inputText, setInputText] = useState("");
  const {
    sessions,
    activeSessionId,
    isStreaming,
    createSession,
    addMessage,
    updateLastMessage,
    setStreaming,
    getActiveSession,
    setActiveSession,
  } = useAiChatStore();

  const activeSession = getActiveSession();
  const messages = activeSession?.messages || [];

  useEffect(() => {
    if (!activeSessionId && sessions.length === 0) {
      createSession("New Chat");
    } else if (!activeSessionId && sessions.length > 0) {
      setActiveSession(sessions[0].id);
    }
  }, []);

  const sendMessage = async () => {
    const text = inputText.trim();
    if (!text || isStreaming) return;

    let sessionId = activeSessionId;
    if (!sessionId) {
      sessionId = await createSession(text.slice(0, 30));
    }

    setInputText("");
    await addMessage(sessionId, "user", text);
    setStreaming(true);

    try {
      const history = getActiveSession()?.messages.slice(0, -1) || [];
      await addMessage(sessionId, "model", "");

      let fullResponse = "";
      for await (const chunk of geminiService.streamChat(
        history.filter((m) => m.role !== "model" || m.content),
        text
      )) {
        fullResponse += chunk;
        updateLastMessage(sessionId, fullResponse);
      }
    } catch (error) {
      updateLastMessage(
        sessionId!,
        "Sorry, I encountered an error. Please try again."
      );
    } finally {
      setStreaming(false);
    }
  };

  const handleSuggestion = (question: string) => {
    setInputText(question);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-background dark:bg-background-dark"
      keyboardVerticalOffset={0}
    >
      {/* Header */}
      <View
        className="flex-row items-center px-4 py-3 border-b border-navy-100 dark:border-navy-700"
        style={{ paddingTop: insets.top }}
      >
        <IconButton variant="ghost" onPress={() => router.back()}>
          <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="#1A1A2E" strokeWidth={2}>
            <Path d="M19 12H5M12 19l-7-7 7-7" />
          </Svg>
        </IconButton>
        <View className="flex-1 ml-3">
          <Text variant="label">Cooking Assistant</Text>
          <Text variant="caption">
            {isStreaming ? "Typing..." : "Ask me anything about cooking"}
          </Text>
        </View>
        <IconButton
          variant="ghost"
          onPress={async () => {
            await createSession("New Chat");
          }}
        >
          <Svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth={2}>
            <Path d="M12 4v16m8-8H4" />
          </Svg>
        </IconButton>
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          padding: 16,
          flexGrow: 1,
          justifyContent: messages.length === 0 ? "center" : "flex-start",
        }}
        renderItem={({ item }) => <MessageBubble message={item} />}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
        ListEmptyComponent={
          <View className="items-center px-4">
            <Text variant="h3" className="mb-2 text-center">
              What are you cooking today?
            </Text>
            <Text variant="bodySmall" className="text-center text-muted dark:text-muted-dark mb-6">
              Ask me for recipes, substitutions, techniques, or any cooking help
            </Text>
            <View className="flex-row flex-wrap gap-2 justify-center">
              {SUGGESTED_QUESTIONS.map((q) => (
                <Pressable
                  key={q}
                  onPress={() => handleSuggestion(q)}
                  className="bg-surface dark:bg-surface-dark border border-navy-200 dark:border-navy-600 px-3 py-2 rounded-full"
                >
                  <Text variant="bodySmall">{q}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        }
      />

      {/* Input Bar */}
      <View
        className="px-4 py-3 border-t border-navy-100 dark:border-navy-700 bg-surface dark:bg-surface-dark"
        style={{ paddingBottom: insets.bottom + 8 }}
      >
        <View className="flex-row items-end">
          <TextInput
            className="flex-1 bg-navy-50 dark:bg-navy-700 rounded-2xl px-4 py-3 text-base text-navy-800 dark:text-navy-50 max-h-28"
            placeholder="Ask me anything..."
            placeholderTextColor="#94A3B8"
            value={inputText}
            onChangeText={setInputText}
            multiline
            onSubmitEditing={sendMessage}
          />
          <Pressable
            onPress={sendMessage}
            disabled={!inputText.trim() || isStreaming}
            className={`ml-2 w-10 h-10 rounded-full items-center justify-center ${
              inputText.trim() && !isStreaming ? "bg-primary" : "bg-navy-200 dark:bg-navy-600"
            }`}
          >
            <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2}>
              <Path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
            </Svg>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
