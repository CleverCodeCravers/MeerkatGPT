// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { IpcRendererEvent, contextBridge, ipcRenderer } from 'electron';
import { RSSFeeds } from 'renderer/types/RSSFeeds';
import { RSSFeedConfig } from '../renderer/types/RSSFeed';
// import RSSFeedFileManager from 'renderer/BL/RSSFeedFileManager';

export type Channels =
  | 'save-rss'
  | 'fetch-feeds'
  | 'remove-rss'
  | 'update-articles'
  | 'open-url'
  | 'search-gpt'
  | 'gpt-response'
  | 'gpt-loading';

const electronHandler = {
  ipcRenderer: {
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    removeListener(channel: Channels, func: (...args: unknown[]) => void) {
      return () => {
        ipcRenderer.removeListener(channel, func);
      };
    },

    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },

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
