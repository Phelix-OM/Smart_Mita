"use client"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { useAuth } from "../contexts/AuthContext"
import AuthStack from "./AuthStack"
import MainTabs from "./MainTabs"
import OnboardingScreen from "../screens/OnboardingScreen"
import LanguageSelectionScreen from "../screens/LanguageSelectionScreen"
import { useLanguage } from "../contexts/LanguageContext"

const Stack = createNativeStackNavigator()

export default function RootNavigator() {
  const { isAuthenticated, hasCompletedOnboarding } = useAuth()
  const { hasSelectedLanguage } = useLanguage()

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!hasSelectedLanguage ? (
        <Stack.Screen name="LanguageSelection" component={LanguageSelectionScreen} />
      ) : !hasCompletedOnboarding ? (
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      ) : !isAuthenticated ? (
        <Stack.Screen name="Auth" component={AuthStack} />
      ) : (
        <Stack.Screen name="Main" component={MainTabs} />
      )}
    </Stack.Navigator>
  )
}

