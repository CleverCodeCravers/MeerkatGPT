import { FeedArticleItem } from './FeedArticleItem';

export interface Feed {
  description?: string;
  items?: FeedArticleItem[];
  language?: string;
  lastBuildDate?: string;
  link?: string;
  title?: string;
}
