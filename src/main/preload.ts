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
  | 'update-articles';

const electronHandler = {
  ipcRenderer: {
    saveRssFeed(channel: Channels, data: RSSFeedConfig | RSSFeeds) {
      ipcRenderer.send(channel, data);
    },

    async invoke(channel: Channels) {
      return ipcRenderer.invoke(channel);
    },

    removeRSSFeed(channel: Channels, data: string) {
      ipcRenderer.send(channel, data);
    },
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
