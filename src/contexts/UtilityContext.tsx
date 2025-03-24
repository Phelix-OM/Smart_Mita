"use client"

import type React from "react"
import { createContext, useState, useContext, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"

type UtilityProvider = {
  id: string
  name: string
  logo: string
  country: string
  apiEndpoint?: string
  supportedFeatures: string[]
}

type EnergyData = {
  date: string
  value: number
  unit: string
  cost?: number
  currency?: string
}

type DeviceUsage = {
  id: string
  name: string
  category: string
  usage: number
  percentage: number
  unit: string
}

type NeighborhoodData = {
  averageUsage: number
  efficientHomes: number
  yourRank: number
  totalHomes: number
}

type UtilityContextType = {
  connectedUtilities: UtilityProvider[]
  availableUtilities: UtilityProvider[]
  energyData: EnergyData[]
  deviceUsage: DeviceUsage[]
  neighborhoodData: NeighborhoodData | null
  isLoading: boolean
  currency: string
  connectUtility: (utilityId: string, accountNumber: string, meterNumber: string) => Promise<boolean>
  disconnectUtility: (utilityId: string) => Promise<boolean>
  refreshEnergyData: () => Promise<void>
  getHistoricalData: (startDate: string, endDate: string) => Promise<EnergyData[]>
  fetchDeviceUsage: () => Promise<DeviceUsage[]>
  fetchNeighborhoodComparison: () => Promise<NeighborhoodData | null>
  setCurrency: (currency: string) => Promise<void>
}

const UtilityContext = createContext<UtilityContextType | undefined>(undefined)

// Enhanced mock data for available utilities
const mockAvailableUtilities: UtilityProvider[] = [
  {
    id: "1",
    name: "Kenya Power",
    logo: "/placeholder.svg",
    country: "Kenya",
    apiEndpoint: "https://api.kenyapower.com",
    supportedFeatures: ["real-time", "historical", "billing", "neighborhood-comparison"],
  },
  {
    id: "2",
    name: "TANESCO",
    logo: "/placeholder.svg",
    country: "Tanzania",
    apiEndpoint: "https://api.tanesco.co.tz",
    supportedFeatures: ["historical", "billing"],
  },
  {
    id: "3",
    name: "UMEME",
    logo: "/placeholder.svg",
    country: "Uganda",
    apiEndpoint: "https://api.umeme.co.ug",
    supportedFeatures: ["real-time", "historical", "billing", "neighborhood-comparison"],
  },
  {
    id: "4",
    name: "Rwanda Energy Group",
    logo: "/placeholder.svg",
    country: "Rwanda",
    apiEndpoint: "https://api.reg.rw",
    supportedFeatures: ["historical", "billing"],
  },
]

const generateMockEnergyData = (currency = "KES"): EnergyData[] => {
  const data: EnergyData[] = []
  const today = new Date()

  for (let i = 30; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(today.getDate() - i)

    // Generate more realistic data with daily patterns
    const baseValue = Math.floor(Math.random() * 10) + 15 // Base between 15-25
    const dayOfWeek = date.getDay()
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6

    // Weekend usage is typically higher
    const adjustedValue = isWeekend ? baseValue * 1.3 : baseValue
    // Add some randomness
    const finalValue = adjustedValue + (Math.random() * 5 - 2.5)

    // Cost calculation based on currency
    // Using KES as default with approximate conversion rates
    let cost = 0
    if (currency === "KES") {
      cost = Number.parseFloat((finalValue * 25.5).toFixed(2)) // KES 25.5 per kWh
    } else if (currency === "USD") {
      cost = Number.parseFloat((finalValue * 0.15).toFixed(2)) // $0.15 per kWh
    } else if (currency === "EUR") {
      cost = Number.parseFloat((finalValue * 0.13).toFixed(2)) // €0.13 per kWh
    }

    data.push({
      date: date.toISOString().split("T")[0],
      value: Number.parseFloat(finalValue.toFixed(1)),
      unit: "kWh",
      cost: cost,
      currency: currency,
    })
  }

  return data
}

const generateMockDeviceUsage = (): DeviceUsage[] => {
  return [
    { id: "1", name: "Air Conditioner", category: "cooling", usage: 12.1, percentage: 42, unit: "kWh" },
    { id: "2", name: "Water Heater", category: "heating", usage: 5.2, percentage: 18, unit: "kWh" },
    { id: "3", name: "Refrigerator", category: "appliance", usage: 4.3, percentage: 15, unit: "kWh" },
    { id: "4", name: "Lighting", category: "lighting", usage: 3.5, percentage: 12, unit: "kWh" },
    { id: "5", name: "Other Devices", category: "other", usage: 3.8, percentage: 13, unit: "kWh" },
  ]
}

const generateMockNeighborhoodData = (): NeighborhoodData => {
  return {
    averageUsage: 32.5,
    efficientHomes: 24.8,
    yourRank: 15,
    totalHomes: 100,
  }
}

export const UtilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [connectedUtilities, setConnectedUtilities] = useState<UtilityProvider[]>([])
  const [availableUtilities] = useState<UtilityProvider[]>(mockAvailableUtilities)
  const [energyData, setEnergyData] = useState<EnergyData[]>([])
  const [deviceUsage, setDeviceUsage] = useState<DeviceUsage[]>([])
  const [neighborhoodData, setNeighborhoodData] = useState<NeighborhoodData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currency, setCurrencyState] = useState<string>("KES") // Default to KES

  useEffect(() => {
    // Load saved connected utilities and energy data
    const loadUtilityData = async () => {
      try {
        setIsLoading(true)
        const savedUtilities = await AsyncStorage.getItem("connectedUtilities")
        const savedCurrency = await AsyncStorage.getItem("currency")

        if (savedUtilities) {
          setConnectedUtilities(JSON.parse(savedUtilities))
        }

        if (savedCurrency) {
          setCurrencyState(savedCurrency)
        }

        // In a real app, you would fetch actual energy data from your API
        // For now, we'll generate mock data
        setEnergyData(generateMockEnergyData(savedCurrency || "KES"))
        setDeviceUsage(generateMockDeviceUsage())
        setNeighborhoodData(generateMockNeighborhoodData())
        setIsLoading(false)
      } catch (error) {
        console.error("Failed to load utility data:", error)
        setIsLoading(false)
      }
    }

    loadUtilityData()
  }, [])

  const setCurrency = async (newCurrency: string) => {
    try {
      await AsyncStorage.setItem("currency", newCurrency)
      setCurrencyState(newCurrency)

      // Refresh energy data with new currency
      setEnergyData(generateMockEnergyData(newCurrency))
    } catch (error) {
      console.error("Failed to set currency:", error)
    }
  }

  const connectUtility = async (utilityId: string, accountNumber: string, meterNumber: string) => {
    try {
      setIsLoading(true)

      // In a real app, you would make an API call to verify the account and meter numbers
      // and establish a connection with the utility provider

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const utilityToConnect = availableUtilities.find((u) => u.id === utilityId)

      if (!utilityToConnect) {
        setIsLoading(false)
        return false
      }

      const updatedUtilities = [...connectedUtilities, utilityToConnect]
      await AsyncStorage.setItem("connectedUtilities", JSON.stringify(updatedUtilities))
      setConnectedUtilities(updatedUtilities)

      // Refresh energy data after connecting a new utility
      await refreshEnergyData()

      setIsLoading(false)
      return true
    } catch (error) {
      console.error("Failed to connect utility:", error)
      setIsLoading(false)
      return false
    }
  }

  const disconnectUtility = async (utilityId: string) => {
    try {
      setIsLoading(true)

      // In a real app, you would make an API call to disconnect from the utility provider

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const updatedUtilities = connectedUtilities.filter((u) => u.id !== utilityId)
      await AsyncStorage.setItem("connectedUtilities", JSON.stringify(updatedUtilities))
      setConnectedUtilities(updatedUtilities)

      // Refresh energy data after disconnecting a utility
      await refreshEnergyData()

      setIsLoading(false)
      return true
    } catch (error) {
      console.error("Failed to disconnect utility:", error)
      setIsLoading(false)
      return false
    }
  }

  const refreshEnergyData = async () => {
    try {
      setIsLoading(true)

      // In a real app, you would fetch actual energy data from your API
      // For now, we'll generate new mock data
      setEnergyData(generateMockEnergyData(currency))
      setDeviceUsage(generateMockDeviceUsage())
      setNeighborhoodData(generateMockNeighborhoodData())

      setIsLoading(false)
    } catch (error) {
      console.error("Failed to refresh energy data:", error)
      setIsLoading(false)
    }
  }

  const getHistoricalData = async (startDate: string, endDate: string): Promise<EnergyData[]> => {
    try {
      // In a real app, you would fetch historical data from your API
      // For now, we'll filter the mock data based on the date range

      return energyData.filter((data) => {
        const date = data.date
        return date >= startDate && date <= endDate
      })
    } catch (error) {
      console.error("Failed to get historical data:", error)
      return []
    }
  }

  const fetchDeviceUsage = async (): Promise<DeviceUsage[]> => {
    try {
      // In a real app, you would fetch device usage data from your API
      // For now, we'll return the mock data

      return deviceUsage
    } catch (error) {
      console.error("Failed to fetch device usage:", error)
      return []
    }
  }

  const fetchNeighborhoodComparison = async (): Promise<NeighborhoodData | null> => {
    try {
      // In a real app, you would fetch neighborhood comparison data from your API
      // For now, we'll return the mock data

      return neighborhoodData
    } catch (error) {
      console.error("Failed to fetch neighborhood comparison:", error)
      return null
    }
  }

  return (
    <UtilityContext.Provider
      value={{
        connectedUtilities,
        availableUtilities,
        energyData,
        deviceUsage,
        neighborhoodData,
        isLoading,
        currency,
        connectUtility,
        disconnectUtility,
        refreshEnergyData,
        getHistoricalData,
        fetchDeviceUsage,
        fetchNeighborhoodComparison,
        setCurrency,
      }}
    >
      {children}
    </UtilityContext.Provider>
  )
}

export const useUtility = () => {
  const context = useContext(UtilityContext)
  if (context === undefined) {
    throw new Error("useUtility must be used within a UtilityProvider")
  }
  return context
}

