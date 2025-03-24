"use client"

import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, Alert, Switch } from "react-native"
import { useTranslation } from "../../hooks/useTranslation"
import { useTheme } from "../../contexts/ThemeContext"
import { useNotification } from "../../contexts/NotificationContext"
import { Ionicons } from "@expo/vector-icons"
import { useResponsive } from "../../hooks/useResponsive"
import { SafeAreaView } from "react-native-safe-area-context"
import { format, isToday, isYesterday, isThisWeek } from "date-fns"

type NotificationTab = "all" | "unread" | "alerts" | "tips" | "system"

export default function NotificationsScreen() {
  const { t } = useTranslation()
  const { colors } = useTheme()
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    settings,
    updateSettings,
    sendTestNotification,
  } = useNotification()
  const { scaledFontSize, spacing, isSmallScreen } = useResponsive()

  const [activeTab, setActiveTab] = useState<NotificationTab>("all")
  const [showSettings, setShowSettings] = useState(false)

  const filteredNotifications =
    activeTab === "all"
      ? notifications
      : activeTab === "unread"
        ? notifications.filter((n) => !n.read)
        : activeTab === "alerts"
          ? notifications.filter((n) => n.type === "alert")
          : activeTab === "tips"
            ? notifications.filter((n) => n.type === "tip")
            : notifications.filter((n) => n.type === "system")

  const handleClearAll = () => {
    if (notifications.length === 0) return

    Alert.alert(
      "Clear All Notifications",
      "Are you sure you want to clear all notifications? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Clear All",
          onPress: clearAllNotifications,
          style: "destructive",
        },
      ],
    )
  }

  const handleMarkAllRead = () => {
    if (unreadCount === 0) return
    markAllAsRead()
  }

  const handleNotificationPress = (id: string) => {
    if (!notifications.find((n) => n.id === id)?.read) {
      markAsRead(id)
    }
  }

  const handleDeleteNotification = (id: string) => {
    Alert.alert("Delete Notification", "Are you sure you want to delete this notification?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        onPress: () => deleteNotification(id),
        style: "destructive",
      },
    ])
  }

  const formatNotificationDate = (dateString: string) => {
    const date = new Date(dateString)

    if (isToday(date)) {
      return `Today, ${format(date, "h:mm a")}`
    } else if (isYesterday(date)) {
      return `Yesterday, ${format(date, "h:mm a")}`
    } else if (isThisWeek(date)) {
      return format(date, "EEEE, h:mm a")
    } else {
      return format(date, "MMM d, yyyy")
    }
  }

  const getNotificationIcon = (type: string, priority: string) => {
    switch (type) {
      case "alert":
        return <Ionicons name="alert-circle" size={24} color={priority === "high" ? colors.error : colors.warning} />
      case "tip":
        return <Ionicons name="bulb" size={24} color={colors.tertiary} />
      case "system":
        return <Ionicons name="information-circle" size={24} color={colors.primary} />
      case "comparison":
        return <Ionicons name="bar-chart" size={24} color={colors.secondary} />
      case "billing":
        return <Ionicons name="cash" size={24} color={colors.success} />
      default:
        return <Ionicons name="notifications" size={24} color={colors.primary} />
    }
  }

  const renderNotificationItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[
        styles.notificationItem,
        {
          backgroundColor: item.read ? colors.card : `${colors.primary}10`,
          borderLeftColor:
            item.priority === "high" ? colors.error : item.priority === "medium" ? colors.warning : colors.primary,
          borderLeftWidth: 4,
        },
      ]}
      onPress={() => handleNotificationPress(item.id)}
    >
      <View style={styles.notificationIcon}>{getNotificationIcon(item.type, item.priority)}</View>

      <View style={styles.notificationContent}>
        <Text style={[styles.notificationTitle, { color: colors.text, fontSize: scaledFontSize(16) }]}>
          {item.title}
        </Text>

        <Text
          style={[styles.notificationBody, { color: colors.textSecondary, fontSize: scaledFontSize(14) }]}
          numberOfLines={2}
        >
          {item.body}
        </Text>

        <Text style={[styles.notificationDate, { color: colors.textSecondary, fontSize: scaledFontSize(12) }]}>
          {formatNotificationDate(item.date)}
        </Text>

        {item.actionable && (
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: `${colors.primary}15` }]}
            onPress={() => handleNotificationPress(item.id)}
          >
            <Text style={[styles.actionButtonText, { color: colors.primary, fontSize: scaledFontSize(14) }]}>
              {item.actionText || "View"}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteNotification(item.id)}>
        <Ionicons name="close" size={20} color={colors.textSecondary} />
      </TouchableOpacity>
    </TouchableOpacity>
  )

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="notifications-off-outline" size={64} color={colors.textSecondary} />
      <Text style={[styles.emptyTitle, { color: colors.text, fontSize: scaledFontSize(18) }]}>No Notifications</Text>
      <Text style={[styles.emptyText, { color: colors.textSecondary, fontSize: scaledFontSize(14) }]}>
        {activeTab === "all"
          ? "You don't have any notifications yet."
          : `You don't have any ${activeTab} notifications.`}
      </Text>

      <TouchableOpacity
        style={[styles.testButton, { backgroundColor: colors.primary }]}
        onPress={() =>
          sendTestNotification(
            activeTab === "all"
              ? "alert"
              : activeTab === "unread"
                ? "alert"
                : activeTab === "alerts"
                  ? "alert"
                  : activeTab === "tips"
                    ? "tip"
                    : "system",
          )
        }
      >
        <Text style={[styles.testButtonText, { color: colors.white, fontSize: scaledFontSize(14) }]}>
          Send Test Notification
        </Text>
      </TouchableOpacity>
    </View>
  )

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text, fontSize: scaledFontSize(24) }]}>Notifications</Text>

        <View style={styles.headerActions}>
          <TouchableOpacity
            style={[styles.headerButton, { opacity: unreadCount > 0 ? 1 : 0.5 }]}
            onPress={handleMarkAllRead}
            disabled={unreadCount === 0}
          >
            <Ionicons name="checkmark-done" size={22} color={colors.primary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.headerButton, { opacity: notifications.length > 0 ? 1 : 0.5 }]}
            onPress={handleClearAll}
            disabled={notifications.length === 0}
          >
            <Ionicons name="trash-outline" size={22} color={colors.error} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.headerButton} onPress={() => setShowSettings(!showSettings)}>
            <Ionicons name="settings-outline" size={22} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScrollContent}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "all" && [styles.activeTab, { borderBottomColor: colors.primary }]]}
            onPress={() => setActiveTab("all")}
          >
            <Text
              style={[
                styles.tabText,
                {
                  color: activeTab === "all" ? colors.primary : colors.textSecondary,
                  fontSize: scaledFontSize(14),
                },
              ]}
            >
              All
            </Text>
            {notifications.length > 0 && (
              <View style={[styles.tabBadge, { backgroundColor: colors.primary }]}>
                <Text style={[styles.tabBadgeText, { color: colors.white, fontSize: scaledFontSize(12) }]}>
                  {notifications.length}
                </Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === "unread" && [styles.activeTab, { borderBottomColor: colors.primary }]]}
            onPress={() => setActiveTab("unread")}
          >
            <Text
              style={[
                styles.tabText,
                {
                  color: activeTab === "unread" ? colors.primary : colors.textSecondary,
                  fontSize: scaledFontSize(14),
                },
              ]}
            >
              Unread
            </Text>
            {unreadCount > 0 && (
              <View style={[styles.tabBadge, { backgroundColor: colors.primary }]}>
                <Text style={[styles.tabBadgeText, { color: colors.white, fontSize: scaledFontSize(12) }]}>
                  {unreadCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === "alerts" && [styles.activeTab, { borderBottomColor: colors.error }]]}
            onPress={() => setActiveTab("alerts")}
          >
            <Text
              style={[
                styles.tabText,
                {
                  color: activeTab === "alerts" ? colors.error : colors.textSecondary,
                  fontSize: scaledFontSize(14),
                },
              ]}
            >
              Alerts
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === "tips" && [styles.activeTab, { borderBottomColor: colors.tertiary }]]}
            onPress={() => setActiveTab("tips")}
          >
            <Text
              style={[
                styles.tabText,
                {
                  color: activeTab === "tips" ? colors.tertiary : colors.textSecondary,
                  fontSize: scaledFontSize(14),
                },
              ]}
            >
              Tips
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === "system" && [styles.activeTab, { borderBottomColor: colors.primary }]]}
            onPress={() => setActiveTab("system")}
          >
            <Text
              style={[
                styles.tabText,
                {
                  color: activeTab === "system" ? colors.primary : colors.textSecondary,
                  fontSize: scaledFontSize(14),
                },
              ]}
            >
              System
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {showSettings ? (
        <ScrollView style={styles.settingsContainer}>
          <Text style={[styles.settingsTitle, { color: colors.text, fontSize: scaledFontSize(18) }]}>
            Notification Settings
          </Text>

          <View style={[styles.settingItem, { backgroundColor: colors.card }]}>
            <View style={styles.settingContent}>
              <Text style={[styles.settingTitle, { color: colors.text, fontSize: scaledFontSize(16) }]}>
                Energy Alerts
              </Text>
              <Text style={[styles.settingDescription, { color: colors.textSecondary, fontSize: scaledFontSize(14) }]}>
                Receive alerts about unusual energy usage patterns
              </Text>
            </View>
            <Switch
              value={settings.energyAlerts}
              onValueChange={(value) => updateSettings({ energyAlerts: value })}
              trackColor={{ false: "#767577", true: colors.primary + "80" }}
              thumbColor={settings.energyAlerts ? colors.primary : "#f4f3f4"}
            />
          </View>

          <View style={[styles.settingItem, { backgroundColor: colors.card }]}>
            <View style={styles.settingContent}>
              <Text style={[styles.settingTitle, { color: colors.text, fontSize: scaledFontSize(16) }]}>
                Savings Tips
              </Text>
              <Text style={[styles.settingDescription, { color: colors.textSecondary, fontSize: scaledFontSize(14) }]}>
                Receive daily energy-saving tips and recommendations
              </Text>
            </View>
            <Switch
              value={settings.savingsTips}
              onValueChange={(value) => updateSettings({ savingsTips: value })}
              trackColor={{ false: "#767577", true: colors.primary + "80" }}
              thumbColor={settings.savingsTips ? colors.primary : "#f4f3f4"}
            />
          </View>

          <View style={[styles.settingItem, { backgroundColor: colors.card }]}>
            <View style={styles.settingContent}>
              <Text style={[styles.settingTitle, { color: colors.text, fontSize: scaledFontSize(16) }]}>
                System Updates
              </Text>
              <Text style={[styles.settingDescription, { color: colors.textSecondary, fontSize: scaledFontSize(14) }]}>
                Receive notifications about app updates and new features
              </Text>
            </View>
            <Switch
              value={settings.systemUpdates}
              onValueChange={(value) => updateSettings({ systemUpdates: value })}
              trackColor={{ false: "#767577", true: colors.primary + "80" }}
              thumbColor={settings.systemUpdates ? colors.primary : "#f4f3f4"}
            />
          </View>

          <View style={[styles.settingItem, { backgroundColor: colors.card }]}>
            <View style={styles.settingContent}>
              <Text style={[styles.settingTitle, { color: colors.text, fontSize: scaledFontSize(16) }]}>
                Usage Comparisons
              </Text>
              <Text style={[styles.settingDescription, { color: colors.textSecondary, fontSize: scaledFontSize(14) }]}>
                Receive notifications comparing your usage to similar households
              </Text>
            </View>
            <Switch
              value={settings.usageComparisons}
              onValueChange={(value) => updateSettings({ usageComparisons: value })}
              trackColor={{ false: "#767577", true: colors.primary + "80" }}
              thumbColor={settings.usageComparisons ? colors.primary : "#f4f3f4"}
            />
          </View>

          <View style={[styles.settingItem, { backgroundColor: colors.card }]}>
            <View style={styles.settingContent}>
              <Text style={[styles.settingTitle, { color: colors.text, fontSize: scaledFontSize(16) }]}>
                Billing Notifications
              </Text>
              <Text style={[styles.settingDescription, { color: colors.textSecondary, fontSize: scaledFontSize(14) }]}>
                Receive notifications about bill estimates and payment reminders
              </Text>
            </View>
            <Switch
              value={settings.billingNotifications}
              onValueChange={(value) => updateSettings({ billingNotifications: value })}
              trackColor={{ false: "#767577", true: colors.primary + "80" }}
              thumbColor={settings.billingNotifications ? colors.primary : "#f4f3f4"}
            />
          </View>

          <View style={[styles.settingItem, { backgroundColor: colors.card }]}>
            <View style={styles.settingContent}>
              <Text style={[styles.settingTitle, { color: colors.text, fontSize: scaledFontSize(16) }]}>
                Quiet Hours
              </Text>
              <Text style={[styles.settingDescription, { color: colors.textSecondary, fontSize: scaledFontSize(14) }]}>
                Don't send notifications during specified hours
              </Text>
            </View>
            <Switch
              value={settings.quietHoursEnabled}
              onValueChange={(value) => updateSettings({ quietHoursEnabled: value })}
              trackColor={{ false: "#767577", true: colors.primary + "80" }}
              thumbColor={settings.quietHoursEnabled ? colors.primary : "#f4f3f4"}
            />
          </View>

          {settings.quietHoursEnabled && (
            <View style={[styles.quietHoursContainer, { backgroundColor: colors.card }]}>
              <Text style={[styles.quietHoursText, { color: colors.text, fontSize: scaledFontSize(14) }]}>
                Quiet hours are set from {settings.quietHoursStart} to {settings.quietHoursEnd}
              </Text>
              <TouchableOpacity style={[styles.editButton, { backgroundColor: `${colors.primary}15` }]}>
                <Text style={[styles.editButtonText, { color: colors.primary, fontSize: scaledFontSize(14) }]}>
                  Edit
                </Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.testNotificationsContainer}>
            <Text style={[styles.testTitle, { color: colors.text, fontSize: scaledFontSize(18) }]}>
              Test Notifications
            </Text>

            <View style={styles.testButtonsContainer}>
              <TouchableOpacity
                style={[styles.testTypeButton, { backgroundColor: `${colors.error}15` }]}
                onPress={() => sendTestNotification("alert")}
              >
                <Ionicons name="alert-circle" size={20} color={colors.error} style={styles.testButtonIcon} />
                <Text style={[styles.testButtonText, { color: colors.error, fontSize: scaledFontSize(14) }]}>
                  Alert
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.testTypeButton, { backgroundColor: `${colors.tertiary}15` }]}
                onPress={() => sendTestNotification("tip")}
              >
                <Ionicons name="bulb" size={20} color={colors.tertiary} style={styles.testButtonIcon} />
                <Text style={[styles.testButtonText, { color: colors.tertiary, fontSize: scaledFontSize(14) }]}>
                  Tip
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.testTypeButton, { backgroundColor: `${colors.primary}15` }]}
                onPress={() => sendTestNotification("system")}
              >
                <Ionicons name="information-circle" size={20} color={colors.primary} style={styles.testButtonIcon} />
                <Text style={[styles.testButtonText, { color: colors.primary, fontSize: scaledFontSize(14) }]}>
                  System
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      ) : (
        <FlatList
          data={filteredNotifications}
          renderItem={renderNotificationItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.notificationsList}
          ListEmptyComponent={renderEmptyState}
        />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  headerTitle: {
    fontFamily: "Poppins-Bold",
  },
  headerActions: {
    flexDirection: "row",
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  tabsContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  tabsScrollContent: {
    paddingHorizontal: 16,
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    marginRight: 24,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomWidth: 2,
  },
  tabText: {
    fontFamily: "Poppins-Medium",
  },
  tabBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
    paddingHorizontal: 4,
  },
  tabBadgeText: {
    fontFamily: "Poppins-Medium",
  },
  notificationsList: {
    padding: 16,
    flexGrow: 1,
  },
  notificationItem: {
    flexDirection: "row",
    borderRadius: 12,
    marginBottom: 12,
    overflow: "hidden",
  },
  notificationIcon: {
    padding: 16,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  notificationContent: {
    flex: 1,
    padding: 16,
    paddingLeft: 0,
  },
  notificationTitle: {
    fontFamily: "Poppins-Medium",
    marginBottom: 4,
  },
  notificationBody: {
    fontFamily: "Poppins-Regular",
    marginBottom: 8,
  },
  notificationDate: {
    fontFamily: "Poppins-Regular",
    marginBottom: 8,
  },
  actionButton: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  actionButtonText: {
    fontFamily: "Poppins-Medium",
  },
  deleteButton: {
    padding: 16,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    marginTop: 80,
  },
  emptyTitle: {
    fontFamily: "Poppins-Bold",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontFamily: "Poppins-Regular",
    textAlign: "center",
    marginBottom: 24,
  },
  testButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  testButtonText: {
    fontFamily: "Poppins-Medium",
  },
  settingsContainer: {
    flex: 1,
    padding: 16,
  },
  settingsTitle: {
    fontFamily: "Poppins-Bold",
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontFamily: "Poppins-Medium",
    marginBottom: 4,
  },
  settingDescription: {
    fontFamily: "Poppins-Regular",
  },
  quietHoursContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    marginTop: -8,
  },
  quietHoursText: {
    fontFamily: "Poppins-Regular",
    flex: 1,
  },
  editButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  editButtonText: {
    fontFamily: "Poppins-Medium",
  },
  testNotificationsContainer: {
    marginTop: 16,
    marginBottom: 24,
  },
  testTitle: {
    fontFamily: "Poppins-Bold",
    marginBottom: 16,
  },
  testButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  testTypeButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    flex: 1,
    marginHorizontal: 4,
    justifyContent: "center",
  },
  testButtonIcon: {
    marginRight: 8,
  },
})

