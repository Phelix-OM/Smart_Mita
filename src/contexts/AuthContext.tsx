"use client"

import type React from "react"
import { createContext, useState, useContext, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Alert } from "react-native"

type User = {
  id: string
  name: string
  email: string
  phone?: string
  profileImage?: string
}

type AuthContextType = {
  isAuthenticated: boolean
  user: User | null
  hasCompletedOnboarding: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  completeOnboarding: () => Promise<void>
  updateUserProfile: (userData: Partial<User>) => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false)

  useEffect(() => {
    // Check if user is already logged in
    const checkAuthStatus = async () => {
      try {
        const userData = await AsyncStorage.getItem("user")
        const onboardingCompleted = await AsyncStorage.getItem("onboardingCompleted")

        if (userData) {
          setUser(JSON.parse(userData))
          setIsAuthenticated(true)
        }

        if (onboardingCompleted === "true") {
          setHasCompletedOnboarding(true)
        }
      } catch (error) {
        console.error("Failed to check auth status:", error)
      }
    }

    checkAuthStatus()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      // In a real app, you would make an API call to your backend
      // This is a mock implementation for demonstration

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // For demo purposes, accept any email with a valid format and any password
      if (!email || !email.includes("@") || !password) {
        return false
      }

      // Generate a name from the email if not found in stored users
      const storedUsers = await AsyncStorage.getItem("registeredUsers")
      const users = storedUsers ? JSON.parse(storedUsers) : []

      // Find user by email
      const foundUser = users.find((u: any) => u.email.toLowerCase() === email.toLowerCase())

      if (foundUser) {
        // In a real app, you would verify the password hash
        if (foundUser.password !== password) {
          return false
        }

        const user = {
          id: foundUser.id,
          name: foundUser.name,
          email: foundUser.email,
          phone: foundUser.phone,
          profileImage: foundUser.profileImage,
        }

        await AsyncStorage.setItem("user", JSON.stringify(user))
        setUser(user)
        setIsAuthenticated(true)
        return true
      } else {
        // For demo purposes, create a user if not found
        const name = email.split("@")[0]
        const newUser = {
          id: Date.now().toString(),
          name: name.charAt(0).toUpperCase() + name.slice(1),
          email,
        }

        await AsyncStorage.setItem("user", JSON.stringify(newUser))
        setUser(newUser)
        setIsAuthenticated(true)
        return true
      }
    } catch (error) {
      console.error("Login failed:", error)
      return false
    }
  }

  const register = async (name: string, email: string, password: string) => {
    try {
      // In a real app, you would make an API call to your backend
      // This is a mock implementation for demonstration

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Check if user already exists
      const storedUsers = await AsyncStorage.getItem("registeredUsers")
      const users = storedUsers ? JSON.parse(storedUsers) : []

      const userExists = users.some((user: any) => user.email.toLowerCase() === email.toLowerCase())

      if (userExists) {
        Alert.alert("Registration Failed", "A user with this email already exists")
        return false
      }

      // Create new user
      const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password, // In a real app, you would hash this password
        createdAt: new Date().toISOString(),
      }

      // Save to "database"
      users.push(newUser)
      await AsyncStorage.setItem("registeredUsers", JSON.stringify(users))

      // Save user session (without password)
      const userSession = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      }

      await AsyncStorage.setItem("user", JSON.stringify(userSession))
      setUser(userSession)
      setIsAuthenticated(true)
      return true
    } catch (error) {
      console.error("Registration failed:", error)
      return false
    }
  }

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("user")
      setUser(null)
      setIsAuthenticated(false)
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem("onboardingCompleted", "true")
      setHasCompletedOnboarding(true)
    } catch (error) {
      console.error("Failed to complete onboarding:", error)
    }
  }

  const updateUserProfile = async (userData: Partial<User>) => {
    try {
      if (!user) return false

      const updatedUser = { ...user, ...userData }
      await AsyncStorage.setItem("user", JSON.stringify(updatedUser))

      // Also update in registered users
      const storedUsers = await AsyncStorage.getItem("registeredUsers")
      if (storedUsers) {
        let users = JSON.parse(storedUsers)
        users = users.map((u: any) => (u.id === user.id ? { ...u, ...userData } : u))
        await AsyncStorage.setItem("registeredUsers", JSON.stringify(users))
      }

      setUser(updatedUser)
      return true
    } catch (error) {
      console.error("Failed to update profile:", error)
      return false
    }
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        hasCompletedOnboarding,
        login,
        register,
        logout,
        completeOnboarding,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

