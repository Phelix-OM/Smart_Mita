// // src/components/ui/ContentItemCard.tsx
// import React from 'react';
// import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
// import { ContentItem } from '../types/ContentTypes';

// interface ContentItemCardProps {
//   item: ContentItem;
//   onPress: () => void;
// }

// const ContentItemCard: React.FC<ContentItemCardProps> = ({ item, onPress }) => {
//   return (
//     <TouchableOpacity 
//       style={styles.card} 
//       onPress={onPress}
//       accessibilityLabel={`Open ${item.title}`}
//     >
//       {item.thumbnailUrl && (
//         <Image 
//           source={{ uri: item.thumbnailUrl }} 
//           style={styles.thumbnail} 
//         />
//       )}
//       <View style={styles.cardContent}>
//         <Text style={styles.title} numberOfLines={2}>
//           {item.title}
//         </Text>
//         <Text style={styles.description} numberOfLines={3}>
//           {item.description}
//         </Text>
//         <View style={styles.metaContainer}>
//           <Text style={styles.metaText}>{item.type.toUpperCase()}</Text>
//           <Text style={styles.metaText}>{item.category}</Text>
//         </View>
//       </View>
//     </TouchableOpacity>
//   );
// };

// const styles = StyleSheet.create({
//   card: {
//     backgroundColor: 'white',
//     borderRadius: 10,
//     marginBottom: 10,
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   thumbnail: {
//     width: '100%',
//     height: 200,
//     borderTopLeftRadius: 10,
//     borderTopRightRadius: 10,
//   },
//   cardContent: {
//     padding: 15,
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 5,
//   },
//   description: {
//     color: '#666',
//     marginBottom: 10,
//   },
//   metaContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   metaText: {
//     color: '#888',
//     fontSize: 12,
//   },
// });

// export default React.memo(ContentItemCard);