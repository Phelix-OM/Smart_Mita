"use client"

import { useEffect, useState } from "react"
import { NavigationContainer } from "@react-navigation/native"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { StatusBar } from "expo-status-bar"
import { View, Text, ActivityIndicator } from "react-native"
import * as Font from "expo-font"
import { ThemeProvider } from "./src/contexts/ThemeContext"
import { AuthProvider } from "./src/contexts/AuthContext"
import { LanguageProvider } from "./src/contexts/LanguageContext"
import { UtilityProvider } from "./src/contexts/UtilityContext"
import { NotificationProvider } from "./src/contexts/NotificationContext"
import RootNavigator from "./src/navigation/RootNavigator"
import UtilityConnectionScreen from "./src/screens/auth/UtilityConnectionScreen"
export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false)

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        "Poppins-Regular": require("./assets/fonts/Poppins-Regular.ttf"),
        "Poppins-Medium": require("./assets/fonts/Poppins-Medium.ttf"),
        "Poppins-Bold": require("./assets/fonts/Poppins-Bold.ttf"),
      })
      setFontsLoaded(true)
    }

    loadFonts()
  }, [])

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#1E88E5" }}>
        <ActivityIndicator size="large" color="#FFFFFF" />
        <Text style={{ marginTop: 16, color: "#FFFFFF", fontWeight: "bold" }}>Loading SmartMita...</Text>
      </View>
    )
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <UtilityProvider>
              <UtilityConnectionScreen>
              <NotificationProvider>
                <NavigationContainer>
                  <StatusBar style="auto" />
                  <RootNavigator />
                </NavigationContainer>
              </NotificationProvider>
              </UtilityConnectionScreen>
            </UtilityProvider>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  )
}

