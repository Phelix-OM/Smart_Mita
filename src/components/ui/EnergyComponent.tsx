// import React from 'react'
// import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
// import { useTheme } from '../../contexts/ThemeContext'
// import { useLanguage } from '../../contexts/LanguageContext'

// // 1. Carbon Footprint Calculator Component
// interface CarbonFootprintProps {
//   energyUsage: number;
// }

// export const CarbonFootprintCalculator: React.FC<CarbonFootprintProps> = ({ energyUsage }) => {
//   const { theme } = useTheme()
//   const { t } = useLanguage()
//   const [selectedTransport, setSelectedTransport] = React.useState('car');
  
//   const calculateCarbonOffset = () => {
//     const carbonEquivalents = {
//       car: 0.192,
//       bus: 0.105,
//       train: 0.041,
//       bicycle: 0
//     };

//     const energyToCO2 = energyUsage * 0.5;
//     const transportOffset = carbonEquivalents[selectedTransport];

//     return {
//       totalCO2: energyToCO2.toFixed(2),
//       equivalentKm: (energyToCO2 / transportOffset).toFixed(2)
//     };
//   };

//   const carbonData = calculateCarbonOffset();

//   return (
//     <View style={{
//       backgroundColor: theme.colors.card,
//       borderRadius: 10,
//       padding: 15,
//       margin: 10,
//     }}>
//       <Text style={{ 
//         fontSize: 18, 
//         fontWeight: 'bold', 
//         color: theme.colors.text,
//         marginBottom: 10 
//       }}>
//         {t('carbonFootprint')}
//       </Text>
      
//       <View style={{ 
//         flexDirection: 'row', 
//         justifyContent: 'space-between', 
//         marginBottom: 15 
//       }}>
//         {['car', 'bus', 'train', 'bicycle'].map(transport => (
//           <TouchableOpacity 
//             key={transport}
//             onPress={() => setSelectedTransport(transport)}
//             style={{
//               padding: 10,
//               backgroundColor: selectedTransport === transport 
//                 ? theme.colors.primary 
//                 : theme.colors.background,
//               borderRadius: 5
//             }}
//           >
//             <Text style={{ 
//               color: selectedTransport === transport 
//                 ? theme.colors.text 
//                 : theme.colors.secondary 
//             }}>
//               {transport.charAt(0).toUpperCase() + transport.slice(1)}
//             </Text>
//           </TouchableOpacity>
//         ))}
//       </View>
      
//       <View>
//         <Text style={{ color: theme.colors.text }}>
//           Total CO2 Emissions: {carbonData.totalCO2} kg
//         </Text>
//         <Text style={{ color: theme.colors.text }}>
//           Equivalent to {carbonData.equivalentKm} km by {selectedTransport}
//         </Text>
//       </View>
//     </View>
//   );
// };

// // 2. Energy Saving Challenges Component
// export const EnergySavingChallenges: React.FC = () => {
//   const { theme } = useTheme()
//   const { t } = useLanguage()

//   const challenges = [
//     { 
//       title: t('sevenDayChallenge'), 
//       description: t('sevenDayDescription'),
//       reward: t('greenPoints', { points: 500 })
//     },
//     { 
//       title: t('smartApplianceChallenge'), 
//       description: t('smartApplianceDescription'),
//       reward: t('greenPoints', { points: 750 })
//     },
//     { 
//       title: t('noStandbyChallenge'), 
//       description: t('noStandbyDescription'),
//       reward: t('greenPoints', { points: 1500 })
//     }
//   ];

//   return (
//     <View style={{
//       backgroundColor: theme.colors.card,
//       borderRadius: 10,
//       padding: 15,
//       margin: 10,
//     }}>
//       <Text style={{ 
//         fontSize: 18, 
//         fontWeight: 'bold', 
//         color: theme.colors.text,
//         marginBottom: 10 
//       }}>
//         {t('energySavingChallenges')}
//       </Text>
      
//       {challenges.map((challenge, index) => (
//         <View 
//           key={index} 
//           style={{
//             backgroundColor: theme.colors.background,
//             borderRadius: 5,
//             padding: 10,
//             marginBottom: 10
//           }}
//         >
//           <Text style={{ 
//             fontWeight: 'bold', 
//             color: theme.colors.text 
//           }}>
//             {challenge.title}
//           </Text>
//           <Text style={{ color: theme.colors.text }}>
//             {challenge.description}
//           </Text>
//           <Text style={{ color: theme.colors.primary }}>
//             {challenge.reward}
//           </Text>
//         </View>
//       ))}
//     </View>
//   );
// };

// // 3. Community Impact Tracker
// export const CommunityImpactTracker: React.FC = () => {
//   const { theme } = useTheme()
//   const { t } = useLanguage()

//   const communityStats = {
//     totalEnergySaved: 245678,
//     treesEquivalent: 3456,
//     co2Reduced: 178.5
//   };

//   return (
//     <View style={{
//       backgroundColor: theme.colors.card,
//       borderRadius: 10,
//       padding: 15,
//       margin: 10,
//     }}>
//       <Text style={{ 
//         fontSize: 18, 
//         fontWeight: 'bold', 
//         color: theme.colors.text,
//         marginBottom: 10 
//       }}>
//         {t('communityImpact')}
//       </Text>
      
