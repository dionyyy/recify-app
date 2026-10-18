import React, { useMemo, useCallback } from "react";
import { View, SectionList, Pressable, Alert } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text, IconButton, Badge, EmptyState, Button } from "@/components/ui";
import { useShoppingListStore, type ShoppingItem } from "@/store/shoppingListStore";
import { useHaptics } from "@/hooks/useHaptics";
import Svg, { Path } from "react-native-svg";

function BackIcon() {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="#1A1A2E" strokeWidth={2}>
      <Path d="M19 12H5M12 19l-7-7 7-7" />
    </Svg>
  );
}

function CheckIcon() {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M20 6L9 17l-5-5" />
    </Svg>
  );
}

function TrashIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
    </Svg>
  );
}

function CartIcon() {
  return (
    <Svg width={48} height={48} viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M9 2L6 6H2m0 0l2 13a2 2 0 002 2h12a2 2 0 002-2l1-9H4m5-4h11l-1 4" />
    </Svg>
  );
}

function ShoppingRow({
  item,
  onToggle,
  onRemove,
}: {
  item: ShoppingItem;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
}) {
  const haptics = useHaptics();

  const handleToggle = useCallback(() => {
    haptics.selection();
    onToggle(item.id);
  }, [haptics, item.id, onToggle]);

  const handleRemove = useCallback(() => {
    haptics.light();
    onRemove(item.id);
  }, [haptics, item.id, onRemove]);

  return (
    <View className="flex-row items-center justify-between px-4">
      {/* Checkable area — large touch target */}
      <Pressable
        onPress={handleToggle}
        className="flex-row items-center flex-1 py-3"
        hitSlop={8}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: item.checked }}
        accessibilityLabel={`${item.name}${item.quantity ? `, ${item.quantity}` : ""}`}
      >
        <View
          className={
            item.checked
              ? "w-6 h-6 rounded-md items-center justify-center bg-primary"
              : "w-6 h-6 rounded-md items-center justify-center border-2 border-navy-200 dark:border-navy-600"
          }
        >
          {item.checked && <CheckIcon />}
        </View>
        <View className="ml-3 flex-1">
          <Text
            variant="body"
            className={
              item.checked
                ? "line-through text-muted dark:text-muted-dark"
                : ""
            }
          >
            {item.name}
          </Text>
          {!!item.quantity && (
            <Text variant="caption" className="text-muted dark:text-muted-dark">
              {item.quantity}
            </Text>
          )}
        </View>
      </Pressable>

      <IconButton
        variant="ghost"
        size="md"
        onPress={handleRemove}
        accessibilityLabel={`Remove ${item.name}`}
      >
        <TrashIcon />
      </IconButton>
    </View>
  );
}

export default function ShoppingListScreen() {
  const insets = useSafeAreaInsets();
  const items = useShoppingListStore((s) => s.items);
  const toggleItem = useShoppingListStore((s) => s.toggleItem);
  const removeItem = useShoppingListStore((s) => s.removeItem);
  const clearChecked = useShoppingListStore((s) => s.clearChecked);
  const clearAll = useShoppingListStore((s) => s.clearAll);

  const sections = useMemo(() => {
    const grouped = items.reduce<Record<string, ShoppingItem[]>>((acc, item) => {
      (acc[item.category] ||= []).push(item);
      return acc;
    }, {});
    return Object.entries(grouped)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([category, data]) => ({ title: category, data }));
  }, [items]);

  const checkedCount = useMemo(
    () => items.filter((i) => i.checked).length,
    [items]
  );

  const confirmClearAll = useCallback(() => {
    if (items.length === 0) return;
    Alert.alert(
      "Clear shopping list?",
      "This removes every item. This can't be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Clear all", style: "destructive", onPress: () => clearAll() },
      ]
    );
  }, [items.length, clearAll]);

  return (
    <View
      className="flex-1 bg-background dark:bg-background-dark"
      style={{ paddingTop: insets.top }}
    >
      {/* Header */}
      <View className="flex-row items-center px-4 py-3">
        <IconButton variant="ghost" onPress={() => router.back()} accessibilityLabel="Go back">
          <BackIcon />
        </IconButton>
        <Text variant="h3" className="ml-3 flex-1">
          Shopping List
        </Text>
        {items.length > 0 && (
          <Pressable onPress={confirmClearAll} hitSlop={8} className="py-2 px-2">
            <Text variant="bodySmall" className="text-primary font-semibold">
              Clear all
            </Text>
          </Pressable>
        )}
      </View>

      {items.length === 0 ? (
        <EmptyState
          icon={<CartIcon />}
          title="Your list is empty"
          message="Generate a grocery list from the AI Kitchen and it'll show up here."
          actionLabel="Open AI Kitchen"
          onAction={() => router.replace("/(tabs)/ai")}
        />
      ) : (
        <>
          <SectionList
            sections={sections}
            keyExtractor={(item) => item.id}
            stickySectionHeadersEnabled={false}
            contentContainerStyle={{ paddingBottom: insets.bottom + 96 }}
            renderSectionHeader={({ section }) => (
              <View className="px-4 pt-4 pb-2">
                <Badge label={section.title} variant="secondary" className="self-start" />
              </View>
            )}
            renderItem={({ item }) => (
              <ShoppingRow item={item} onToggle={toggleItem} onRemove={removeItem} />
            )}
            ItemSeparatorComponent={() => (
              <View className="h-px bg-navy-100 dark:bg-navy-700 ml-4" />
            )}
          />

          {/* Footer action — thumb zone */}
          {checkedCount > 0 && (
            <View
              className="absolute left-0 right-0 px-4"
              style={{ bottom: insets.bottom + 16 }}
            >
              <Button variant="outline" onPress={() => clearChecked()}>
                {`Clear ${checkedCount} checked`}
              </Button>
            </View>
          )}
        </>
      )}
    </View>
  );
}
