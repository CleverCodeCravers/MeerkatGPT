/* eslint-disable no-continue */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-unreachable-loop */
/* eslint-disable no-restricted-syntax */
/* eslint global-require: off, no-console: off, promise/always-return: off */

import path, { join } from 'path';
import Electron, { app, BrowserWindow, shell, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import { RSSFeeds } from 'renderer/types/RSSFeeds';
import RSSFeedFileManager from './BL/RSSFeedFileManager';
import RSSFeedFetcher from './BL/RSSFeedsFetcher';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import GPTHandler from './BL/GPTRequestsHandler';
import { Feed } from './types/Feed';
import fetchNewsArticle from './BL/FeedArticleScraper';
import chunkSubString from './helpers/StringsUtil';
import GPTKeyFileManager from './BL/GPTKeyFileManager';
import { GPTKeys } from './types/GPTKeys';

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;
const configPath = join(app.getPath('userData'), 'feeds.json');
const keysPath = join(app.getPath('userData'), 'keys.json');
const keysManager = new GPTKeyFileManager(keysPath);
const feedManager = new RSSFeedFileManager(configPath);
const feedsFetcher = new RSSFeedFetcher();
const { keys } = keysManager.loadKeys();
let gptKey: string = keys.length >= 1 ? keys[0].keyValue : '';

ipcMain.handle('load-key', (event: Electron.IpcMainInvokeEvent) => {
  event.preventDefault();
  try {
    const savedKeys = keysManager.loadKeys();
    return savedKeys;
  } catch (error) {
    return { keys: [] };
  }
});

ipcMain.on('save-key', (event, args) => {
  gptKey = args.keys[0].keyValue;
  const currentKeys = keysManager.loadKeys();

  const checkifKeyExists = currentKeys.keys.filter((key) => key.id === args.id);
  if (checkifKeyExists.length >= 1) {
    return;
  }

  const newKeys: GPTKeys = {
    keys: [...currentKeys.keys, ...args.keys],
  };

  keysManager.saveKey(newKeys);
});

ipcMain.on('remove-key', (event, args) => {
  const currentKeys = keysManager.loadKeys();

  const checkifKeyExists = currentKeys.keys.filter((key) => key.id === args.id);
  console.log(checkifKeyExists);
  if (checkifKeyExists) {
    keysManager.saveKey({ keys: checkifKeyExists });
  }
});

ipcMain.on('save-rss', (event, args) => {
  const currentFeeds = feedManager.load();
  const newFeeds = {
    feeds: [...currentFeeds.feeds, args.feeds ? [...args.feeds] : args],
  };
  feedManager.save(newFeeds);
});

ipcMain.on('remove-rss', (event, args) => {
  const currentFeeds = feedManager.load();
  const updatedFeeds = currentFeeds.feeds.filter((feed) => feed.name !== args);
  const newFeeds = { feeds: updatedFeeds };
  feedManager.save(newFeeds);
});

ipcMain.on('open-url', async (event, args) => {
  shell.openExternal(args);
});

ipcMain.handle('search-gpt', async (event, args) => {
  if (!gptKey) return 'You have to provide your GPT Key!';

  const gpt = new GPTHandler(gptKey);
  event.preventDefault();

  const articles = args.articles as Feed[];
  const results: any[] = [];

  for (const feed of articles) {
    if (feed?.items) {
      for (const item of feed.items) {
        event.sender.send('gpt-loading', {
          feed: item,
          loading: true,
        });

        const fetchArticle = await fetchNewsArticle(item.link);
        if (!fetchNewsArticle) continue;
        const text = `
        Bitte prüfe ob der untengenannte Text Informationen zu ${args.searchQuery} enthält. Antworte mit Ja oder nein nur.
            '
            ${fetchArticle}
            '`;

        const textProccessed = chunkSubString(text, 4000);
        const response = await gpt.askGPT([
          { role: 'user', content: textProccessed[0] },
          {
            role: 'user',
            content: `Welche Informationen zu ${args.searchQuery} enthält der oben genannte Text`,
          },
        ]);

        results.push(response); // Store the response for each article

        // Send the response back to the frontend
        event.sender.send('gpt-response', {
          feed: item,
          response,
          loading: false,
        });
      }
    }
  }

  return results.flat(1);
});

ipcMain.handle('update-articles', async (event) => {
  event.preventDefault();

  try {
    const feeds = feedManager.load();
    if (feeds.feeds.length === 0) return [];
    const articles = await feedsFetcher.fetchRSSFeeds(feeds);
    return articles;
  } catch (error) {
    return [];
  }
});

ipcMain.handle('fetch-feeds', (event: Electron.IpcMainInvokeEvent) => {
  event.preventDefault();
  try {
    const feeds: RSSFeeds = feedManager.load();
    return feeds;
  } catch (error) {
    return { feeds: [] };
  }
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

// const installExtensions = async () => {
//   const installer = require('electron-devtools-installer');
//   const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
//   const extensions = ['REACT_DEVELOPER_TOOLS'];

//   return installer
//     .default(
//       extensions.map((name) => installer[name]),
//       forceDownload
//     )
//     .catch(console.log);
// };

const createWindow = async () => {
  // if (isDebug) {
  //   // await installExtensions();
  // }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: true,
    width: 1600,
    height: 1050,
    minWidth: 1450,

    icon: getAssetPath('meerkat/favicon.ico'),
    webPreferences: {
      devTools: !!isDebug,
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
