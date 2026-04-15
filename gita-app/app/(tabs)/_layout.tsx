import { useAppTheme } from "@/hooks/use-app-theme";
import { ROUTES } from "@/src/navigation/routes";
import { getStandardHeaderOptions } from "@/src/navigation/headerConfig";
import { MaterialIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";

export default function TabLayout() {
  const { colors } = useAppTheme();

  const tabBarBackgroundColor = colors.bg;
  const tabBarActiveTintColor = colors.tabBarActive;
  const tabBarInactiveTintColor = colors.tabBarInactive;
  const tabBarBorderColor = colors.border;
  const headerOptions = getStandardHeaderOptions(colors);

  const TabIcon = ({
    name,
    color,
  }: {
    name: React.ComponentProps<typeof MaterialIcons>["name"];
    color: string;
  }) => <MaterialIcons name={name} size={24} color={color} />;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor,
        tabBarInactiveTintColor,
        headerShown: true,
        ...headerOptions,
        tabBarStyle: {
          backgroundColor: tabBarBackgroundColor,
          borderTopColor: tabBarBorderColor,
          borderTopWidth: 1,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Bhagavad Gita",
          href: ROUTES.TABS_HOME,
          tabBarLabel: "Home",
          tabBarIcon: ({ color }) => (
            <TabIcon name="auto-stories" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="chapters"
        options={{
          title: "Chapters",
          href: ROUTES.CHAPTERS,
          tabBarLabel: "Chapters",
          tabBarIcon: ({ color }) => <TabIcon name="menu-book" color={color} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          href: ROUTES.SEARCH,
          tabBarLabel: "Search",
          tabBarIcon: ({ color }) => <TabIcon name="search" color={color} />,
        }}
      />
      <Tabs.Screen
        name="journal"
        options={{
          title: "Journal",
          href: ROUTES.JOURNAL,
          tabBarLabel: "Journal",
          tabBarIcon: ({ color }) => <TabIcon name="book" color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Settings",
          href: null, // Hidden from tab bar
        }}
      />
      <Tabs.Screen
        name="reading"
        options={{
          title: "Reading",
          href: null, // Hidden from tab bar
        }}
      />
      <Tabs.Screen
        name="verse"
        options={{
          title: "Verse",
          href: null, // Hidden from tab bar
        }}
      />
    </Tabs>
  );
}
