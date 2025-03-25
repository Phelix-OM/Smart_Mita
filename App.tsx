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
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#1E88E5",
        }}
      >
        <View
          style={{
            width: 100,
            height: 100,
            borderRadius: 20,
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 20,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
          }}
        >
          <Text
            style={{
              fontSize: 40,
              fontWeight: "bold",
              color: "#FFFFFF",
            }}
          >
            SM
          </Text>
        </View>
        <ActivityIndicator size="large" color="#FFFFFF" />
        <Text
          style={{
            marginTop: 16,
            color: "#FFFFFF",
            fontWeight: "bold",
            fontSize: 18,
            letterSpacing: 1,
          }}
        >
          SMARTMITA
        </Text>
        <Text
          style={{
            marginTop: 8,
            color: "rgba(255, 255, 255, 0.8)",
            fontSize: 14,
          }}
        >
          Smart Energy Management
        </Text>
      </View>
    )
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <UtilityProvider>
              <NotificationProvider>
                <NavigationContainer>
                  <StatusBar style="auto" />
                  <RootNavigator />
                </NavigationContainer>
              </NotificationProvider>
            </UtilityProvider>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  )
}

