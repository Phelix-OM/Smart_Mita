import { createNativeStackNavigator } from "@react-navigation/native-stack"
import LoginScreen from "@/src/screens/Auth/LoginScreen"
import RegisterScreen from "@/src/screens/Auth/RegisterScreen"
import ForgotPasswordScreen from "@/src/screens/Auth/ForgotPasswordsScreen"
import UtilityConnectionScreen from "@/src/screens/Auth/UtilityConnectionScreen"
import { useTranslation } from "@/src/hooks/useTranslation"

const Stack = createNativeStackNavigator()

export default function AuthStack() {
  const { t } = useTranslation()

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: "#10B981",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontFamily: "Poppins-Medium",
        },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} options={{ title: t("login") }} />
      <Stack.Screen name="Register" component={RegisterScreen} options={{ title: t("register") }} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ title: t("forgotPassword") }} />
      <Stack.Screen
        name="UtilityConnection"
        component={UtilityConnectionScreen}
        options={{ title: t("connectUtility") }}
      />
    </Stack.Navigator>
  )
}

