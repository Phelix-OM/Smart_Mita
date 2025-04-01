"use client"

import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { useAuth } from "../contexts/AuthContext"
import { useLanguage } from "../contexts/LanguageContext"
import AuthStack from "./AuthStack"
import MainTabs from "./MainTabs"
import OnboardingScreen from "../screens/OnboardingScreen"
import LanguageSelectionScreen from "../screens/LanguageSelectionScreen"

const Stack = createNativeStackNavigator()

export default function RootNavigator() {
  const { isAuthenticated, hasCompletedOnboarding } = useAuth()
  const { hasSelectedLanguage } = useLanguage()

  
  let screen = null

  if (!hasSelectedLanguage) {
    screen = <Stack.Screen name="LanguageSelection" component={LanguageSelectionScreen} />
  } else if (!hasCompletedOnboarding) {
    screen = <Stack.Screen name="Onboarding" component={OnboardingScreen} />
  } else if (!isAuthenticated) {
    screen = <Stack.Screen name="Auth" component={AuthStack} />
  } else {
    screen = <Stack.Screen name="Main" component={MainTabs} />
  }

  return <Stack.Navigator screenOptions={{ headerShown: false }}>{screen}</Stack.Navigator>
}



