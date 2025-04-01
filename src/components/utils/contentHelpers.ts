// // src/utils/contentHelpers.ts
// import { ContentItem } from '../types/ContentTypes';

// export function categorizeContent(title: string, type: 'article' | 'video'): ContentItem['category'] {
//   const lowercaseTitle = title.toLowerCase();
//   if (lowercaseTitle.includes('saving')) return 'Energy Saving';
//   if (lowercaseTitle.includes('monitor')) return 'Smart Monitoring';
//   return 'Renewable Tech';
// }

// export function extractTags(title: string): string[] {
//   return title.toLowerCase().split(' ')
//     .filter(word => word.length > 3 && !['the', 'and', 'with'].includes(word))
//     .slice(0, 5);
// }

// export function calculateReadingTime(text: string): number {
//   const wordsPerMinute = 200;
//   const wordCount = text.split(' ').length;
//   return Math.ceil(wordCount / wordsPerMinute);
// }