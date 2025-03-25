"use client"

import { useState, useEffect } from "react"
import { Dimensions } from "react-native"

type Orientation = "portrait" | "landscape"
type ScreenSize = "small" | "medium" | "large" | "xlarge"

export function useResponsive() {
  const [dimensions, setDimensions] = useState(Dimensions.get("window"))
  const [orientation, setOrientation] = useState<Orientation>(
    dimensions.width < dimensions.height ? "portrait" : "landscape",
  )
  const [screenSize, setScreenSize] = useState<ScreenSize>(getScreenSize(dimensions.width))

  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setDimensions(window)
      setOrientation(window.width < window.height ? "portrait" : "landscape")
      setScreenSize(getScreenSize(window.width))
    })

    return () => subscription.remove()
  }, [])

  function getScreenSize(width: number): ScreenSize {
    if (width < 375) return "small"
    if (width < 768) return "medium"
    if (width < 1024) return "large"
    return "xlarge"
  }

  const isSmallScreen = screenSize === "small"
  const isMediumScreen = screenSize === "medium"
  const isLargeScreen = screenSize === "large"
  const isXLargeScreen = screenSize === "xlarge"
  const isPortrait = orientation === "portrait"
  const isLandscape = orientation === "landscape"

  // Calculate responsive font sizes
  const fontScale = dimensions.width / 375 // Base on iPhone 8 width
  const scaledFontSize = (size: number) => Math.round(size * Math.min(fontScale, 1.3))

  // Calculate responsive spacing
  const spacing = (multiplier = 1) => Math.round(8 * multiplier * Math.min(fontScale, 1.5))

  // Calculate responsive dimensions
  const wp = (percentage: number) => {
    return Math.round((percentage * dimensions.width) / 100)
  }

  const hp = (percentage: number) => {
    return Math.round((percentage * dimensions.height) / 100)
  }

  return {
    dimensions,
    orientation,
    screenSize,
    isSmallScreen,
    isMediumScreen,
    isLargeScreen,
    isXLargeScreen,
    isPortrait,
    isLandscape,
    scaledFontSize,
    spacing,
    wp,
    hp,
  }
}

