// import React, { useState, useEffect } from 'react';
// import { 
//   View, 
//   Text, 
//   FlatList, 
//   Linking,
//   Modal,
//   ScrollView,
//   StyleSheet,
//   TouchableOpacity
// } from 'react-native';
// import VideoPlayer from 'react-native-video-player';
// import EnergyContentService, {ContentItem}  from '../../services/api/EnergyContentServices';
// import ContentItemCard from '../../components/ui/ContentItemCard';

// const EnergyContentScreen: React.FC = () => {
//   const [content, setContent] = useState<ContentItem[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);

//   useEffect(() => {
//     const fetchContent = async () => {
//       try {
//         const fetchedContent = await EnergyContentService.fetchEnergyContent();
//         setContent(fetchedContent);
//       } catch (error) {
//         console.error('Failed to fetch content', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchContent();
//   }, []);

//   const openContent = (item: ContentItem) => {
//     if (item.type === 'article') {
//       Linking.openURL(item.url);
//     } else {
//       setSelectedContent(item);
//     }
//   };

//   const renderContentItem = ({ item }: { item: ContentItem }) => (
//     <ContentItemCard 
//       item={item}
//       onPress={() => openContent(item)}
//     />
//   );

//   const VideoModal = () => (
//     <Modal
//       visible={!!selectedContent}
//       transparent={true}
//       onRequestClose={() => setSelectedContent(null)}
//     >
//       <View style={styles.modalContainer}>
//         {selectedContent && (
//           <View style={styles.modalContent}>
//             <VideoPlayer
//               video={{ uri: selectedContent.url }}
//               thumbnail={{ uri: selectedContent.thumbnailUrl }}
//             />
//             <Text style={styles.modalTitle}>{selectedContent.title}</Text>
//             <ScrollView>
//               <Text style={styles.modalDescription}>
//                 {selectedContent.description}
//               </Text>
//             </ScrollView>
//             <TouchableOpacity 
//               style={styles.closeButton}
//               onPress={() => setSelectedContent(null)}
//             >
//               <Text style={styles.closeButtonText}>Close</Text>
//             </TouchableOpacity>
//           </View>
//         )}
//       </View>
//     </Modal>
//   );

//   if (loading) {
//     return <Text>Loading content...</Text>;
//   }

//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={content}
//         renderItem={renderContentItem}
//         keyExtractor={(item) => item.id}
//         ListHeaderComponent={
//           <Text style={styles.screenTitle}>Energy & Technology Insights</Text>
//         }
//       />
//       <VideoModal />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f4f4f4',
//   },
//   screenTitle: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     padding: 16,
//     textAlign: 'center',
//   },
//   modalContainer: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.7)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalContent: {
//     width: '90%',
//     backgroundColor: 'white',
//     borderRadius: 10,
//     padding: 16,
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginVertical: 10,
//   },
//   modalDescription: {
//     fontSize: 14,
//     color: '#666',
//   },
//   closeButton: {
//     backgroundColor: '#007bff',
//     padding: 12,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginTop: 10,
//   },
//   closeButtonText: {
//     color: 'white',
//     fontWeight: 'bold',
//   },
// });

// export default EnergyContentScreen;