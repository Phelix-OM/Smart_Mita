"use client"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { Ionicons } from "@expo/vector-icons"
import DashboardScreen from "../screens/main/DashboardScreen"
import AnalyticsScreen from "../screens/main/AnalyticsScreen"
import TipsScreen from "../screens/main/TipsScreen"
import NotificationsScreen from "../screens/main/NotificationsScreen"
import SettingsScreen from "../screens/main/SettingsScreen"
import { useTheme } from "../contexts/ThemeContext"
import { useTranslation } from "../hooks/useTranslation"
import { useNotification } from "../contexts/NotificationContext"

const Tab = createBottomTabNavigator()

export default function MainTabs() {
  const { colors } = useTheme()
  const { t } = useTranslation()
  const { unreadCount } = useNotification()

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap | undefined

          if (route.name === "Dashboard") {
            iconName = focused ? "home" : "home-outline"
          } else if (route.name === "Analytics") {
            iconName = focused ? "analytics" : "analytics-outline"
          } else if (route.name === "Tips") {
            iconName = focused ? "bulb" : "bulb-outline"
          } else if (route.name === "Notifications") {
            iconName = focused ? "notifications" : "notifications-outline"
          } else if (route.name === "Settings") {
            iconName = focused ? "settings" : "settings-outline"
          }

          return <Ionicons name={iconName} size={size} color={color} />
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.text,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
        },
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: colors.white,
        headerTitleStyle: {
          fontFamily: "Poppins-Medium",
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} options={{ title: t("dashboard") }} />
      <Tab.Screen name="Analytics" component={AnalyticsScreen} options={{ title: "Analytics" }} />
      <Tab.Screen name="Tips" component={TipsScreen} options={{ title: "Energy Tips" }} />
      <Tab.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          title: t("notifications"),
          tabBarBadge: unreadCount > 0 ? unreadCount : undefined,
          tabBarBadgeStyle: { backgroundColor: colors.primary },
        }}
      />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ title: "Settings" }} />
    </Tab.Navigator>
  )
}

