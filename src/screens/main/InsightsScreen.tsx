"use client"

import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from "react-native"
import { useTranslation } from "../../hooks/useTranslation"
import { useTheme } from "../../contexts/ThemeContext"
import { LineChart } from "react-native-chart-kit"
import { Dimensions } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useResponsive } from "../../hooks/useResponsive"
import { useUtility } from "../../contexts/UtilityContext"

const { width } = Dimensions.get("window")

export default function InsightsScreen() {
  const { t } = useTranslation()
  const { colors } = useTheme()
  const { refreshEnergyData } = useUtility()
  const { scaledFontSize, spacing, isSmallScreen, dimensions } = useResponsive()

  const [selectedTab, setSelectedTab] = useState("patterns")
  const [isLoading, setIsLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [implementedRecommendations, setImplementedRecommendations] = useState<string[]>([])

  // Mock data for usage patterns
  const hourlyData = {
    labels: ["6am", "9am", "12pm", "3pm", "6pm", "9pm"],
    datasets: [
      {
        data: [2, 3.5, 5, 4, 7, 6],
        color: () => colors.primary,
        strokeWidth: 2,
      },
    ],
  }

  const chartConfig = {
    backgroundGradientFrom: colors.card,
    backgroundGradientTo: colors.card,
    decimalPlaces: 1,
    color: () => colors.text,
    labelColor: () => colors.text,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: colors.primary,
    },
  }

  // Mock data for high usage devices
  const devices: { id: string; name: string; usage: number; icon: "snow-outline" | "water-outline" | "thermometer-outline" | "bulb-outline" | "apps-outline" }[] = [
      { id: "1", name: "Air Conditioner", usage: 45, icon: "snow-outline" },
      { id: "2", name: "Water Heater", usage: 20, icon: "water-outline" },
      { id: "3", name: "Refrigerator", usage: 15, icon: "thermometer-outline" },
      { id: "4", name: "Lighting", usage: 10, icon: "bulb-outline" },
      { id: "5", name: "Other Devices", usage: 10, icon: "apps-outline" },
  ]

  // Mock data for recommendations
  type IoniconName = "snow-outline" | "water-outline" | "thermometer-outline" | "bulb-outline" | "power-outline";
  
  const recommendations: { id: string; title: string; description: string; savings: number; icon: IoniconName }[] = [
    {
      id: "1",
      title: "Reduce AC Usage",
      description: "Set your AC to 24°C instead of 20°C to save up to 20% on cooling costs.",
      savings: 15,
      icon: "snow-outline",
    },
    {
      id: "2",
      title: "Switch to LED Lighting",
      description: "Replace traditional bulbs with LED lights to save up to 80% on lighting costs.",
      savings: 10,
      icon: "bulb-outline",
    },
    {
      id: "3",
      title: "Unplug Standby Devices",
      description: "Unplug devices when not in use to eliminate standby power consumption.",
      savings: 8,
      icon: "power-outline",
    },
  ]

  const onRefresh = async () => {
    setRefreshing(true)
    try {
      await refreshEnergyData()
    } catch (error) {
      console.error("Failed to refresh data:", error)
    } finally {
      setRefreshing(false)
    }
  }

  const handleImplementRecommendation = (id: string) => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setImplementedRecommendations((prev) => [...prev, id])
      setIsLoading(false)

      const recommendation = recommendations.find((r) => r.id === id)
      if (recommendation) {
        Alert.alert(
          "Recommendation Implemented",
          `You've implemented "${recommendation.title}". This could save you up to ${recommendation.savings}% on your energy bill.`,
          [{ text: "Great!" }],
        )
      }
    }, 1000)
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />}
    >
      <View
        style={[
          styles.tabContainer,
          {
            backgroundColor: "#F0F0F0",
            borderRadius: spacing(1),
            padding: spacing(0.5),
            marginBottom: spacing(2),
          },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.tab,
            {
              borderRadius: spacing(0.75),
              paddingVertical: spacing(1),
            },
            selectedTab === "patterns" && { backgroundColor: colors.primary },
          ]}
          onPress={() => setSelectedTab("patterns")}
        >
          <Text
            style={[
              styles.tabText,
              {
                color: selectedTab === "patterns" ? colors.white : colors.text,
                fontSize: scaledFontSize(isSmallScreen ? 12 : 14),
              },
            ]}
          >
            {t("usagePatterns")}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            {
              borderRadius: spacing(0.75),
              paddingVertical: spacing(1),
            },
            selectedTab === "devices" && { backgroundColor: colors.primary },
          ]}
          onPress={() => setSelectedTab("devices")}
        >
          <Text
            style={[
              styles.tabText,
              {
                color: selectedTab === "devices" ? colors.white : colors.text,
                fontSize: scaledFontSize(isSmallScreen ? 12 : 14),
              },
            ]}
          >
            {t("highUsageDevices")}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            {
              borderRadius: spacing(0.75),
              paddingVertical: spacing(1),
            },
            selectedTab === "recommendations" && { backgroundColor: colors.primary },
          ]}
          onPress={() => setSelectedTab("recommendations")}
        >
          <Text
            style={[
              styles.tabText,
              {
                color: selectedTab === "recommendations" ? colors.white : colors.text,
                fontSize: scaledFontSize(isSmallScreen ? 12 : 14),
              },
            ]}
          >
            {t("recommendations")}
          </Text>
        </TouchableOpacity>
      </View>

      {selectedTab === "patterns" && (
        <>
          <View
            style={[
              styles.chartContainer,
              {
                backgroundColor: colors.card,
                borderRadius: spacing(2),
                padding: spacing(2),
                marginBottom: spacing(2),
              },
            ]}
          >
            <Text
              style={[
                styles.chartTitle,
                {
                  color: colors.text,
                  fontSize: scaledFontSize(18),
                },
              ]}
            >
              {t("usagePatterns")}
            </Text>
            <LineChart
              data={hourlyData}
              width={dimensions.width - (isSmallScreen ? 40 : 60)}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
            />
          </View>

          <View
            style={[
              styles.insightCard,
              {
                backgroundColor: colors.card,
                borderRadius: spacing(2),
                padding: spacing(2),
                marginBottom: spacing(2),
              },
            ]}
          >
            <View style={styles.insightHeader}>
              <Ionicons name="time-outline" size={24} color={colors.primary} />
              <Text
                style={[
                  styles.insightTitle,
                  {
                    color: colors.text,
                    fontSize: scaledFontSize(18),
                    marginLeft: spacing(1),
                  },
                ]}
              >
                {t("peakHours")}
              </Text>
            </View>
            <Text
              style={[
                styles.insightText,
                {
                  color: colors.text,
                  fontSize: scaledFontSize(14),
                  lineHeight: scaledFontSize(20),
                },
              ]}
            >
              Your peak energy usage occurs between 6PM and 9PM. Consider shifting some activities to off-peak hours to
              reduce costs.
            </Text>
          </View>

          <View
            style={[
              styles.insightCard,
              {
                backgroundColor: colors.card,
                borderRadius: spacing(2),
                padding: spacing(2),
                marginBottom: spacing(2),
              },
            ]}
          >
            <View style={styles.insightHeader}>
              <Ionicons name="trending-up-outline" size={24} color={colors.warning} />
              <Text
                style={[
                  styles.insightTitle,
                  {
                    color: colors.text,
                    fontSize: scaledFontSize(18),
                    marginLeft: spacing(1),
                  },
                ]}
              >
                Weekly Trend
              </Text>
            </View>
            <Text
              style={[
                styles.insightText,
                {
                  color: colors.text,
                  fontSize: scaledFontSize(14),
                  lineHeight: scaledFontSize(20),
                },
              ]}
            >
              Your energy usage has increased by 15% compared to last week. This might be due to increased AC usage
              during the recent heat wave.
            </Text>
          </View>
        </>
      )}

      {selectedTab === "devices" && (
        <>
          <View
            style={[
              styles.deviceContainer,
              {
                backgroundColor: colors.card,
                borderRadius: spacing(2),
                padding: spacing(2),
                marginBottom: spacing(2),
              },
            ]}
          >
            <Text
              style={[
                styles.deviceTitle,
                {
                  color: colors.text,
                  fontSize: scaledFontSize(18),
                  marginBottom: spacing(2),
                },
              ]}
            >
              {t("highUsageDevices")}
            </Text>

            {devices.map((device) => (
              <View key={device.id} style={[styles.deviceItem, { marginBottom: spacing(2) }]}>
                <View style={styles.deviceInfo}>
                  <View
                    style={[
                      styles.deviceIconContainer,
                      {
                        backgroundColor: colors.primary + "20",
                        width: spacing(5),
                        height: spacing(5),
                        borderRadius: spacing(2.5),
                      },
                    ]}
                  >
                    <Ionicons name={device.icon} size={24} color={colors.primary} />
                  </View>
                  <Text
                    style={[
                      styles.deviceName,
                      {
                        color: colors.text,
                        fontSize: scaledFontSize(16),
                        marginLeft: spacing(1.5),
                      },
                    ]}
                  >
                    {device.name}
                  </Text>
                </View>
                <View style={styles.deviceUsage}>
                  <Text
                    style={[
                      styles.deviceUsageText,
                      {
                        color: colors.primary,
                        fontSize: scaledFontSize(16),
                        fontFamily: "Poppins-Bold",
                      },
                    ]}
                  >
                    {device.usage}%
                  </Text>
                </View>
              </View>
            ))}
          </View>

          <View
            style={[
              styles.insightCard,
              {
                backgroundColor: colors.card,
                borderRadius: spacing(2),
                padding: spacing(2),
                marginBottom: spacing(2),
              },
            ]}
          >
            <View style={styles.insightHeader}>
              <Ionicons name="flash-outline" size={24} color={colors.warning} />
              <Text
                style={[
                  styles.insightTitle,
                  {
                    color: colors.text,
                    fontSize: scaledFontSize(18),
                    marginLeft: spacing(1),
                  },
                ]}
              >
                Device Insight
              </Text>
            </View>
            <Text
              style={[
                styles.insightText,
                {
                  color: colors.text,
                  fontSize: scaledFontSize(14),
                  lineHeight: scaledFontSize(20),
                },
              ]}
            >
              Your air conditioner accounts for nearly half of your energy consumption. Consider setting it to a higher
              temperature or using a fan when possible.
            </Text>
          </View>
        </>
      )}

      {selectedTab === "recommendations" && (
        <>
          <View
            style={[
              styles.savingsContainer,
              {
                backgroundColor: colors.primary,
                borderRadius: spacing(2),
                padding: spacing(2),
                marginBottom: spacing(2),
              },
            ]}
          >
            <Text
              style={[
                styles.savingsTitle,
                {
                  color: colors.white,
                  fontSize: scaledFontSize(18),
                  marginBottom: spacing(1),
                },
              ]}
            >
              {t("potentialSavings")}
            </Text>
            <Text
              style={[
                styles.savingsAmount,
                {
                  color: colors.white,
                  fontSize: scaledFontSize(36),
                  marginBottom: spacing(1),
                },
              ]}
            >
              33%
            </Text>
            <Text
              style={[
                styles.savingsText,
                {
                  color: colors.white,
                  fontSize: scaledFontSize(14),
                  textAlign: "center",
                },
              ]}
            >
              Follow these recommendations to reduce your energy consumption and save money.
            </Text>
          </View>

          {recommendations.map((recommendation) => (
            <View
              key={recommendation.id}
              style={[
                styles.recommendationCard,
                {
                  backgroundColor: colors.card,
                  borderRadius: spacing(2),
                  padding: spacing(2),
                  marginBottom: spacing(2),
                },
              ]}
            >
              <View style={styles.recommendationHeader}>
                <View
                  style={[
                    styles.recommendationIconContainer,
                    {
                      backgroundColor: colors.primary + "20",
                      width: spacing(6),
                      height: spacing(6),
                      borderRadius: spacing(3),
                      marginRight: spacing(1.5),
                    },
                  ]}
                >
                  <Ionicons name={recommendation.icon} size={24} color={colors.primary} />
                </View>
                <View style={styles.recommendationTitleContainer}>
                  <Text
                    style={[
                      styles.recommendationTitle,
                      {
                        color: colors.text,
                        fontSize: scaledFontSize(16),
                        marginBottom: spacing(0.25),
                      },
                    ]}
                  >
                    {recommendation.title}
                  </Text>
                  <Text
                    style={[
                      styles.recommendationSavings,
                      {
                        color: colors.success,
                        fontSize: scaledFontSize(14),
                      },
                    ]}
                  >
                    Save up to {recommendation.savings}%
                  </Text>
                </View>
              </View>
              <Text
                style={[
                  styles.recommendationDescription,
                  {
                    color: colors.text,
                    fontSize: scaledFontSize(14),
                    lineHeight: scaledFontSize(20),
                    marginBottom: spacing(1.5),
                    marginTop: spacing(1.5),
                  },
                ]}
              >
                {recommendation.description}
              </Text>

              {implementedRecommendations.includes(recommendation.id) ? (
                <View
                  style={[
                    styles.implementedButton,
                    {
                      backgroundColor: colors.success + "20",
                      paddingVertical: spacing(1),
                      paddingHorizontal: spacing(2),
                      borderRadius: spacing(1),
                      alignSelf: "flex-start",
                      flexDirection: "row",
                      alignItems: "center",
                    },
                  ]}
                >
                  <Ionicons name="checkmark-circle" size={16} color={colors.success} style={{ marginRight: 4 }} />
                  <Text
                    style={[
                      styles.implementedButtonText,
                      {
                        color: colors.success,
                        fontSize: scaledFontSize(14),
                      },
                    ]}
                  >
                    Implemented
                  </Text>
                </View>
              ) : (
                <TouchableOpacity
                  style={[
                    styles.implementButton,
                    {
                      backgroundColor: colors.primary + "20",
                      paddingVertical: spacing(1),
                      paddingHorizontal: spacing(2),
                      borderRadius: spacing(1),
                      alignSelf: "flex-start",
                    },
                  ]}
                  onPress={() => handleImplementRecommendation(recommendation.id)}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator size="small" color={colors.primary} />
                  ) : (
                    <Text
                      style={[
                        styles.implementButtonText,
                        {
                          color: colors.primary,
                          fontSize: scaledFontSize(14),
                        },
                      ]}
                    >
                      Implement
                    </Text>
                  )}
                </TouchableOpacity>
              )}
            </View>
          ))}
        </>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  tabContainer: {
    flexDirection: "row",
  },
  tab: {
    flex: 1,
    alignItems: "center",
  },
  tabText: {
    fontFamily: "Poppins-Medium",
  },
  chartContainer: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  chartTitle: {
    fontFamily: "Poppins-Medium",
    marginBottom: 8,
  },
  chart: {
    borderRadius: 16,
    marginVertical: 8,
  },
  insightCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  insightHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  insightTitle: {
    fontFamily: "Poppins-Medium",
  },
  insightText: {
    fontFamily: "Poppins-Regular",
  },
  deviceContainer: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  deviceTitle: {
    fontFamily: "Poppins-Medium",
  },
  deviceItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  deviceInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  deviceIconContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  deviceName: {
    fontFamily: "Poppins-Medium",
  },
  deviceUsage: {},
  deviceUsageText: {
    fontFamily: "Poppins-Bold",
  },
  savingsContainer: {
    alignItems: "center",
  },
  savingsTitle: {
    fontFamily: "Poppins-Medium",
  },
  savingsAmount: {
    fontFamily: "Poppins-Bold",
  },
  savingsText: {
    fontFamily: "Poppins-Regular",
  },
  recommendationCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  recommendationHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  recommendationIconContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  recommendationTitleContainer: {
    flex: 1,
  },
  recommendationTitle: {
    fontFamily: "Poppins-Medium",
  },
  recommendationSavings: {
    fontFamily: "Poppins-Medium",
  },
  recommendationDescription: {
    fontFamily: "Poppins-Regular",
  },
  implementButton: {
    alignSelf: "flex-start",
  },
  implementButtonText: {
    fontFamily: "Poppins-Medium",
  },
  implementedButton: {
    alignSelf: "flex-start",
  },
  implementedButtonText: {
    fontFamily: "Poppins-Medium",
  },
})

