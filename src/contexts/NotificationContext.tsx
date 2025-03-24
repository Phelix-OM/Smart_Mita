"use client"

import type React from "react"
import { createContext, useState, useContext, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import * as Notifications from "expo-notifications"
import { Platform } from "react-native"
import { useLanguage } from "./LanguageContext"

type NotificationType = "alert" | "tip" | "system" | "comparison" | "billing"

type Notification = {
  id: string
  title: string
  body: string
  date: string
  read: boolean
  type: NotificationType
  priority: "high" | "medium" | "low"
  actionable: boolean
  actionText?: string
  actionRoute?: string
  additionalData?: Record<string, any>
}

type NotificationSettings = {
  energyAlerts: boolean
  savingsTips: boolean
  systemUpdates: boolean
  usageComparisons: boolean
  billingNotifications: boolean
  quietHoursEnabled: boolean
  quietHoursStart: string
  quietHoursEnd: string
}

type NotificationContextType = {
  notifications: Notification[]
  unreadCount: number
  settings: NotificationSettings
  markAsRead: (id: string) => Promise<void>
  markAllAsRead: () => Promise<void>
  updateSettings: (settings: Partial<NotificationSettings>) => Promise<void>
  deleteNotification: (id: string) => Promise<void>
  clearAllNotifications: () => Promise<void>
  sendTestNotification: (type: NotificationType) => Promise<void>
  getNotificationsByType: (type: NotificationType) => Notification[]
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
})

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [settings, setSettings] = useState<NotificationSettings>({
    energyAlerts: true,
    savingsTips: true,
    systemUpdates: true,
    usageComparisons: true,
    billingNotifications: true,
    quietHoursEnabled: false,
    quietHoursStart: "22:00",
    quietHoursEnd: "07:00",
  })
  const { i18n } = useLanguage()

  useEffect(() => {
    // Load saved notifications and settings
    const loadNotificationData = async () => {
      try {
        const savedNotifications = await AsyncStorage.getItem("notifications")
        const savedSettings = await AsyncStorage.getItem("notificationSettings")

        if (savedNotifications) {
          setNotifications(JSON.parse(savedNotifications))
        } else {
          // Generate some sample notifications if none exist
          const sampleNotifications = generateSampleNotifications()
          await AsyncStorage.setItem("notifications", JSON.stringify(sampleNotifications))
          setNotifications(sampleNotifications)
        }

        if (savedSettings) {
          setSettings(JSON.parse(savedSettings))
        }
      } catch (error) {
        console.error("Failed to load notification data:", error)
      }
    }

    // Register for push notifications
    const registerForPushNotifications = async () => {
      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#1E88E5",
        })
      }

      const { status: existingStatus } = await Notifications.getPermissionsAsync()
      let finalStatus = existingStatus

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync()
        finalStatus = status
      }

      if (finalStatus !== "granted") {
        console.log("Failed to get push token for push notification!")
        return
      }
    }

    loadNotificationData()
    registerForPushNotifications()
  }, [])

  // Generate enhanced sample notifications in the current language
  const generateSampleNotifications = (): Notification[] => {
    const now = new Date()
    const yesterday = new Date(now)
    yesterday.setDate(now.getDate() - 1)
    const twoDaysAgo = new Date(now)
    twoDaysAgo.setDate(now.getDate() - 2)
    const threeDaysAgo = new Date(now)
    threeDaysAgo.setDate(now.getDate() - 3)

    return [
      {
        id: "1",
        title: i18n.t("sampleNotification.alertTitle"),
        body: i18n.t("sampleNotification.alertBody"),
        date: now.toISOString(),
        read: false,
        type: "alert",
        priority: "high",
        actionable: true,
        actionText: "View Details",
        actionRoute: "Dashboard",
        additionalData: {
          currentUsage: 3.2,
          averageUsage: 2.5,
          percentageIncrease: 28,
        },
      },
      {
        id: "2",
        title: i18n.t("sampleNotification.tipTitle"),
        body: i18n.t("sampleNotification.tipBody"),
        date: yesterday.toISOString(),
        read: false,
        type: "tip",
        priority: "medium",
        actionable: true,
        actionText: "Learn More",
        actionRoute: "EnergyTips",
        additionalData: {
          potentialSavings: 10,
          savingsUnit: "%",
          tipCategory: "standby",
        },
      },
      {
        id: "3",
        title: i18n.t("sampleNotification.systemTitle"),
        body: i18n.t("sampleNotification.systemBody"),
        date: twoDaysAgo.toISOString(),
        read: true,
        type: "system",
        priority: "low",
        actionable: false,
      },
      {
        id: "4",
        title: "Neighborhood Comparison",
        body: "Your home is 15% more efficient than similar homes in your area this month.",
        date: threeDaysAgo.toISOString(),
        read: false,
        type: "comparison",
        priority: "medium",
        actionable: true,
        actionText: "View Comparison",
        actionRoute: "Analytics",
        additionalData: {
          yourUsage: 28.5,
          neighborhoodAverage: 33.5,
          percentageDifference: 15,
        },
      },
      {
        id: "5",
        title: "Monthly Bill Estimate",
        body: "Your estimated electricity bill for this month is $45.20, which is $5.30 less than last month.",
        date: threeDaysAgo.toISOString(),
        read: true,
        type: "billing",
        priority: "medium",
        actionable: true,
        actionText: "View Bill",
        actionRoute: "Analytics",
        additionalData: {
          currentEstimate: 45.2,
          previousBill: 50.5,
          savingsAmount: 5.3,
        },
      },
    ]
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = async (id: string) => {
    try {
      const updatedNotifications = notifications.map((n) => (n.id === id ? { ...n, read: true } : n))

      await AsyncStorage.setItem("notifications", JSON.stringify(updatedNotifications))
      setNotifications(updatedNotifications)
    } catch (error) {
      console.error("Failed to mark notification as read:", error)
    }
  }

  const markAllAsRead = async () => {
    try {
      const updatedNotifications = notifications.map((n) => ({ ...n, read: true }))

      await AsyncStorage.setItem("notifications", JSON.stringify(updatedNotifications))
      setNotifications(updatedNotifications)
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error)
    }
  }

  const updateSettings = async (newSettings: Partial<NotificationSettings>) => {
    try {
      const updatedSettings = { ...settings, ...newSettings }

      await AsyncStorage.setItem("notificationSettings", JSON.stringify(updatedSettings))
      setSettings(updatedSettings)
    } catch (error) {
      console.error("Failed to update notification settings:", error)
    }
  }

  const deleteNotification = async (id: string) => {
    try {
      const updatedNotifications = notifications.filter((n) => n.id !== id)

      await AsyncStorage.setItem("notifications", JSON.stringify(updatedNotifications))
      setNotifications(updatedNotifications)
    } catch (error) {
      console.error("Failed to delete notification:", error)
    }
  }

  const clearAllNotifications = async () => {
    try {
      await AsyncStorage.setItem("notifications", JSON.stringify([]))
      setNotifications([])
    } catch (error) {
      console.error("Failed to clear all notifications:", error)
    }
  }

  const sendTestNotification = async (type: NotificationType) => {
    try {
      let title = ""
      let body = ""

      switch (type) {
        case "alert":
          title = "Energy Usage Alert"
          body = "Your current energy usage is 30% higher than usual."
          break
        case "tip":
          title = "Energy Saving Tip"
          body = "Adjust your thermostat by 1°C to save up to 10% on heating costs."
          break
        case "system":
          title = "System Update"
          body = "Your SmartMita app has been updated with new features."
          break
        case "comparison":
          title = "Neighborhood Comparison"
          body = "You used 15% less energy than similar homes in your area this week."
          break
        case "billing":
          title = "Billing Update"
          body = "Your estimated bill for this month is $42.50, which is $3.75 less than last month."
          break
      }

      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data: { type },
        },
        trigger: null, // Send immediately
      })

      // Also add to local notifications
      const newNotification: Notification = {
        id: Date.now().toString(),
        title,
        body,
        date: new Date().toISOString(),
        read: false,
        type,
        priority: type === "alert" ? "high" : "medium",
        actionable: true,
        actionText: "View",
        actionRoute: "Dashboard",
      }

      const updatedNotifications = [newNotification, ...notifications]
      await AsyncStorage.setItem("notifications", JSON.stringify(updatedNotifications))
      setNotifications(updatedNotifications)
    } catch (error) {
      console.error("Failed to send test notification:", error)
    }
  }

  const getNotificationsByType = (type: NotificationType): Notification[] => {
    return notifications.filter((n) => n.type === type)
  }

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        settings,
        markAsRead,
        markAllAsRead,
        updateSettings,
        deleteNotification,
        clearAllNotifications,
        sendTestNotification,
        getNotificationsByType,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotification = () => {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error("useNotification must be used within a NotificationProvider")
  }
  return context
}

