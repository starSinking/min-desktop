// @ts-ignore
const { LOAD_URL } = require("./config.js");
const path = require("path");
const isDev = require("electron-is-dev");
const { screen } = require("electron");

const mainWinURL = isDev ? `http://localhost:8080/#/cut` : `${LOAD_URL}#`;

const getSize = () => {
  const { size, scaleFactor } = screen.getPrimaryDisplay();
  return {
    width: size.width * scaleFactor,
    height: size.height * scaleFactor,
  };
};

const createCutWindow = (BrowserWindow) => {
  const { width, height } = getSize();
  const win = new BrowserWindow({
    width,
    height,
    autoHideMenuBar: true,
    useContentSize: true,
    movable: false,
    frame: false,
    resizable: false,
    hasShadow: false,
    transparent: true,
    fullscreen: true,
    simpleFullscreen: true,
    alwaysOnTop: false,
    // opacity: 0.3,
    show: false,
    webPreferences: {
      webSecurity: true,
      nodeIntegration: true,
      contextIsolation: true,
      // 渲染器进程到主进程通信
      preload: path.resolve(__dirname, "../modules/preload/cut.js"),
    },
  });
  // 加载页面地址 线上内网可切换地址
  win.loadURL(mainWinURL);
  // 开发者工具
  // win.webContents.openDevTools();
  win.maximize();
  win.setFullScreen(true);
  // 优雅打开界面
  // win.once("ready-to-show", () => {
  //   win.show();
  // });
  global.cutWindow = win;
};

module.exports = {
  createCutWindow,
};
