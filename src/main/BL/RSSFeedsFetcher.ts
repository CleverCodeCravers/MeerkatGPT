import Parser from 'rss-parser';
import fetch from 'node-fetch';

export default class RSSFeedFetcher {
  parser: Parser;

  constructor() {
    this.parser = new Parser();
  }

  async fetchRSSFeeds(urls: string[]): Promise<any[]> {
    const promises = urls.map((url) => this.fetchRSSFeed(url));
    const allFeeds = await Promise.all(promises);
    return allFeeds;
  }

  async fetchRSSFeed(url: string): Promise<any> {
    try {
      const parsedFeed = await this.parser.parseURL(url);
      return parsedFeed;
    } catch (error) {
      console.log(`Error fetching or parsing RSS feed from ${url}:`, error);
      throw error;
    }
  }

  static async isRSSFeedValid(url: string): Promise<boolean | undefined> {
    try {
      const response = await fetch(url);
      return response.headers.get('content-type')?.includes('xml');
    } catch (error) {
      console.error(`Error checking validity of RSS feed from ${url}:`, error);
      return false;
    }
  }
}
