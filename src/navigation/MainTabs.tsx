"use client"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { Ionicons } from "@expo/vector-icons"
import DashboardScreen from "../screens/main/DashboardScreen"
import AnalyticsScreen from "../screens/main/AnalyticsScreen"
import TipsScreen from "../screens/main/TipsScreen"
import NotificationsScreen from "../screens/main/NotificationsScreen"
import SettingsScreen from "../screens/main/SettingsScreen"
import InsightsScreen from "../screens/main/EducationScreen"

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
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Analytics") {
            iconName = focused ? "analytics" : "analytics-outline";
          } else if (route.name === "Education") {
            iconName = focused ? "book" : "book-outline";
          } else if (route.name === "Tips") {
            iconName = focused ? "bulb" : "bulb-outline";
          } else if (route.name === "Notifications") {
            iconName = focused ? "notifications" : "notifications-outline";
          } else if (route.name === "Settings") {
            iconName = focused ? "settings" : "settings-outline";
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
      <Tab.Screen name="Education" component={InsightsScreen} options={{title: t("education"),tabBarBadge: 3,tabBarBadgeStyle: { backgroundColor: colors.primary },
        }}    
      />
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

// "use client"
// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
// import { Ionicons } from "@expo/vector-icons"
// import DashboardScreen from "../screens/main/DashboardScreen"
// import AnalyticsScreen from "../screens/main/AnalyticsScreen"
// import TipsScreen from "../screens/main/TipsScreen"
// import NotificationsScreen from "../screens/main/NotificationsScreen"
// import SettingsScreen from "../screens/main/SettingsScreen"
// //import EnergyContentScreen from "@/src/screens/main/EnergyContentScreen"
// import { useTheme } from "../contexts/ThemeContext"
// import { useTranslation } from "../hooks/useTranslation"
// import { useNotification } from "../contexts/NotificationContext"
// import EducationScreen from "../screens/main/EducationScreen"
// // Define RootTabParamList for type safety
// export type RootTabParamList = {
//   Dashboard: undefined;
//   Analytics: undefined;
//   Tips: undefined;
//   News: undefined;
//   Learn: undefined;
//   Notifications: undefined;
//   Settings: undefined;
// }

// const Tab = createBottomTabNavigator<RootTabParamList>()

// export default function MainTabs() {
//   const { colors } = useTheme()
//   const { t } = useTranslation()
//   const { unreadCount } = useNotification()

//   return (
//     <Tab.Navigator
//       screenOptions={({ route }) => ({
//         tabBarIcon: ({ focused, color, size }) => {
//           let iconName: keyof typeof Ionicons.glyphMap | undefined

//           switch (route.name) {
//             case "Dashboard":
//               iconName = focused ? "home" : "home-outline"
//               break
//             case "Analytics":
//               iconName = focused ? "analytics" : "analytics-outline"
//               break
//             case "Tips":
//               iconName = focused ? "bulb" : "bulb-outline"
//               break
//             case "Learn":
//               iconName = focused ? "school" : "school-outline"
//               break
//             case "Notifications":
//               iconName = focused ? "notifications" : "notifications-outline"
//               break
//             case "Settings":
//               iconName = focused ? "settings" : "settings-outline"
//               break
//           }

//           return <Ionicons name={iconName} size={size} color={color} />
//         },
//         tabBarActiveTintColor: colors.primary,
//         tabBarInactiveTintColor: colors.text,
//         tabBarStyle: {
//           backgroundColor: colors.background,
//           borderTopColor: colors.border,
//         },
//         headerStyle: {
//           backgroundColor: colors.primary,
//         },
//         headerTintColor: colors.white,
//         headerTitleStyle: {
//           fontFamily: "Poppins-Medium",
//         },
//         headerShown: true,
//       })}
//     >
//       <Tab.Screen 
//         name="Dashboard" 
//         component={DashboardScreen} 
//         options={{ 
//           title: t("dashboard"),
//           headerTitle: t("dashboard")
//         }} 
//       />
//       <Tab.Screen 
//         name="Analytics" 
//         component={AnalyticsScreen} 
//         options={{ 
//           title: t("analytics"),
//           headerTitle: t("analytics")
//         }} 
//       />
//       <Tab.Screen 
//         name="Tips" 
//         component={TipsScreen} 
//         options={{ 
//           title: t("energyTips"),
//           headerTitle: t("energyTips")
//         }} 
//       />
//       <Tab.Screen 
//         name="Learn" 
//           component={}} 
//           options={{ 
//           title: t("Learn"),
//           headerTitle: t("education")
//         }} 
//       />   
//       <Tab.Screen
//         name="Notifications"
//         component={NotificationsScreen}
//         options={{
//           title: t("notifications"),
//           headerTitle: t("notifications"),
//           tabBarBadge: unreadCount > 0 ? unreadCount : undefined,
//           tabBarBadgeStyle: { backgroundColor: colors.primary },
//         }}
//       />
//       <Tab.Screen 
//         name="Settings" 
//         component={SettingsScreen} 
//         options={{ 
//           title: t("settings"),
//           headerTitle: t("settings")
//         }} 
//       />
//     </Tab.Navigator>
//   )
// }