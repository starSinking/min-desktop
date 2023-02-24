// @ts-ignore
const { LOAD_URL } = require("./config.js");
const path = require("path");
const isDev = require("electron-is-dev");
const loadWinURL = isDev ? `http://localhost:8080/#/load` : `${LOAD_URL}#load`;

const createLoadWindow = (BrowserWindow) => {
  const win = new BrowserWindow({
    width: 480,
    height: 310,
    focusable: true,
    transparent: true,
    backgroundColor: "#00000000",
    show: false,
    frame: false,
    resizable: false,
    webPreferences: {
      webSecurity: false,
      nodeIntegration: true,
      contextIsolation: true,
      // 渲染器进程到主进程通信 定义预加载的界面ts
      preload: path.resolve(__dirname, "../modules/preload/load.js"),
    },
  });
  // 加载页面地址 线上内网可切换地址
  win.loadURL(`${loadWinURL}`);
  // // 开发者工具
  win.webContents.openDevTools();
  // 优雅打开界面
  win.on("ready-to-show", () => {
    win.show();
  });
};

module.exports = {
  createLoadWindow,
};
