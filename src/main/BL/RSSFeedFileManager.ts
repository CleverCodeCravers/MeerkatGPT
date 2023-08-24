import { writeFileSync, readFileSync } from 'fs';
import { RSSFeeds } from 'renderer/types/RSSFeeds';

export default class RSSFeedFileManager {
  filePath: string;

  constructor(filePath: string) {
    this.filePath = filePath;
  }

  save(feeds: RSSFeeds) {
    try {
      writeFileSync(this.filePath, JSON.stringify(feeds, null, 2), 'utf8');
    } catch (error) {
      console.error(error);
    }
  }

  load(): RSSFeeds {
    const feeds = readFileSync(this.filePath, 'utf8');
    const json = JSON.parse(feeds) as RSSFeeds;
    return json;
  }
}
