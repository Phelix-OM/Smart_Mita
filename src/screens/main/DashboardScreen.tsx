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
import { DeviceUsageCard } from "../../components/ui/DeviceUsageCard"
import { RecommendationCard } from "../../components/ui/RecommendationCard"
import { HouseholdComparisonChart } from "../../components/ui/HouseholdComparisonChart"
import { Sidebar } from "../../components/layout/Sidebar"
import { useResponsive } from "../../hooks/useResponsive"
import { useNavigation } from "@react-navigation/native"
import { useLiveEnergyData } from "../../hooks/UseLiveEnergyData"
import UtilityConnectionScreen from "@/src/screens/auth/UtilityConnectionScreen"
type TimeRange = "day" | "week" | "month" | "year"
type TabType = "consumption" | "compare" | "recommendations"

export default function DashboardScreen() {
  const { t } = useTranslation()
  const { colors } = useTheme()
  const {
    refreshEnergyData: refreshUtilityData,
    isLoading,
    connectedUtilities,
    deviceUsage,
    neighborhoodData,
    currency,
  } = useUtility()
  const { user } = useAuth()
  const { isSmallScreen, isMediumScreen, isLandscape, dimensions, spacing, scaledFontSize } = useResponsive()
  const navigation = useNavigation()

  // Use our live energy data hook
  const { energyData, isSimulating, toggleSimulation, updateEnergyData } = useLiveEnergyData(3000) // Update every 3 seconds

  const [refreshing, setRefreshing] = useState(false)
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>("week")
  const [activeTab, setActiveTab] = useState<TabType>("consumption")
  const [sidebarVisible, setSidebarVisible] = useState(!isSmallScreen)

  useEffect(() => {
    setSidebarVisible(!isSmallScreen && isLandscape)
  }, [isSmallScreen, isLandscape])

  const onRefresh = async () => {
    setRefreshing(true)
    // Force an immediate update of our simulated data
    updateEnergyData()
    await refreshUtilityData()
    setRefreshing(false)
  }

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible)
  }

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

  // Get chart data based on selected time range
  const getChartData = () => {
    switch (selectedTimeRange) {
      case "day":
        return energyData.chartData.day
      case "week":
        return energyData.chartData.week
      case "month":
        return energyData.chartData.month
      case "year":
        return energyData.chartData.year
      default:
        return energyData.chartData.week
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

            {/* Add a toggle button for simulation */}
            <TouchableOpacity
              style={[
                styles.simulationToggle,
                { backgroundColor: isSimulating ? `${colors.success}15` : `${colors.error}15` },
              ]}
              onPress={toggleSimulation}
            >
              <Ionicons
                name={isSimulating ? "pulse" : "pause"}
                size={16}
                color={isSimulating ? colors.success : colors.error}
              />
              <Text style={[styles.simulationToggleText, { color: isSimulating ? colors.success : colors.error }]}>
                {isSimulating ? "Live" : "Paused"}
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            style={[styles.container, { paddingHorizontal: contentPadding }]}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />}
          >
            {/* Metrics Cards - Responsive Grid */}
            <View style={[styles.metricsContainer, isCompactLayout && styles.metricsContainerCompact]}>
              <MetricCard
                title="Current Usage"
                value={energyData.currentUsage.toString()}
                unit="kW"
                subtitle="Currently active power"
                icon={<Ionicons name="flash-outline" size={24} color={colors.primary} />}
                changePercentage={energyData.currentUsageChange}
              />

              <MetricCard
                title="Daily Consumption"
                value={energyData.dailyUsage.toString()}
                unit="kWh"
                subtitle="Compared to yesterday"
                icon={<Ionicons name="sunny-outline" size={24} color={colors.warning} />}
                changePercentage={energyData.dailyUsageChange}
              />

              <MetricCard
                title="Potential Savings"
                value={energyData.potentialSavingsAmount.toString()}
                unit=""
                subtitle={`Possible monthly savings ≈ ${energyData.potentialSavings} kWh`}
                icon={<Ionicons name="trending-down-outline" size={24} color={colors.tertiary} />}
                isCurrency={true}
              />
            </View>

            {connectedUtilities.length === 0 && (
              <TouchableOpacity
                style={[
                  {
                    backgroundColor: `${colors.primary}15`,
                    borderRadius: 16,
                    padding: 20,
                    marginBottom: 24,
                    flexDirection: "row",
                    alignItems: "center",
                    borderWidth: 1,
                    borderColor: `${colors.primary}30`,
                    shadowColor: colors.primary,
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 2,
                  },
                ]}
                onPress={() => navigation.navigate("UtilityConnection" as never)}
              >
                <View
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    backgroundColor: colors.primary,
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: 16,
                  }}
                >
                  <Ionicons name="flash" size={24} color={colors.white} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontFamily: "Poppins-Bold",
                      fontSize: scaledFontSize(16),
                      color: colors.text,
                      marginBottom: 4,
                    }}
                  >
                    Connect Your Utility Provider
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Poppins-Regular",
                      fontSize: scaledFontSize(14),
                      color: colors.textSecondary,
                    }}
                  >
                    Link your account to get real-time energy data and personalized insights
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color={colors.primary} />
              </TouchableOpacity>
            )}

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

                  {energyData.deviceUsage.map((device) => (
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
                {/* Household Comparison Chart */}
                <HouseholdComparisonChart
                  householdValue={energyData.householdValue}
                  neighborhoodValue={energyData.neighborhoodValue}
                  efficientValue={energyData.efficientValue}
                  unit="kWh"
                  title="Household Comparison"
                  subtitle="Your energy usage compared to others"
                />

                <View style={[styles.comparisonCard, { backgroundColor: colors.card, marginTop: 24 }]}>
                  <Text
                    style={[
                      styles.comparisonTitle,
                      {
                        color: colors.text,
                        fontSize: scaledFontSize(16),
                      },
                    ]}
                  >
                    Your Energy Efficiency Ranking
                  </Text>

                  <View style={styles.rankingContainer}>
                    <View style={[styles.rankingCircle, { borderColor: colors.primary }]}>
                      <Text style={[styles.rankingNumber, { color: colors.primary }]}>
                        {neighborhoodData?.yourRank || 15}
                      </Text>
                      <Text style={[styles.rankingLabel, { color: colors.textSecondary }]}>
                        of {neighborhoodData?.totalHomes || 100}
                      </Text>
                    </View>

                    <View style={styles.rankingDetails}>
                      <View style={styles.rankingItem}>
                        <Ionicons name="checkmark-circle" size={20} color={colors.success} />
                        <Text style={[styles.rankingText, { color: colors.text }]}>
                          You're in the top 15% of energy-efficient homes
                        </Text>
                      </View>

                      <View style={styles.rankingItem}>
                        <Ionicons name="trending-down" size={20} color={colors.success} />
                        <Text style={[styles.rankingText, { color: colors.text }]}>
                          Your consumption is{" "}
                          {Math.round(
                            ((energyData.neighborhoodValue - energyData.householdValue) /
                              energyData.neighborhoodValue) *
                              100,
                          )}
                          % below neighborhood average
                        </Text>
                      </View>

                      <View style={styles.rankingItem}>
                        <Ionicons name="flash" size={20} color={colors.warning} />
                        <Text style={[styles.rankingText, { color: colors.text }]}>
                          You could save{" "}
                          {Math.round(
                            ((energyData.householdValue - energyData.efficientValue) / energyData.householdValue) * 100,
                          )}
                          % more by reaching efficient home levels
                        </Text>
                      </View>
                    </View>
                  </View>
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
                    iconName={recommendation.icon}
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
  simulationToggle: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    marginLeft: "auto",
  },
  simulationToggleText: {
    fontFamily: "Poppins-Medium",
    fontSize: 12,
    marginLeft: 4,
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
  },
  comparisonTitle: {
    fontFamily: "Poppins-Medium",
    textAlign: "center",
    marginBottom: 16,
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
    fontSize: 24,
    fontFamily: "Poppins-Bold",
  },
  rankingLabel: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
  },
  rankingDetails: {
    flex: 1,
  },
  rankingItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  rankingText: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    marginLeft: 8,
    flex: 1,
  },
  recommendationsSection: {
    marginBottom: 24,
  },
})

