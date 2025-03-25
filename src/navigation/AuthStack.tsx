import { createNativeStackNavigator } from "@react-navigation/native-stack"
import LoginScreen from "../screens/auth/LoginScreen"
import RegisterScreen from "../screens/auth/RegisterScreen"
import ForgotPasswordScreen from "../screens/auth/ForgotPasswordScreen"
import UtilityConnectionScreen from "../screens/auth/UtilityConnectionScreen"
import { useTranslation } from "../hooks/useTranslation"

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

