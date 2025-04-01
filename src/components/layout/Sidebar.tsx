"use client"

import type React from "react"
import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native"
import { useTheme } from "../../contexts/ThemeContext"
import { useNavigation, useRoute } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import { useLanguage } from "../../contexts/LanguageContext"
import { useResponsive } from "../../hooks/useResponsive"

type MenuItem = {
  key: string
  label: string
  icon: string
  screen: string
}

type SidebarProps = {
  isVisible?: boolean
  onToggle?: () => void
}

export const Sidebar: React.FC<SidebarProps> = ({ isVisible = true, onToggle }) => {
  const { colors } = useTheme()
  const navigation = useNavigation()
  const route = useRoute()
  const { locale, setLocale } = useLanguage()
  const { isSmallScreen, isMediumScreen, isLandscape, dimensions, spacing } = useResponsive()
  const [collapsed, setCollapsed] = useState(isSmallScreen || isMediumScreen)

  const menuItems: MenuItem[] = [
    { key: "dashboard", label: "Dashboard", icon: "grid-outline", screen: "Dashboard" },
    { key: "analytics", label: "Analytics", icon: "bar-chart-outline", screen: "Analytics" },
    { key: "profile", label: "Profile", icon: "person-outline", screen: "Profile" },
    { key: "notifications", label: "Notifications", icon: "notifications-outline", screen: "Notifications" },
    { key: "settings", label: "Settings", icon: "settings-outline", screen: "Settings" },

    
  ]

  const isActive = (screenName: string) => {
    return route.name === screenName
  }

  const handleNavigation = (screenName: string) => {
    navigation.navigate(screenName as never)
    if (isSmallScreen && onToggle) {
      onToggle()
    }
  }

  const toggleLanguage = () => {
    setLocale(locale === "en" ? "sw" : "en")
  }

  const toggleCollapse = () => {
    setCollapsed(!collapsed)
  }

  // For small screens in portrait, the sidebar should be a modal overlay
  if (!isVisible && (isSmallScreen || (isMediumScreen && !isLandscape))) {
    return null
  }

  const sidebarWidth = collapsed ? 70 : 240

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          width: sidebarWidth,
        },
      ]}
    >
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image source={require("../../../assets/images/logo.png")} style={styles.logo} />
          {!collapsed && <Text style={[styles.logoText, { color: colors.text }]}>SmartMita</Text>}
        </View>

        <TouchableOpacity
          style={[styles.collapseButton, { backgroundColor: `${colors.primary}15` }]}
          onPress={toggleCollapse}
        >
          <Ionicons name={collapsed ? "chevron-forward" : "chevron-back"} size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {!collapsed && (
        <TouchableOpacity
          style={[styles.languageButton, { backgroundColor: colors.background }]}
          onPress={toggleLanguage}
        >
          <Ionicons name="globe-outline" size={16} color={colors.primary} style={styles.languageIcon} />
          <Text style={[styles.languageText, { color: colors.text }]}>{locale === "en" ? "English" : "Kiswahili"}</Text>
        </TouchableOpacity>
      )}

      <View style={styles.menuContainer}>
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.key}
            style={[
              styles.menuItem,
              isActive(item.screen) && [styles.activeMenuItem, { backgroundColor: `${colors.primary}15` }],
              collapsed && styles.collapsedMenuItem,
            ]}
            onPress={() => handleNavigation(item.screen)}
          >
            <Ionicons
              name={item.icon as any}
              size={22}
              color={isActive(item.screen) ? colors.primary : colors.textSecondary}
              style={collapsed ? styles.centeredIcon : styles.menuIcon}
            />
            {!collapsed && (
              <Text style={[styles.menuText, { color: isActive(item.screen) ? colors.primary : colors.textSecondary }]}>
                {item.label}
              </Text>
            )}
            {isActive(item.screen) && (
              <View
                style={[
                  styles.activeIndicator,
                  { backgroundColor: colors.primary },
                  collapsed && styles.collapsedActiveIndicator,
                ]}
              />
            )}
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.logoutButton, { borderTopColor: colors.border }, collapsed && styles.collapsedLogoutButton]}
        onPress={() => navigation.navigate("Login" as never)}
      >
        <Ionicons
          name="log-out-outline"
          size={22}
          color={colors.error}
          style={collapsed ? styles.centeredIcon : styles.menuIcon}
        />
        {!collapsed && <Text style={[styles.logoutText, { color: colors.error }]}>Log Out</Text>}
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    borderRightWidth: 1,
    paddingVertical: 24,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 32,
    height: 32,
    marginRight: 8,
  },
  logoText: {
    fontSize: 18,
    fontFamily: "Poppins-Bold",
  },
  collapseButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  languageButton: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 24,
  },
  languageIcon: {
    marginRight: 8,
  },
  languageText: {
    fontSize: 14,
    fontFamily: "Poppins-Medium",
  },
  menuContainer: {
    flex: 1,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    position: "relative",
  },
  collapsedMenuItem: {
    justifyContent: "center",
    paddingHorizontal: 0,
  },
  activeMenuItem: {
    borderRadius: 8,
  },
  menuIcon: {
    marginRight: 12,
  },
  centeredIcon: {
    marginRight: 0,
  },
  menuText: {
    fontSize: 15,
    fontFamily: "Poppins-Medium",
  },
  activeIndicator: {
    position: "absolute",
    left: 0,
    top: "50%",
    width: 4,
    height: 20,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
    transform: [{ translateY: -10 }],
  },
  collapsedActiveIndicator: {
    left: 0,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    marginTop: 16,
  },
  collapsedLogoutButton: {
    justifyContent: "center",
    paddingHorizontal: 0,
  },
  logoutText: {
    fontSize: 15,
    fontFamily: "Poppins-Medium",
  },
})

