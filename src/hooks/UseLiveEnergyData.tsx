"use client"

import { useState, useEffect, useRef } from "react"

// Types for our energy data
export interface LiveEnergyData {
  currentUsage: number
  currentUsageChange: number
  dailyUsage: number
  dailyUsageChange: number
  potentialSavings: number
  potentialSavingsAmount: number
  householdValue: number
  neighborhoodValue: number
  efficientValue: number
  chartData: {
    day: { data: number[]; labels: string[] }
    week: { data: number[]; labels: string[] }
    month: { data: number[]; labels: string[] }
    year: { data: number[]; labels: string[] }
  }
  deviceUsage: Array<{
    id: string
    name: string
    usage: number
    percentage: number
    unit: string
    category: string
  }>
}

// Function to generate random fluctuation within a range
const randomFluctuation = (value: number, percentage = 5): number => {
  const fluctuation = (Math.random() * 2 - 1) * ((value * percentage) / 100)
  return Number((value + fluctuation).toFixed(2))
}

// Initial data setup
const initialEnergyData: LiveEnergyData = {
  currentUsage: 3.2,
  currentUsageChange: -5,
  dailyUsage: 28.5,
  dailyUsageChange: 2,
  potentialSavings: 83,
  potentialSavingsAmount: 12.45,
  householdValue: 28.5,
  neighborhoodValue: 32.1,
  efficientValue: 22.3,
  chartData: {
    day: {
      data: [10, 8, 12, 14, 9, 11, 15, 18, 22, 19, 16, 14],
      labels: ["6am", "8am", "10am", "12pm", "2pm", "4pm", "6pm", "8pm", "10pm", "12am", "2am", "4am"],
    },
    week: {
      data: [25, 22, 24, 21, 26, 28, 27],
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    },
    month: {
      data: [120, 135, 140, 130, 145, 150, 155, 140, 130, 145, 160, 150, 140, 155, 165],
      labels: ["1", "5", "10", "15", "20", "25", "30"],
    },
    year: {
      data: [450, 420, 480, 520, 540, 580, 620, 650, 600, 580, 520, 490],
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    },
  },
  deviceUsage: [
    {
      id: "1",
      name: "Air Conditioner",
      usage: 12.5,
      percentage: 45,
      unit: "kWh",
      category: "cooling",
    },
    {
      id: "2",
      name: "Water Heater",
      usage: 8.2,
      percentage: 28,
      unit: "kWh",
      category: "heating",
    },
    {
      id: "3",
      name: "Refrigerator",
      usage: 4.3,
      percentage: 15,
      unit: "kWh",
      category: "appliance",
    },
    {
      id: "4",
      name: "Lighting",
      usage: 2.1,
      percentage: 7,
      unit: "kWh",
      category: "lighting",
    },
    {
      id: "5",
      name: "Other Devices",
      usage: 1.4,
      percentage: 5,
      unit: "kWh",
      category: "other",
    },
  ],
}

// Custom hook for live energy data simulation
export const useLiveEnergyData = (updateInterval = 5000) => {
  const [energyData, setEnergyData] = useState<LiveEnergyData>(initialEnergyData)
  const [isSimulating, setIsSimulating] = useState<boolean>(true)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Function to update data with random fluctuations
  const updateEnergyData = () => {
    setEnergyData((prevData) => {
      // Update current usage with more frequent changes (real-time power)
      const newCurrentUsage = randomFluctuation(prevData.currentUsage, 10)

      // Calculate change percentage compared to previous value
      const currentUsageChange = Number(
        (((newCurrentUsage - prevData.currentUsage) / prevData.currentUsage) * 100).toFixed(1),
      )

      // Update daily usage (more stable)
      const newDailyUsage = randomFluctuation(prevData.dailyUsage, 2)
      const dailyUsageChange = Number((((newDailyUsage - prevData.dailyUsage) / prevData.dailyUsage) * 100).toFixed(1))

      // Update potential savings
      const newPotentialSavings = randomFluctuation(prevData.potentialSavings, 3)
      const newPotentialSavingsAmount = Number((newPotentialSavings * 0.15).toFixed(2))

      // Update household comparison values
      const newHouseholdValue = newDailyUsage
      const newNeighborhoodValue = randomFluctuation(prevData.neighborhoodValue, 1)
      const newEfficientValue = randomFluctuation(prevData.efficientValue, 1)

      // Update chart data - we'll just update the most recent data point for each time range
      const newChartData = {
        day: {
          ...prevData.chartData.day,
          data: [
            ...prevData.chartData.day.data.slice(0, -1),
            randomFluctuation(prevData.chartData.day.data[prevData.chartData.day.data.length - 1], 8),
          ],
        },
        week: {
          ...prevData.chartData.week,
          data: [
            ...prevData.chartData.week.data.slice(0, -1),
            randomFluctuation(prevData.chartData.week.data[prevData.chartData.week.data.length - 1], 5),
          ],
        },
        month: {
          ...prevData.chartData.month,
          data: [
            ...prevData.chartData.month.data.slice(0, -1),
            randomFluctuation(prevData.chartData.month.data[prevData.chartData.month.data.length - 1], 3),
          ],
        },
        year: {
          ...prevData.chartData.year,
          data: [
            ...prevData.chartData.year.data.slice(0, -1),
            randomFluctuation(prevData.chartData.year.data[prevData.chartData.year.data.length - 1], 2),
          ],
        },
      }

      // Update device usage
      const newDeviceUsage = prevData.deviceUsage.map((device) => {
        const newUsage = randomFluctuation(device.usage, 5)
        return {
          ...device,
          usage: newUsage,
          // We'll recalculate percentages to ensure they sum to 100%
          percentage: Math.round((newUsage * 100) / (newDailyUsage || 1)),
        }
      })

      // Normalize percentages to ensure they sum to 100%
      const totalPercentage = newDeviceUsage.reduce((sum, device) => sum + device.percentage, 0)
      if (totalPercentage !== 100) {
        const adjustmentFactor = 100 / totalPercentage
        newDeviceUsage.forEach((device) => {
          device.percentage = Math.round(device.percentage * adjustmentFactor)
        })

        // Ensure we get exactly 100% by adjusting the largest category
        const remainingPercentage = 100 - newDeviceUsage.reduce((sum, device) => sum + device.percentage, 0)
        if (remainingPercentage !== 0) {
          const largestDevice = [...newDeviceUsage].sort((a, b) => b.percentage - a.percentage)[0]
          const index = newDeviceUsage.findIndex((d) => d.id === largestDevice.id)
          newDeviceUsage[index].percentage += remainingPercentage
        }
      }

      return {
        currentUsage: newCurrentUsage,
        currentUsageChange,
        dailyUsage: newDailyUsage,
        dailyUsageChange,
        potentialSavings: newPotentialSavings,
        potentialSavingsAmount: newPotentialSavingsAmount,
        householdValue: newHouseholdValue,
        neighborhoodValue: newNeighborhoodValue,
        efficientValue: newEfficientValue,
        chartData: newChartData,
        deviceUsage: newDeviceUsage,
      }
    })
  }

  // Start/stop simulation
  const toggleSimulation = () => {
    setIsSimulating((prev) => !prev)
  }

  // Set up interval for data updates
  useEffect(() => {
    if (isSimulating) {
      intervalRef.current = setInterval(updateEnergyData, updateInterval)
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isSimulating, updateInterval])

  return {
    energyData,
    isSimulating,
    toggleSimulation,
    updateEnergyData, // Expose this to allow manual updates
  }
}