//       <View style={{ 
//         flexDirection: 'row', 
//         justifyContent: 'space-between' 
//       }}>
//         {[
//           { 
//             value: communityStats.totalEnergySaved.toLocaleString(), 
//             label: t('kWhSaved') 
//           },
//           { 
//             value: communityStats.treesEquivalent, 
//             label: t('treesSaved') 
//           },
//           { 
//             value: communityStats.co2Reduced, 
//             label: t('tonsCO2Reduced') 
//           }
//         ].map((stat, index) => (
//           <View key={index} style={{ alignItems: 'center' }}>
//             <Text style={{ 
//               fontSize: 16, 
//               fontWeight: 'bold', 
//               color: theme.colors.primary 
//             }}>
//               {stat.value}
//             </Text>
//             <Text style={{ color: theme.colors.text }}>
//               {stat.label}
//             </Text>
//           </View>
//         ))}
//       </View>
//     </View>
//   );
// };

// // 4. Energy Marketplace
// export const EnergyMarketplace: React.FC = () => {
//   const { theme } = useTheme()
//   const { t } = useLanguage()

//   const marketplaceItems = [
//     { 
//       name: t('smartPowerStrip'), 
//       points: 500, 
//       description: t('smartPowerStripDescription') 
//     },
//     { 
//       name: t('ledBulbPack'), 
//       points: 250, 
//       description: t('ledBulbPackDescription') 
//     }
//   ];

//   return (
//     <View style={{
//       backgroundColor: theme.colors.card,
//       borderRadius: 10,
//       padding: 15,
//       margin: 10,
//     }}>
//       <Text style={{ 
//         fontSize: 18, 
//         fontWeight: 'bold', 
//         color: theme.colors.text,
//         marginBottom: 10 
//       }}>
//         {t('energyMarketplace')}
//       </Text>
      
//       {marketplaceItems.map((item, index) => (
//         <View 
//           key={index} 
//           style={{
//             flexDirection: 'row',
//             justifyContent: 'space-between',
//             alignItems: 'center',
//             backgroundColor: theme.colors.background,
//             borderRadius: 5,
//             padding: 10,
//             marginBottom: 10
//           }}
//         >
//           <View style={{ flex: 1 }}>
//             <Text style={{ 
//               fontWeight: 'bold', 
//               color: theme.colors.text 
//             }}>
//               {item.name}
//             </Text>
//             <Text style={{ color: theme.colors.text }}>
//               {item.description}
//             </Text>
//           </View>
//           <TouchableOpacity 
//             style={{
//               backgroundColor: theme.colors.primary,
//               padding: 8,
//               borderRadius: 5
//             }}
//           >
//             <Text style={{ color: theme.colors.background }}>
//               {item.points} {t('points')}
//             </Text>
//           </TouchableOpacity>
//         </View>
//       ))}
//     </View>
//   );
// };

// // 5. Environmental Goals Tracker
// export const EnvironmentalGoalsTracker: React.FC = () => {
//   const { theme } = useTheme()
//   const { t } = useLanguage()

//   const goals = [
//     { title: t('reduceCarbonFootprint'), progress: 0.65 },
//     { title: t('lowerMonthlyEnergyBill'), progress: 0.45 },
//     { title: t('increaseRenewableEnergyUsage'), progress: 0.30 }
//   ];

//   return (
//     <View style={{
//       backgroundColor: theme.colors.card,
//       borderRadius: 10,
//       padding: 15,
//       margin: 10,
//     }}>
//       <Text style={{ 
//         fontSize: 18, 
//         fontWeight: 'bold', 
//         color: theme.colors.text,
//         marginBottom: 10 
//       }}>
//         {t('environmentalGoals')}
//       </Text>
      
//       {goals.map((goal, index) => (
//         <View key={index} style={{ marginBottom: 15 }}>
//           <View style={{ 
//             flexDirection: 'row', 
//             justifyContent: 'space-between', 
//             marginBottom: 5 
//           }}>
//             <Text style={{ color: theme.colors.text }}>
//               {goal.title}
//             </Text>
//             <Text style={{ color: theme.colors.text }}>
//               {(goal.progress * 100).toFixed(0)}%
//             </Text>
//           </View>
//           <View style={{ 
//             height: 8, 
//             backgroundColor: theme.colors.background,
//             borderRadius: 4,
//             overflow: 'hidden'
//           }}>
//             <View 
//               style={{ 
//                 height: '100%', 
//                 width: ${goal.progress * 100}%, 
//                 backgroundColor: theme.colors.primary 
//               }} 
//             />
//           </View>
//         </View>
//       ))}
//     </View>
//   );
// };


// export const EnergyInsightsScreen: React.FC = () => {
//   return (
//     <ScrollView>
//       <CarbonFootprintCalculator energyUsage={28.5} />
//       <EnergySavingChallenges />
//       <CommunityImpactTracker />
//       <EnergyMarketplace />
//       <EnvironmentalGoalsTracker />
//     </ScrollView>
//   );
// };