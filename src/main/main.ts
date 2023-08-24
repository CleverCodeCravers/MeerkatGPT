/* eslint global-require: off, no-console: off, promise/always-return: off */

import path, { join } from 'path';
import Electron, { app, BrowserWindow, shell, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import { RSSFeeds } from 'renderer/types/RSSFeeds';
import RSSFeedFileManager from './BL/RSSFeedFileManager';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;
const configPath = join(app.getPath('userData'), 'feeds.json');

const feedManager = new RSSFeedFileManager(configPath);

console.log(join(app.getPath('userData'), 'feeds.json'));

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

ipcMain.handle('fetch-feeds', (event: Electron.IpcMainInvokeEvent) => {
  console.log(event.preventDefault());
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
    icon: getAssetPath('meerkat/favicon.ico'),
    webPreferences: {
      devTools: true,
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
