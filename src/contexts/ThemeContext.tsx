"use client"

import type React from "react"
import { createContext, useState, useContext, useEffect } from "react"
import { useColorScheme } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"

type ThemeColors = {
  primary: string
  secondary: string
  tertiary: string
  background: string
  card: string
  text: string
  textSecondary: string
  border: string
  notification: string
  success: string
  warning: string
  error: string
  white: string
  black: string
  chartBlue: string
  chartGreen: string
  chartOrange: string
  chartPurple: string
  chartRed: string
  cardGradientStart: string
  cardGradientEnd: string
  decrease: string
  increase: string
}

type ThemeContextType = {
  isDarkMode: boolean
  toggleTheme: () => void
  colors: ThemeColors
}

const lightColors: ThemeColors = {
  primary: "#1E88E5", // Updated to a professional blue
  secondary: "#0EA5E9",
  tertiary: "#10B981",
  background: "#F8FAFC",
  card: "#FFFFFF",
  text: "#1E293B",
  textSecondary: "#64748B",
  border: "#E2E8F0",
  notification: "#EF4444",
  success: "#10B981",
  warning: "#F59E0B",
  error: "#EF4444",
  white: "#FFFFFF",
  black: "#000000",
  chartBlue: "rgba(30, 136, 229, 0.2)",
  chartGreen: "rgba(16, 185, 129, 0.2)",
  chartOrange: "rgba(245, 158, 11, 0.2)",
  chartPurple: "rgba(139, 92, 246, 0.2)",
  chartRed: "rgba(239, 68, 68, 0.2)",
  cardGradientStart: "#FFFFFF",
  cardGradientEnd: "#F8FAFC",
  decrease: "#10B981",
  increase: "#EF4444",
}

const darkColors: ThemeColors = {
  primary: "#1E88E5", // Keep the same primary for brand consistency
  secondary: "#0EA5E9",
  tertiary: "#10B981",
  background: "#0F172A",
  card: "#1E293B",
  text: "#F8FAFC",
  textSecondary: "#94A3B8",
  border: "#334155",
  notification: "#EF4444",
  success: "#10B981",
  warning: "#F59E0B",
  error: "#EF4444",
  white: "#FFFFFF",
  black: "#000000",
  chartBlue: "rgba(30, 136, 229, 0.3)",
  chartGreen: "rgba(16, 185, 129, 0.3)",
  chartOrange: "rgba(245, 158, 11, 0.3)",
  chartPurple: "rgba(139, 92, 246, 0.3)",
  chartRed: "rgba(239, 68, 68, 0.3)",
  cardGradientStart: "#1E293B",
  cardGradientEnd: "#0F172A",
  decrease: "#10B981",
  increase: "#EF4444",
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const deviceColorScheme = useColorScheme()
  const [isDarkMode, setIsDarkMode] = useState(deviceColorScheme === "dark")

  useEffect(() => {
    // Load saved theme preference
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem("userTheme")
        if (savedTheme) {
          setIsDarkMode(savedTheme === "dark")
        } else {
          setIsDarkMode(deviceColorScheme === "dark")
        }
      } catch (error) {
        console.error("Failed to load theme preference:", error)
      }
    }

    loadTheme()
  }, [deviceColorScheme])

  const toggleTheme = async () => {
    try {
      const newTheme = !isDarkMode ? "dark" : "light"
      await AsyncStorage.setItem("userTheme", newTheme)
      setIsDarkMode(!isDarkMode)
    } catch (error) {
      console.error("Failed to save theme preference:", error)
    }
  }

  return (
    <ThemeContext.Provider
      value={{
        isDarkMode,
        toggleTheme,
        colors: isDarkMode ? darkColors : lightColors,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}

