"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from "react-native"
import { useTranslation } from "../../hooks/useTranslation"
import { useTheme } from "../../contexts/ThemeContext"
import { useUtility } from "../../contexts/UtilityContext"
import { Ionicons } from "@expo/vector-icons"
import { useResponsive } from "../../hooks/useResponsive"
import { HouseholdComparisonChart } from "../../components/ui/HouseholdComparisonChart"
import { LinearGradient } from "expo-linear-gradient"
import { SafeAreaView } from "react-native-safe-area-context"

export default function BenchmarkScreen() {
  const { t } = useTranslation()
  const { colors, isDarkMode } = useTheme()
  const { energyData, neighborhoodData } = useUtility()
  const { scaledFontSize, spacing, isSmallScreen, dimensions } = useResponsive()
  const [selectedPeriod, setSelectedPeriod] = useState("week")
  const [layout, setLayout] = useState({ width: dimensions.width })

  // Calculate your home's usage
  const yourHomeUsage = energyData.slice(-30).reduce((sum, item) => sum + item.value, 0) / 30

  // Mock data for comparison
  const similarHomesUsage = yourHomeUsage * 1.2
  const efficientHomesUsage = yourHomeUsage * 0.7
  const neighborhoodUsage = yourHomeUsage * 1.1
  const cityAverageUsage = yourHomeUsage * 1.3

  // Update layout on orientation change
  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setLayout({ width: window.width })
    })
    return () => subscription.remove()
  }, [])

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={{ paddingBottom: spacing(4) }}
      >
        <View style={[styles.header, { marginBottom: spacing(2) }]}>
          <Text
            style={[
              styles.title,
              {
                color: colors.text,
                fontSize: scaledFontSize(24),
                marginBottom: spacing(2),
              },
            ]}
          >
            {t("compareUsage")}
          </Text>

          <View
            style={[
              styles.periodSelector,
              {
                backgroundColor: isDarkMode ? "rgba(255,255,255,0.08)" : "#F0F0F0",
                borderRadius: spacing(1.5),
                padding: spacing(0.5),
              },
            ]}
          >
            <TouchableOpacity
              style={[
                styles.periodButton,
                selectedPeriod === "week" && { backgroundColor: colors.primary },
                { borderRadius: spacing(1), paddingVertical: spacing(1) },
              ]}
              onPress={() => setSelectedPeriod("week")}
            >
              <Text
                style={[
                  styles.periodButtonText,
                  {
                    color: selectedPeriod === "week" ? colors.white : colors.text,
                    fontSize: scaledFontSize(14),
                  },
                ]}
              >
                Week
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.periodButton,
                selectedPeriod === "month" && { backgroundColor: colors.primary },
                { borderRadius: spacing(1), paddingVertical: spacing(1) },
              ]}
              onPress={() => setSelectedPeriod("month")}
            >
              <Text
                style={[
                  styles.periodButtonText,
                  {
                    color: selectedPeriod === "month" ? colors.white : colors.text,
                    fontSize: scaledFontSize(14),
                  },
                ]}
              >
                Month
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.periodButton,
                selectedPeriod === "year" && { backgroundColor: colors.primary },
                { borderRadius: spacing(1), paddingVertical: spacing(1) },
              ]}
              onPress={() => setSelectedPeriod("year")}
            >
              <Text
                style={[
                  styles.periodButtonText,
                  {
                    color: selectedPeriod === "year" ? colors.white : colors.text,
                    fontSize: scaledFontSize(14),
                  },
                ]}
              >
                Year
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Household Comparison Chart */}
        <HouseholdComparisonChart
          householdValue={yourHomeUsage}
          neighborhoodValue={neighborhoodUsage}
          efficientValue={efficientHomesUsage}
          unit="kWh"
          title="Energy Usage Comparison"
          subtitle="Your daily energy usage compared to others"
        />

        <View
          style={[
            styles.comparisonCards,
            {
              flexDirection: isSmallScreen || layout.width < 500 ? "column" : "row",
              marginTop: spacing(2),
              marginBottom: spacing(2),
            },
          ]}
        >
          <View
            style={[
              styles.comparisonCard,
              {
                backgroundColor: colors.card,
                borderWidth: 1,
                borderColor: isDarkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
                marginBottom: isSmallScreen || layout.width < 500 ? spacing(2) : 0,
                marginRight: isSmallScreen || layout.width < 500 ? 0 : spacing(1),
                padding: spacing(2),
                borderRadius: spacing(2),
              },
            ]}
          >
            <View style={styles.cardHeader}>
              <View
                style={[
                  styles.iconContainer,
                  {
                    backgroundColor: `${colors.primary}20`,
                    width: spacing(5),
                    height: spacing(5),
                    borderRadius: spacing(2.5),
                  },
                ]}
              >
                <Ionicons name="home-outline" size={spacing(2.5)} color={colors.primary} />
              </View>
              <Text
                style={[
                  styles.cardTitle,
                  {
                    color: colors.text,
                    fontSize: scaledFontSize(16),
                    marginLeft: spacing(1),
                  },
                ]}
              >
                {t("yourHome")}
              </Text>
            </View>
            <Text
              style={[
                styles.usageValue,
                {
                  color: colors.primary,
                  fontSize: scaledFontSize(20),
                  marginVertical: spacing(0.5),
                },
              ]}
            >
              {yourHomeUsage.toFixed(1)} {t("kWh")}
            </Text>
            <Text
              style={[
                styles.baselineText,
                {
                  color: colors.textSecondary,
                  fontSize: scaledFontSize(14),
                },
              ]}
            >
              Baseline
            </Text>
          </View>

          <View
            style={[
              styles.comparisonCard,
              {
                backgroundColor: colors.card,
                borderWidth: 1,
                borderColor: isDarkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
                marginLeft: isSmallScreen || layout.width < 500 ? 0 : spacing(1),
                padding: spacing(2),
                borderRadius: spacing(2),
              },
            ]}
          >
            <View style={styles.cardHeader}>
              <View
                style={[
                  styles.iconContainer,
                  {
                    backgroundColor: `${colors.secondary}20`,
                    width: spacing(5),
                    height: spacing(5),
                    borderRadius: spacing(2.5),
                  },
                ]}
              >
                <Ionicons name="people-outline" size={spacing(2.5)} color={colors.secondary} />
              </View>
              <Text
                style={[
                  styles.cardTitle,
                  {
                    color: colors.text,
                    fontSize: scaledFontSize(16),
                    marginLeft: spacing(1),
                  },
                ]}
              >
                {t("neighborhood")}
              </Text>
            </View>
            <Text
              style={[
                styles.usageValue,
                {
                  color: colors.secondary,
                  fontSize: scaledFontSize(20),
                  marginVertical: spacing(0.5),
                },
              ]}
            >
              {neighborhoodUsage.toFixed(1)} {t("kWh")}
            </Text>
            <View style={styles.percentageContainer}>
              <Ionicons
                name={yourHomeUsage < neighborhoodUsage ? "arrow-down-outline" : "arrow-up-outline"}
                size={spacing(2)}
                color={yourHomeUsage < neighborhoodUsage ? colors.success : colors.error}
                style={{ marginRight: spacing(0.5) }}
              />

              <Text
                style={[
                  styles.percentageText,
                  {
                    color: yourHomeUsage < neighborhoodUsage ? colors.success : colors.error,
                    fontSize: scaledFontSize(14),
                  },
                ]}
              >
                {Math.abs(((neighborhoodUsage - yourHomeUsage) / neighborhoodUsage) * 100).toFixed(0)}%
                {yourHomeUsage < neighborhoodUsage ? " less" : " more"}
              </Text>
            </View>
          </View>
        </View>

        <View
          style={[
            styles.efficiencyContainer,
            {
              backgroundColor: colors.card,
              borderWidth: 1,
              borderColor: isDarkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
              padding: spacing(2.5),
              borderRadius: spacing(2),
              marginBottom: spacing(2),
            },
          ]}
        >
          <Text
            style={[
              styles.efficiencyTitle,
              {
                color: colors.text,
                fontSize: scaledFontSize(16),
                marginBottom: spacing(1.5),
              },
            ]}
          >
            Your home is using {Math.abs(((cityAverageUsage - yourHomeUsage) / cityAverageUsage) * 100).toFixed(0)}%
            less energy than the city average
          </Text>
          <View style={[styles.efficiencyRating, { marginBottom: spacing(1.5) }]}>
            <Ionicons name="star" size={spacing(3)} color={colors.warning} />
            <Ionicons name="star" size={spacing(3)} color={colors.warning} />
            <Ionicons name="star" size={spacing(3)} color={colors.warning} />
            <Ionicons name="star" size={spacing(3)} color={colors.warning} />
            <Ionicons name="star-outline" size={spacing(3)} color={colors.warning} />
          </View>
          <Text
            style={[
              styles.efficiencyText,
              {
                color: colors.textSecondary,
                fontSize: scaledFontSize(14),
                textAlign: "center",
              },
            ]}
          >
            Great job! You're among the most energy-efficient homes in your area.
          </Text>
        </View>

        <View style={[styles.tipsContainer, { marginBottom: spacing(2) }]}>
          <LinearGradient
            colors={[colors.primary, `${colors.primary}D0`]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.tipGradient, { borderRadius: spacing(2) }]}
          >
            <View style={[styles.tipContent, { padding: spacing(2) }]}>
              <View
                style={[
                  styles.tipIconContainer,
                  {
                    width: spacing(5),
                    height: spacing(5),
                    borderRadius: spacing(2.5),
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    marginRight: spacing(1.5),
                  },
                ]}
              >
                <Ionicons name="bulb-outline" size={spacing(2.5)} color={colors.white} />
              </View>
              <Text
                style={[
                  styles.tipText,
                  {
                    color: colors.white,
                    fontSize: scaledFontSize(14),
                    flex: 1,
                  },
                ]}
              >
                You could save an additional 15% by upgrading to energy-efficient appliances.
              </Text>
            </View>
          </LinearGradient>
        </View>

        <View
          style={[
            styles.rankingCard,
            {
              backgroundColor: colors.card,
              borderWidth: 1,
              borderColor: isDarkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
              padding: spacing(2.5),
              borderRadius: spacing(2),
              marginBottom: spacing(2),
            },
          ]}
        >
          <Text
            style={[
              styles.rankingTitle,
              {
                color: colors.text,
                fontSize: scaledFontSize(18),
                marginBottom: spacing(2),
                textAlign: "center",
              },
            ]}
          >
            Your Efficiency Ranking
          </Text>

          <View
            style={[
              styles.rankingContainer,
              {
                flexDirection: isSmallScreen || layout.width < 500 ? "column" : "row",
                alignItems: "center",
              },
            ]}
          >
            <View
              style={[
                styles.rankingCircle,
                {
                  borderColor: colors.primary,
                  width: spacing(10),
                  height: spacing(10),
                  borderRadius: spacing(5),
                  borderWidth: 3,
                  marginRight: isSmallScreen || layout.width < 500 ? 0 : spacing(2),
                  marginBottom: isSmallScreen || layout.width < 500 ? spacing(2) : 0,
                },
              ]}
            >
              <Text
                style={[
                  styles.rankingNumber,
                  {
                    color: colors.primary,
                    fontSize: scaledFontSize(28),
                  },
                ]}
              >
                {neighborhoodData?.yourRank || 15}
              </Text>
              <Text
                style={[
                  styles.rankingLabel,
                  {
                    color: colors.textSecondary,
                    fontSize: scaledFontSize(12),
                  },
                ]}
              >
                of {neighborhoodData?.totalHomes || 100}
              </Text>
            </View>

            <View style={styles.rankingInfo}>
              <Text
                style={[
                  styles.rankingText,
                  {
                    color: colors.text,
                    fontSize: scaledFontSize(14),
                    marginBottom: spacing(1.5),
                    textAlign: isSmallScreen || layout.width < 500 ? "center" : "left",
                  },
                ]}
              >
                You're in the top {neighborhoodData?.yourRank || 15}% of energy-efficient homes in your area.
              </Text>

              <View
                style={[
                  styles.rankingStats,
                  {
                    flexDirection: "row",
                    justifyContent: "space-between",
                    gap: spacing(1),
                  },
                ]}
              >
                <View
                  style={[
                    styles.rankingStat,
                    {
                      backgroundColor: isDarkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
                      borderRadius: spacing(1.5),
                      padding: spacing(1.25),
                      flex: 1,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.rankingStatValue,
                      {
                        color: colors.primary,
                        fontSize: scaledFontSize(16),
                      },
                    ]}
                  >
                    {Math.abs(((neighborhoodUsage - yourHomeUsage) / neighborhoodUsage) * 100).toFixed(0)}%
                  </Text>
                  <Text
                    style={[
                      styles.rankingStatLabel,
                      {
                        color: colors.textSecondary,
                        fontSize: scaledFontSize(12),
                      },
                    ]}
                  >
                    Below Average
                  </Text>
                </View>

                <View
                  style={[
                    styles.rankingStat,
                    {
                      backgroundColor: isDarkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
                      borderRadius: spacing(1.5),
                      padding: spacing(1.25),
                      flex: 1,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.rankingStatValue,
                      {
                        color: colors.success,
                        fontSize: scaledFontSize(16),
                      },
                    ]}
                  >
                    {Math.abs(((efficientHomesUsage - yourHomeUsage) / efficientHomesUsage) * 100).toFixed(0)}%
                  </Text>
                  <Text
                    style={[
                      styles.rankingStatLabel,
                      {
                        color: colors.textSecondary,
                        fontSize: scaledFontSize(12),
                      },
                    ]}
                  >
                    From Efficient
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontFamily: "Poppins-Bold",
  },
  periodSelector: {
    flexDirection: "row",
    borderRadius: 12,
  },
  periodButton: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: 2,
  },
  periodButtonText: {
    fontFamily: "Poppins-Medium",
  },
  comparisonCards: {
    justifyContent: "space-between",
  },
  comparisonCard: {
    flex: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  cardTitle: {
    fontFamily: "Poppins-Medium",
  },
  usageValue: {
    fontFamily: "Poppins-Bold",
  },
  baselineText: {
    fontFamily: "Poppins-Regular",
  },
  percentageContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  percentageText: {
    fontFamily: "Poppins-Medium",
  },
  efficiencyContainer: {
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  efficiencyTitle: {
    fontFamily: "Poppins-Medium",
    textAlign: "center",
  },
  efficiencyRating: {
    flexDirection: "row",
  },
  efficiencyText: {
    fontFamily: "Poppins-Regular",
  },
  tipsContainer: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  tipGradient: {
    overflow: "hidden",
  },
  tipContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  tipIconContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  tipText: {
    fontFamily: "Poppins-Medium",
  },
  rankingCard: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  rankingTitle: {
    fontFamily: "Poppins-Bold",
  },
  rankingContainer: {
    alignItems: "center",
  },
  rankingCircle: {
    justifyContent: "center",
    alignItems: "center",
  },
  rankingNumber: {
    fontFamily: "Poppins-Bold",
  },
  rankingLabel: {
    fontFamily: "Poppins-Regular",
  },
  rankingInfo: {
    flex: 1,
  },
  rankingText: {
    fontFamily: "Poppins-Regular",
  },
  rankingStats: {
    justifyContent: "space-between",
  },
  rankingStat: {
    alignItems: "center",
    justifyContent: "center",
  },
  rankingStatValue: {
    fontFamily: "Poppins-Bold",
  },
  rankingStatLabel: {
    fontFamily: "Poppins-Regular",
  },
})

