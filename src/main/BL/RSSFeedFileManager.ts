import { writeFileSync, readFileSync, existsSync } from 'fs';
import { RSSFeeds } from 'renderer/types/RSSFeeds';

export default class RSSFeedFileManager {
  filePath: string;

  constructor(filePath: string) {
    this.filePath = filePath;
  }

  checkIfFileExists() {
    if (!existsSync(this.filePath)) {
      writeFileSync(this.filePath, JSON.stringify({ feeds: [] }), 'utf8');
    }
  }

  save(feeds: RSSFeeds) {
    this.checkIfFileExists();
    try {
      writeFileSync(this.filePath, JSON.stringify(feeds, null, 2), 'utf8');
    } catch (error) {
      console.error(error);
    }
  }

  load(): RSSFeeds {
    this.checkIfFileExists();
    const feeds = readFileSync(this.filePath, 'utf8');
    const json = JSON.parse(feeds) as RSSFeeds;
    return json;
  }
}
