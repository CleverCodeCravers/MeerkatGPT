import Parser from 'rss-parser';
import { RSSFeedConfig } from 'renderer/types/RSSFeed';
import { RSSFeeds } from 'renderer/types/RSSFeeds';
import { Feed } from 'main/types/Feed';

export default class RSSFeedFetcher {
  parser: Parser;

  constructor() {
    this.parser = new Parser();
  }

  async fetchRSSFeeds(feeds: RSSFeeds): Promise<Feed[]> {
    const promises = feeds.feeds.map((feed) => this.fetchRSSFeed(feed));
    const allFeeds = await Promise.all(promises);
    return allFeeds;
  }

  async fetchRSSFeed(feed: RSSFeedConfig): Promise<any> {
    try {
      const parsedFeed = await this.parser.parseURL(feed.url);
      return parsedFeed;
    } catch (error) {
      console.log(
        `Error fetching or parsing RSS feed from ${feed.name}:`,
        error
      );
      throw error;
    }
  }
}
