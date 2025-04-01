// // src/services/api/EnergyContentService.ts
// import axios from 'axios';
// import { ContentItem } from '../../components/types/ContentTypes';
// import { categorizeContent, extractTags, calculateReadingTime } from '../../components/utils/contentHelpers';

// class EnergyContentService {
//   private GNEWS_API_KEY = '67fd539cd6ea22ef7d6c6de82677af43';
//   private YOUTUBE_API_KEY = 'AIzaSyDPL57XIkSmYkZIXNqGapzzLfnlNF-WHoE';

//   async fetchEnergyContent(): Promise<ContentItem[]> {
//     try {
//       const articleResponse = await this.fetchArticles();
//       const videoResponse = await this.fetchVideos();
//       return this.shuffleContent([...articleResponse, ...videoResponse]);
//     } catch (error) {
//       console.error('Error fetching energy content:', error);
//       throw error;
//     }
//   }

//   private async fetchArticles(): Promise<ContentItem[]> {
//     try {
//       const response = await axios.get('https://gnews.io/api/v4/search', {
//         params: {
//           q: 'energy technology OR renewable energy',
//           lang: 'en',
//           max: 10,
//           apikey: this.GNEWS_API_KEY
//         }
//       });

//       return response.data.articles.map((article: any) => ({
//         id: article.url,
//         title: article.title,
//         description: article.description,
//         type: 'article',
//         url: article.url,
//         thumbnailUrl: article.image,
//         publishedAt: article.publishedAt,
//         source: article.source.name,
//         category: categorizeContent(article.title, 'article'),
//         tags: extractTags(article.title),
//         readingTime: calculateReadingTime(article.description || '')
//       }));
//     } catch (error) {
//       console.error('Error fetching articles:', error);
//       return [];
//     }
//   }

//   private async fetchVideos(): Promise<ContentItem[]> {
//     try {
//       const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
//         params: {
//           part: 'snippet',
//           q: 'energy saving technology renewable',
//           type: 'video',
//           maxResults: 10,
//           key: this.YOUTUBE_API_KEY
//         }
//       });

//       return response.data.items.map((video: any) => ({
//         id: video.id.videoId,
//         title: video.snippet.title,
//         description: video.snippet.description,
//         type: 'video',
//         url: `https://www.youtube.com/watch?v=${video.id.videoId}`,
//         thumbnailUrl: video.snippet.thumbnails.medium.url,
//         publishedAt: video.snippet.publishedAt,
//         source: video.snippet.channelTitle,
//         category: categorizeContent(video.snippet.title, 'video'),
//         tags: extractTags(video.snippet.title),
//         duration: '10:00' // Placeholder
//       }));
//     } catch (error) {
//       console.error('Error fetching videos:', error);
//       return [];
//     }
//   }

//   private shuffleContent(content: ContentItem[]): ContentItem[] {
//     return content.sort(() => 0.5 - Math.random());
//   }
// }
// export { ContentItem };
// export default new EnergyContentService();