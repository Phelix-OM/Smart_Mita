"use client"

import { useState, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"

// Define the keys for storing settings in AsyncStorage
const SIMULATION_ENABLED_KEY = "simulation:enabled"
const SIMULATION_INTERVAL_KEY = "simulation:interval"
const SIMULATION_FLUCTUATION_KEY = "simulation:fluctuation"

// Default values
const DEFAULT_UPDATE_INTERVAL = 3000 // 3 seconds
const DEFAULT_FLUCTUATION_RANGE = 5 // 5%

export const useLiveDataSettings = () => {
  const [isSimulationEnabled, setIsSimulationEnabled] = useState<boolean>(true)
  const [updateInterval, setUpdateInterval] = useState<number>(DEFAULT_UPDATE_INTERVAL)
  const [fluctuationRange, setFluctuationRange] = useState<number>(DEFAULT_FLUCTUATION_RANGE)
  const [isLoaded, setIsLoaded] = useState<boolean>(false)

  // Load settings from AsyncStorage on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        // Load simulation enabled state
        const enabledValue = await AsyncStorage.getItem(SIMULATION_ENABLED_KEY)
        if (enabledValue !== null) {
          setIsSimulationEnabled(enabledValue === "true")
        }

        // Load update interval
        const intervalValue = await AsyncStorage.getItem(SIMULATION_INTERVAL_KEY)
        if (intervalValue !== null) {
          setUpdateInterval(Number(intervalValue))
        }

        // Load fluctuation range
        const fluctuationValue = await AsyncStorage.getItem(SIMULATION_FLUCTUATION_KEY)
        if (fluctuationValue !== null) {
          setFluctuationRange(Number(fluctuationValue))
        }

        setIsLoaded(true)
      } catch (error) {
        console.error("Failed to load simulation settings:", error)
        setIsLoaded(true)
      }
    }

    loadSettings()
  }, [])

  // Save settings to AsyncStorage whenever they change
  useEffect(() => {
    if (!isLoaded) return

    const saveSettings = async () => {
      try {
        await AsyncStorage.setItem(SIMULATION_ENABLED_KEY, String(isSimulationEnabled))
        await AsyncStorage.setItem(SIMULATION_INTERVAL_KEY, String(updateInterval))
        await AsyncStorage.setItem(SIMULATION_FLUCTUATION_KEY, String(fluctuationRange))
      } catch (error) {
        console.error("Failed to save simulation settings:", error)
      }
    }

    saveSettings()
  }, [isSimulationEnabled, updateInterval, fluctuationRange, isLoaded])

  // Toggle simulation enabled state
  const toggleSimulation = () => {
    setIsSimulationEnabled((prev) => !prev)
  }

  // Set update interval with validation
  const setValidatedUpdateInterval = (value: number) => {
    // Ensure value is between 1000ms and 10000ms
    const validValue = Math.max(1000, Math.min(10000, value))
    setUpdateInterval(validValue)
  }

  // Set fluctuation range with validation
  const setValidatedFluctuationRange = (value: number) => {
    // Ensure value is between 1% and 20%
    const validValue = Math.max(1, Math.min(20, value))
    setFluctuationRange(validValue)
  }

  return {
    isSimulationEnabled,
    updateInterval,
    fluctuationRange,
    toggleSimulation,
    setUpdateInterval: setValidatedUpdateInterval,
    setFluctuationRange: setValidatedFluctuationRange,
  }
}

