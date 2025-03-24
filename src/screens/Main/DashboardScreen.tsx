"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native"
import { useTranslation } from "../../hooks/useTranslation"
import { useTheme } from "../../contexts/ThemeContext"
import { useUtility } from "../../contexts/UtilityContext"
import { useAuth } from "../../contexts/AuthContext"
import { Ionicons } from "@expo/vector-icons"
import { MetricCard } from "../../components/ui/MetricCard"
import { TabBar } from "../../components/ui/TabBar"
import { AreaChart } from "../../components/ui/AreaChart"
import { TimeRangeSelector } from "../../components/ui/TimeRangeSelector"
import { DeviceUsageCard } from "@/src/components/ui/DeviceUsageCard"
import { RecommendationCard } from "../../components/ui/RecommendationsCard"
import { Sidebar } from "../../components/layout/Sidebar"
import { useResponsive } from "../../hooks/useResponsive"

type TimeRange = "day" | "week" | "month" | "year"
type TabType = "consumption" | "compare" | "recommendations"

export default function DashboardScreen() {
  const { t } = useTranslation()
  const { colors } = useTheme()
  const { energyData, refreshEnergyData, isLoading, connectedUtilities, deviceUsage } = useUtility()
  const { user } = useAuth()
  const { isSmallScreen, isMediumScreen, isLandscape, dimensions, spacing, scaledFontSize } = useResponsive()

  const [refreshing, setRefreshing] = useState(false)
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>("week")
  const [activeTab, setActiveTab] = useState<TabType>("consumption")
  const [sidebarVisible, setSidebarVisible] = useState(!isSmallScreen)

  useEffect(() => {
    setSidebarVisible(!isSmallScreen && isLandscape)
  }, [isSmallScreen, isLandscape])

  const onRefresh = async () => {
    setRefreshing(true)
    await refreshEnergyData()
    setRefreshing(false)
  }

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible)
  }

  // Mock data for current usage
  const currentUsage = 3.2
  const currentUsageChange = -5

  // Calculate daily usage
  const dailyUsage = 28.5
  const dailyUsageChange = 2

  // Calculate potential savings
  const potentialSavings = 83
  const potentialSavingsAmount = 12.45

  // Mock data for recommendations
  const recommendations = [
    {
      id: "1",
      title: "Optimize AC Temperature",
      description: "Set your AC to 24°C instead of 20°C to save up to 20% on cooling costs.",
      savings: 15,
      unit: "kWh",
      icon: "snow-outline",
    },
    {
      id: "2",
      title: "Switch to LED Lighting",
      description: "Replace traditional bulbs with LED lights to save up to 80% on lighting costs.",
      savings: 10,
      unit: "kWh",
      icon: "bulb-outline",
    },
    {
      id: "3",
      title: "Unplug Standby Devices",
      description: "Unplug devices when not in use to eliminate standby power consumption.",
      savings: 8,
      unit: "kWh",
      icon: "power-outline",
    },
  ]

  // Prepare data for the chart based on selected time range
  const getChartData = () => {
    switch (selectedTimeRange) {
      case "day":
        return {
          data: [10, 8, 12, 14, 9, 11, 15, 18, 22, 19, 16, 14],
          labels: ["6am", "8am", "10am", "12pm", "2pm", "4pm", "6pm", "8pm", "10pm", "12am", "2am", "4am"],
        }
      case "week":
        return {
          data: [25, 22, 24, 21, 26, 28, 27],
          labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        }
      case "month":
        return {
          data: [120, 135, 140, 130, 145, 150, 155, 140, 130, 145, 160, 150, 140, 155, 165],
          labels: ["1", "5", "10", "15", "20", "25", "30"],
        }
      case "year":
        return {
          data: [450, 420, 480, 520, 540, 580, 620, 650, 600, 580, 520, 490],
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        }
      default:
        return {
          data: [25, 22, 24, 21, 26, 28, 27],
          labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        }
    }
  }

  const chartData = getChartData()

  // Tabs configuration
  const tabs = [
    { key: "consumption", title: "Energy Consumption" },
    { key: "compare", title: "Compare" },
    { key: "recommendations", title: "Recommendations" },
  ]

  const handleImplementRecommendation = (id: string) => {
    // In a real app, this would implement the recommendation
    console.log(`Implementing recommendation ${id}`)
  }

  // Responsive layout adjustments
  const isCompactLayout = isSmallScreen || (isMediumScreen && !isLandscape)
  const contentPadding = isCompactLayout ? spacing(2) : spacing(3)
  const chartHeight = isCompactLayout ? 180 : 220

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <View style={styles.pageContainer}>
        {sidebarVisible && <Sidebar isVisible={sidebarVisible} onToggle={toggleSidebar} />}

        <View style={styles.mainContent}>
          {/* Header with menu button for small screens */}
          <View style={[styles.header, { paddingHorizontal: contentPadding }]}>
            {isCompactLayout && (
              <TouchableOpacity
                style={[styles.menuButton, { backgroundColor: `${colors.primary}15` }]}
                onPress={toggleSidebar}
              >
                <Ionicons name="menu" size={24} color={colors.primary} />
              </TouchableOpacity>
            )}

            <View style={isCompactLayout ? { marginLeft: spacing(1) } : {}}>
              <Text
                style={[
                  styles.greeting,
                  {
                    color: colors.text,
                    fontSize: scaledFontSize(28),
                  },
                ]}
              >
                Hello, {user?.name || "User"}! 👋
              </Text>
              <Text
                style={[
                  styles.subGreeting,
                  {
                    color: colors.textSecondary,
                    fontSize: scaledFontSize(16),
                  },
                ]}
              >
                Here's an overview of your energy consumption
              </Text>
            </View>
          </View>

          <ScrollView
            style={[styles.container, { paddingHorizontal: contentPadding }]}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />}
          >
            {/* Metrics Cards - Responsive Grid */}
            <View style={[styles.metricsContainer, isCompactLayout && styles.metricsContainerCompact]}>
              <MetricCard
                title="Current Usage"
                value={currentUsage.toString()}
                unit="kW"
                subtitle="Currently active power"
                icon={<Ionicons name="flash-outline" size={24} color={colors.primary} />}
                changePercentage={currentUsageChange}
              />

              <MetricCard
                title="Daily Consumption"
                value={dailyUsage.toString()}
                unit="kWh"
                subtitle="Compared to yesterday"
                icon={<Ionicons name="sunny-outline" size={24} color={colors.warning} />}
                changePercentage={dailyUsageChange}
              />

              <MetricCard
                title="Potential Savings"
                value={potentialSavings.toString()}
                unit="kWh"
                subtitle={`Possible monthly savings ≈ $${potentialSavingsAmount.toFixed(2)}`}
                icon={<Ionicons name="trending-down-outline" size={24} color={colors.tertiary} />}
              />
            </View>

            <TabBar tabs={tabs} activeTab={activeTab} onTabChange={(tab) => setActiveTab(tab as TabType)} />

            {activeTab === "consumption" && (
              <>
                <View style={styles.chartSection}>
                  <View style={styles.chartHeader}>
                    <Text
                      style={[
                        styles.chartTitle,
                        {
                          color: colors.text,
                          fontSize: scaledFontSize(20),
                        },
                      ]}
                    >
                      Energy Usage
                    </Text>
                    <Text
                      style={[
                        styles.chartSubtitle,
                        {
                          color: colors.textSecondary,
                          fontSize: scaledFontSize(14),
                        },
                      ]}
                    >
                      Your energy consumption over time
                    </Text>
                  </View>

                  <TimeRangeSelector selectedRange={selectedTimeRange} onRangeChange={setSelectedTimeRange} />

                  <AreaChart data={chartData.data} labels={chartData.labels} yAxisSuffix=" kWh" height={chartHeight} />
                </View>

                <View style={styles.deviceSection}>
                  <Text
                    style={[
                      styles.sectionTitle,
                      {
                        color: colors.text,
                        fontSize: scaledFontSize(20),
                      },
                    ]}
                  >
                    Device Usage
                  </Text>
                  <Text
                    style={[
                      styles.sectionSubtitle,
                      {
                        color: colors.textSecondary,
                        fontSize: scaledFontSize(14),
                      },
                    ]}
                  >
                    See which devices consume the most energy
                  </Text>

                  {deviceUsage.map((device) => (
                    <DeviceUsageCard
                      key={device.id}
                      deviceName={device.name}
                      usagePercentage={device.percentage}
                      usageValue={device.usage}
                      usageUnit={device.unit}
                      iconName={
                        device.category === "cooling"
                          ? "snow-outline"
                          : device.category === "heating"
                            ? "water-outline"
                            : device.category === "appliance"
                              ? "thermometer-outline"
                              : device.category === "lighting"
                                ? "bulb-outline"
                                : "apps-outline"
                      }
                    />
                  ))}
                </View>
              </>
            )}

            {activeTab === "compare" && (
              <View style={styles.compareSection}>
                <Text
                  style={[
                    styles.sectionTitle,
                    {
                      color: colors.text,
                      fontSize: scaledFontSize(20),
                    },
                  ]}
                >
                  Neighborhood Comparison
                </Text>
                <Text
                  style={[
                    styles.sectionSubtitle,
                    {
                      color: colors.textSecondary,
                      fontSize: scaledFontSize(14),
                    },
                  ]}
                >
                  See how your usage compares to similar households
                </Text>

                {/* Comparison chart would go here */}
                <View
                  style={[
                    styles.comparisonCard,
                    {
                      backgroundColor: colors.card,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.comparisonTitle,
                      {
                        color: colors.text,
                        fontSize: scaledFontSize(16),
                      },
                    ]}
                  >
                    Your home is 15% more efficient than similar homes
                  </Text>

                  <View style={styles.ratingContainer}>
                    <Ionicons name="star" size={24} color={colors.warning} />
                    <Ionicons name="star" size={24} color={colors.warning} />
                    <Ionicons name="star" size={24} color={colors.warning} />
                    <Ionicons name="star" size={24} color={colors.warning} />
                    <Ionicons name="star-half" size={24} color={colors.warning} />
                  </View>

                  <Text
                    style={[
                      styles.comparisonText,
                      {
                        color: colors.textSecondary,
                        fontSize: scaledFontSize(14),
                      },
                    ]}
                  >
                    Great job! You're among the most energy-efficient homes in your area.
                  </Text>
                </View>
              </View>
            )}

            {activeTab === "recommendations" && (
              <View style={styles.recommendationsSection}>
                <Text
                  style={[
                    styles.sectionTitle,
                    {
                      color: colors.text,
                      fontSize: scaledFontSize(20),
                    },
                  ]}
                >
                  Personalized Recommendations
                </Text>
                <Text
                  style={[
                    styles.sectionSubtitle,
                    {
                      color: colors.textSecondary,
                      fontSize: scaledFontSize(14),
                    },
                  ]}
                >
                  Follow these tips to reduce your energy consumption
                </Text>

                {recommendations.map((recommendation) => (
                  <RecommendationCard
                    key={recommendation.id}
                    title={recommendation.title}
                    description={recommendation.description}
                    savingsAmount={recommendation.savings}
                    savingsUnit={recommendation.unit}
                    iconName={recommendation.icon as keyof typeof Ionicons.glyphMap}
                    onImplement={() => handleImplementRecommendation(recommendation.id)}
                  />
                ))}
              </View>
            )}

            {/* Add some bottom padding for scrolling */}
            <View style={{ height: spacing(4) }} />
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  pageContainer: {
    flex: 1,
    flexDirection: "row",
  },
  mainContent: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  greeting: {
    fontFamily: "Poppins-Bold",
  },
  subGreeting: {
    fontFamily: "Poppins-Regular",
    marginTop: 4,
  },
  metricsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
    gap: 16,
  },
  metricsContainerCompact: {
    flexDirection: "column",
    gap: 12,
  },
  chartSection: {
    marginBottom: 24,
  },
  chartHeader: {
    marginBottom: 8,
  },
  chartTitle: {
    fontFamily: "Poppins-Bold",
  },
  chartSubtitle: {
    fontFamily: "Poppins-Regular",
  },
  deviceSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: "Poppins-Bold",
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontFamily: "Poppins-Regular",
    marginBottom: 16,
  },
  compareSection: {
    marginBottom: 24,
  },
  comparisonCard: {
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
    borderWidth: 1,
    alignItems: "center",
  },
  comparisonTitle: {
    fontFamily: "Poppins-Medium",
    textAlign: "center",
    marginBottom: 16,
  },
  ratingContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  comparisonText: {
    fontFamily: "Poppins-Regular",
    textAlign: "center",
  },
  recommendationsSection: {
    marginBottom: 24,
  },
})

