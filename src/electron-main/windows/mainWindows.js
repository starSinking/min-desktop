// @ts-ignore
const { LOAD_URL } = require("./config.js");
const path = require("path");
const isDev = require("electron-is-dev");
//客户端尺寸位置记忆插件
const windowStateKeeper = require("electron-window-state");
const mainWinURL = isDev ? `http://localhost:8080/#/` : `${LOAD_URL}#`;

let cutWindow = global.cutWindow;

const closeCutWindow = () => {
  cutWindow && cutWindow.close();
  cutWindow = null;
};

const createMainWindow = (BrowserWindow) => {
  // 默认窗口尺寸
  let mainWindowState = windowStateKeeper({
    defaultWidth: 1000,
    defaultHeight: 800,
  });
  const win = new BrowserWindow({
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
    minHeight: 600,
    focusable: true,
    show: false,
    // frame: false,
    autoHideMenuBar: true,
    webPreferences: {
      webSecurity: true,
      nodeIntegration: true,
      contextIsolation: true,
      // 渲染器进程到主进程通信 定义预加载的ts
      preload: path.resolve(__dirname, "../modules/preload/main.js"),
    },
  });
  // 加载页面地址 线上内网可切换地址
  win.loadURL(mainWinURL);
  // 管理客户端尺寸位置记忆插件
  mainWindowState.manage(win);
  // 开发者工具
  win.webContents.openDevTools();
  // 优雅打开界面
  win.once("ready-to-show", () => {
    win.show();
  });
  win.on("closed", () => {
    closeCutWindow();
  });
  global.mainWindow = win;
};

module.exports = {
  createMainWindow,
};
