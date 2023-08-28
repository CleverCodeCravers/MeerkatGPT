// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer } from 'electron';
import { RSSFeeds } from 'renderer/types/RSSFeeds';
import { RSSFeedConfig } from '../renderer/types/RSSFeed';
// import RSSFeedFileManager from 'renderer/BL/RSSFeedFileManager';

export type Channels =
  | 'save-rss'
  | 'fetch-feeds'
  | 'remove-rss'
  | 'update-articles'
  | 'open-url'
  | 'search-gpt';

const electronHandler = {
  ipcRenderer: {
    saveRssFeed(channel: Channels, data: RSSFeedConfig | RSSFeeds) {
      ipcRenderer.send(channel, data);
    },

    async invoke(channel: Channels, args?: any) {
      return ipcRenderer.invoke(channel, args);
    },

    removeRSSFeed(channel: Channels, data: string) {
      ipcRenderer.send(channel, data);
    },

    openExternal(channel: Channels, url: string) {
      ipcRenderer.send(channel, url);
    },
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
