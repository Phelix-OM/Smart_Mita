"use client"

import type React from "react"
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native"
import { useTheme } from "../../contexts/ThemeContext"
import { useResponsive } from "../../hooks/useResponsive"

type Tab = {
  key: string
  title: string
}

type TabBarProps = {
  tabs: Tab[]
  activeTab: string
  onTabChange: (tabKey: string) => void
}

export const TabBar: React.FC<TabBarProps> = ({ tabs, activeTab, onTabChange }) => {
  const { colors } = useTheme()
  const { isSmallScreen, scaledFontSize, spacing } = useResponsive()

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={[styles.scrollContainer, { backgroundColor: colors.background }]}
    >
      <View style={styles.container}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.tab,
              {
                marginRight: spacing(1),
                paddingVertical: spacing(1.5),
                paddingHorizontal: spacing(2),
              },
              activeTab === tab.key && [styles.activeTab, { borderBottomColor: colors.primary }],
            ]}
            onPress={() => onTabChange(tab.key)}
          >
            <Text
              style={[
                styles.tabText,
                {
                  color: activeTab === tab.key ? colors.primary : colors.textSecondary,
                  fontSize: scaledFontSize(isSmallScreen ? 13 : 15),
                },
              ]}
            >
              {tab.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 0,
  },
  container: {
    flexDirection: "row",
    marginBottom: 16,
  },
  tab: {
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomWidth: 2,
  },
  tabText: {
    fontFamily: "Poppins-Medium",
  },
})

