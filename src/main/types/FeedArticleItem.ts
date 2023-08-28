export interface FeedArticleItem {
  title: string;
  link: string;
  'content:encoded': string;
  'content:encodedSnippet': string;
  content: string;
  contentSnippet: string;
  pubDate: string;
  guid: string;
  isoDate: Date;
}
