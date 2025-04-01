import RootWrapper from "./src/components/RootWrapper"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { ThemeProvider } from "styled-components/native"
import { LanguageProvider } from "./src/contexts/LanguageContext"
import { AuthProvider } from "./src/contexts/AuthContext"
import { UtilityProvider } from "./src/contexts/UtilityContext"
import UtilityConnectionScreen from "./src/screens/UtilityConnectionScreen"
import { NotificationProvider } from "./src/contexts/NotificationContext"
import { NavigationContainer } from "@react-navigation/native"
import { StatusBar } from "expo-status-bar"
import RootNavigator from "./src/navigation"
import ChatbotAssistant from "./src/screens/main/Chatbot" 
export default function App() {
 return (
   <SafeAreaProvider>
     <ThemeProvider>
       <LanguageProvider>
         <AuthProvider>
           <UtilityProvider>
             <UtilityConnectionScreen>
               <NotificationProvider>
                 <RootWrapper>
                   <NavigationContainer>
                     <StatusBar style="auto" />
                     <RootNavigator />
                     <ChatbotAssistant />
                   </NavigationContainer>
                 </RootWrapper>
               </NotificationProvider>
             </UtilityConnectionScreen>
           </UtilityProvider>
         </AuthProvider>
       </LanguageProvider>
     </ThemeProvider>
   </SafeAreaProvider>
 )
}