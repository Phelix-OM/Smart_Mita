"use client"

import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native"
import { useTranslation } from "../../hooks/useTranslation"
import { useTheme } from "../../contexts/ThemeContext"
import { useUtility } from "../../contexts/UtilityContext"
import { BarChart } from "react-native-chart-kit"
import { Dimensions } from "react-native"
import { Ionicons } from "@expo/vector-icons"

const { width } = Dimensions.get("window")

export default function BenchmarkScreen() {
  const { t } = useTranslation()
  const { colors } = useTheme()
  const { energyData } = useUtility()
  const [selectedPeriod, setSelectedPeriod] = useState("week")

  // Calculate your home's usage
  const yourHomeUsage = energyData.slice(-30).reduce((sum, item) => sum + item.value, 0)

  // Mock data for comparison
  const similarHomesUsage = yourHomeUsage * 1.2
  const efficientHomesUsage = yourHomeUsage * 0.7
  const neighborhoodUsage = yourHomeUsage * 1.1
  const cityAverageUsage = yourHomeUsage * 1.3

  // Prepare data for the chart
  const chartData = {
    labels: [t("yourHome"), t("similarHomes"), t("efficientHomes")],
    datasets: [
      {
        data: [yourHomeUsage, similarHomesUsage, efficientHomesUsage],
        colors: [() => colors.primary, () => colors.secondary, () => colors.success],
      },
    ],
  }

  const chartConfig = {
    backgroundGradientFrom: colors.card,
    backgroundGradientTo: colors.card,
    decimalPlaces: 0,
    color: (opacity = 1, index = 0) => {
      const colorList = [colors.primary, colors.secondary, colors.success]
      return colorList[index] || colors.primary
    },
    labelColor: () => colors.text,
    style: {
      borderRadius: 16,
    },
    barPercentage: 0.6,
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>{t("compareUsage")}</Text>
        <View style={styles.periodSelector}>
          <TouchableOpacity
            style={[styles.periodButton, selectedPeriod === "week" && { backgroundColor: colors.primary }]}
            onPress={() => setSelectedPeriod("week")}
          >
            <Text style={[styles.periodButtonText, { color: selectedPeriod === "week" ? colors.white : colors.text }]}>
              Week
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.periodButton, selectedPeriod === "month" && { backgroundColor: colors.primary }]}
            onPress={() => setSelectedPeriod("month")}
          >
            <Text style={[styles.periodButtonText, { color: selectedPeriod === "month" ? colors.white : colors.text }]}>
              Month
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.periodButton, selectedPeriod === "year" && { backgroundColor: colors.primary }]}
            onPress={() => setSelectedPeriod("year")}
          >
            <Text style={[styles.periodButtonText, { color: selectedPeriod === "year" ? colors.white : colors.text }]}>
              Year
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.chartContainer, { backgroundColor: colors.card }]}>
        <BarChart
          data={chartData}
          width={width - 40}
          height={220}
          chartConfig={chartConfig}
          style={styles.chart}
          fromZero
          showValuesOnTopOfBars
          yAxisLabel=""
          yAxisSuffix="kWh"
        />
      </View>

      <View style={styles.comparisonCards}>
        <View style={[styles.comparisonCard, { backgroundColor: colors.card }]}>
          <View style={styles.cardHeader}>
            <Ionicons name="home-outline" size={24} color={colors.primary} />
            <Text style={[styles.cardTitle, { color: colors.text }]}>{t("yourHome")}</Text>
          </View>
          <Text style={[styles.usageValue, { color: colors.primary }]}>
            {yourHomeUsage.toFixed(1)} {t("kWh")}
          </Text>
          <Text style={[styles.baselineText, { color: colors.text }]}>Baseline</Text>
        </View>

        <View style={[styles.comparisonCard, { backgroundColor: colors.card }]}>
          <View style={styles.cardHeader}>
            <Ionicons name="people-outline" size={24} color={colors.secondary} />
            <Text style={[styles.cardTitle, { color: colors.text }]}>{t("neighborhood")}</Text>
          </View>
          <Text style={[styles.usageValue, { color: colors.secondary }]}>
            {neighborhoodUsage.toFixed(1)} {t("kWh")}
          </Text>
          <View style={styles.percentageContainer}>
            <Ionicons name="arrow-up-outline" size={16} color={colors.error} />
            <Text style={[styles.percentageText, { color: colors.error }]}>+10%</Text>
          </View>
        </View>
      </View>

      <View style={[styles.efficiencyContainer, { backgroundColor: colors.card }]}>
        <Text style={[styles.efficiencyTitle, { color: colors.text }]}>
          Your home is using 30% less energy than the city average
        </Text>
        <View style={styles.efficiencyRating}>
          <Ionicons name="star" size={24} color={colors.warning} />
          <Ionicons name="star" size={24} color={colors.warning} />
          <Ionicons name="star" size={24} color={colors.warning} />
          <Ionicons name="star" size={24} color={colors.warning} />
          <Ionicons name="star-outline" size={24} color={colors.warning} />
        </View>
        <Text style={[styles.efficiencyText, { color: colors.text }]}>
          Great job! You're among the most energy-efficient homes in your area.
        </Text>
      </View>

      <View style={[styles.tipsContainer, { backgroundColor: colors.primary }]}>
        <Ionicons name="bulb-outline" size={24} color={colors.white} />
        <Text style={[styles.tipText, { color: colors.white }]}>
          You could save an additional 15% by upgrading to energy-efficient appliances.
        </Text>
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
    backgroundColor: "#F0F0F0",
    borderRadius: 8,
    padding: 4,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 6,
  },
  periodButtonText: {
    fontFamily: "Poppins-Medium",
    fontSize: 14,
  },
  chartContainer: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  chart: {
    borderRadius: 16,
    marginVertical: 8,
  },
  comparisonCards: {
    flexDirection: "row",
    justifyContent: "space-between",
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
  percentageText: {
    fontSize: 14,
    fontFamily: "Poppins-Medium",
    marginLeft: 4,
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
})

