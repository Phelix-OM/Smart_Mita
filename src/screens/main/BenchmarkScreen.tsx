"use client"

import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native"
import { useTranslation } from "../../hooks/useTranslation"
import { useTheme } from "../../contexts/ThemeContext"
import { useUtility } from "../../contexts/UtilityContext"
import { Ionicons } from "@expo/vector-icons"
import { useResponsive } from "../../hooks/useResponsive"
import { HouseholdComparisonChart } from "../../components/ui/HouseholdComparisonChart"

export default function BenchmarkScreen() {
  const { t } = useTranslation()
  const { colors } = useTheme()
  const { energyData, neighborhoodData } = useUtility()
  const { scaledFontSize, spacing, isSmallScreen } = useResponsive()
  const [selectedPeriod, setSelectedPeriod] = useState("week")

  // Calculate your home's usage
  const yourHomeUsage = energyData.slice(-30).reduce((sum, item) => sum + item.value, 0) / 30

  // Mock data for comparison
  const similarHomesUsage = yourHomeUsage * 1.2
  const efficientHomesUsage = yourHomeUsage * 0.7
  const neighborhoodUsage = yourHomeUsage * 1.1
  const cityAverageUsage = yourHomeUsage * 1.3

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text, fontSize: scaledFontSize(24) }]}>{t("compareUsage")}</Text>
        <View style={[styles.periodSelector, { backgroundColor: "#F0F0F0", borderRadius: spacing(1) }]}>
          <TouchableOpacity
            style={[
              styles.periodButton,
              selectedPeriod === "week" && { backgroundColor: colors.primary },
              { borderRadius: spacing(0.75) },
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
              { borderRadius: spacing(0.75) },
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
              { borderRadius: spacing(0.75) },
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

      <View style={styles.comparisonCards}>
        <View style={[styles.comparisonCard, { backgroundColor: colors.card }]}>
          <View style={styles.cardHeader}>
            <Ionicons name="home-outline" size={24} color={colors.primary} />
            <Text style={[styles.cardTitle, { color: colors.text, fontSize: scaledFontSize(16) }]}>
              {t("yourHome")}
            </Text>
          </View>
          <Text style={[styles.usageValue, { color: colors.primary, fontSize: scaledFontSize(20) }]}>
            {yourHomeUsage.toFixed(1)} {t("kWh")}
          </Text>
          <Text style={[styles.baselineText, { color: colors.text, fontSize: scaledFontSize(14) }]}>Baseline</Text>
        </View>

        <View style={[styles.comparisonCard, { backgroundColor: colors.card }]}>
          <View style={styles.cardHeader}>
            <Ionicons name="people-outline" size={24} color={colors.secondary} />
            <Text style={[styles.cardTitle, { color: colors.text, fontSize: scaledFontSize(16) }]}>
              {t("neighborhood")}
            </Text>
          </View>
          <Text style={[styles.usageValue, { color: colors.secondary, fontSize: scaledFontSize(20) }]}>
            {neighborhoodUsage.toFixed(1)} {t("kWh")}
          </Text>
          <View style={styles.percentageContainer}>
          <Ionicons
  name={yourHomeUsage < neighborhoodUsage ? "arrow-down-outline" : "arrow-up-outline"}
  size={16}
  color={yourHomeUsage < neighborhoodUsage ? colors.success : colors.error}
  style={styles.changeIcon}
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

      <View style={[styles.efficiencyContainer, { backgroundColor: colors.card }]}>
        <Text style={[styles.efficiencyTitle, { color: colors.text, fontSize: scaledFontSize(16) }]}>
          Your home is using {Math.abs(((cityAverageUsage - yourHomeUsage) / cityAverageUsage) * 100).toFixed(0)}% less
          energy than the city average
        </Text>
        <View style={styles.efficiencyRating}>
          <Ionicons name="star" size={24} color={colors.warning} />
          <Ionicons name="star" size={24} color={colors.warning} />
          <Ionicons name="star" size={24} color={colors.warning} />
          <Ionicons name="star" size={24} color={colors.warning} />
          <Ionicons name="star-outline" size={24} color={colors.warning} />
        </View>
        <Text style={[styles.efficiencyText, { color: colors.text, fontSize: scaledFontSize(14) }]}>
          Great job! You're among the most energy-efficient homes in your area.
        </Text>
      </View>

      <View style={[styles.tipsContainer, { backgroundColor: colors.primary }]}>
        <Ionicons name="bulb-outline" size={24} color={colors.white} />
        <Text style={[styles.tipText, { color: colors.white, fontSize: scaledFontSize(14) }]}>
          You could save an additional 15% by upgrading to energy-efficient appliances.
        </Text>
      </View>

      <View style={[styles.rankingCard, { backgroundColor: colors.card }]}>
        <Text style={[styles.rankingTitle, { color: colors.text, fontSize: scaledFontSize(18) }]}>
          Your Efficiency Ranking
        </Text>

        <View style={styles.rankingContainer}>
          <View style={[styles.rankingCircle, { borderColor: colors.primary }]}>
            <Text style={[styles.rankingNumber, { color: colors.primary, fontSize: scaledFontSize(28) }]}>
              {neighborhoodData?.yourRank || 15}
            </Text>
            <Text style={[styles.rankingLabel, { color: colors.textSecondary, fontSize: scaledFontSize(12) }]}>
              of {neighborhoodData?.totalHomes || 100}
            </Text>
          </View>

          <View style={styles.rankingInfo}>
            <Text style={[styles.rankingText, { color: colors.text, fontSize: scaledFontSize(14) }]}>
              You're in the top {neighborhoodData?.yourRank || 15}% of energy-efficient homes in your area.
            </Text>

            <View style={styles.rankingStats}>
              <View style={styles.rankingStat}>
                <Text style={[styles.rankingStatValue, { color: colors.primary, fontSize: scaledFontSize(16) }]}>
                  {Math.abs(((neighborhoodUsage - yourHomeUsage) / neighborhoodUsage) * 100).toFixed(0)}%
                </Text>
                <Text style={[styles.rankingStatLabel, { color: colors.textSecondary, fontSize: scaledFontSize(12) }]}>
                  Below Average
                </Text>
              </View>

              <View style={styles.rankingStat}>
                <Text style={[styles.rankingStatValue, { color: colors.tertiary, fontSize: scaledFontSize(16) }]}>
                  {Math.abs(((efficientHomesUsage - yourHomeUsage) / efficientHomesUsage) * 100).toFixed(0)}%
                </Text>
                <Text style={[styles.rankingStatLabel, { color: colors.textSecondary, fontSize: scaledFontSize(12) }]}>
                  From Efficient
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
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
    fontSize: 24,
    fontFamily: "Poppins-Bold",
    marginBottom: 16,
  },
  periodSelector: {
    flexDirection: "row",
    padding: 4,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
  },
  periodButtonText: {
    fontFamily: "Poppins-Medium",
  },
  comparisonCards: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    marginBottom: 16,
  },
  comparisonCard: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
    marginLeft: 8,
  },
  usageValue: {
    fontSize: 20,
    fontFamily: "Poppins-Bold",
    marginVertical: 4,
  },
  baselineText: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
  },
  percentageContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  changeIcon: {
    marginRight: 4,
  },
  percentageText: {
    fontSize: 14,
    fontFamily: "Poppins-Medium",
  },
  efficiencyContainer: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    alignItems: "center",
  },
  efficiencyTitle: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
    textAlign: "center",
    marginBottom: 12,
  },
  efficiencyRating: {
    flexDirection: "row",
    marginBottom: 12,
  },
  efficiencyText: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    textAlign: "center",
  },
  tipsContainer: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  tipText: {
    fontSize: 14,
    fontFamily: "Poppins-Medium",
    marginLeft: 12,
    flex: 1,
  },
  rankingCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  rankingTitle: {
    fontSize: 18,
    fontFamily: "Poppins-Bold",
    marginBottom: 16,
    textAlign: "center",
  },
  rankingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rankingCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
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
    marginBottom: 12,
  },
  rankingStats: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  rankingStat: {
    alignItems: "center",
  },
  rankingStatValue: {
    fontFamily: "Poppins-Bold",
  },
  rankingStatLabel: {
    fontFamily: "Poppins-Regular",
  },
})

