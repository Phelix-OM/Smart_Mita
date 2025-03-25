import { View, Text, StyleSheet, SafeAreaView, StatusBar } from "react-native"

export default function TestScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      <View style={styles.content}>
        <Text style={styles.title}>SmartMita App</Text>
        <Text style={styles.subtitle}>Test Screen is Working!</Text>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontFamily: "Poppins-Bold",
    fontSize: 24,
    marginBottom: 16,
    color: "#1E88E5",
  },
  subtitle: {
    fontFamily: "Poppins-Regular",
    fontSize: 16,
    textAlign: "center",
    color: "#1E293B",
  },
})

