const {
  ipcMain,
  BrowserWindow,
  Notification,
  desktopCapturer,
  screen,
} = require("electron");
const { createMainWindow } = require("../../windows/mainWindows.js");
const { createLoginWindow } = require("../../windows/loginWindows");
const { createCutWindow } = require("../../windows/cutWindows.js");
const { screenCapture } = require("../../util/screenshot");

// 监听主窗口发送通知事件
const openNotification = () => {
  ipcMain.handle("on-openNotification-event", (event, message) => {
    const NOTIFICATION_TITLE = "通知";
    const NOTIFICATION_BODY = message;
    new Notification({
      title: NOTIFICATION_TITLE,
      body: NOTIFICATION_BODY,
      silent: true,
    }).show();
  });
};

const getSize = () => {
  const { size, scaleFactor } = screen.getPrimaryDisplay();
  return {
    width: size.width * scaleFactor,
    height: size.height * scaleFactor,
  };
};

// 监听主窗口点击截图事件
const screenshot = () => {
  ipcMain.handle("on-screenshot-event", (event) => {
    const webContents = event.sender;
    const win = BrowserWindow.fromWebContents(webContents);
    win.hide();
    createCutWindow(BrowserWindow);
    return "开始截屏";
  });
};

// 监听截图窗口初始化并截屏
const showCutScreen = () => {
  ipcMain.handle("show-cut-screen", async (e) => {
    const { id } = screen.getPrimaryDisplay();
    let url = "";
    let sources = await desktopCapturer.getSources({
      types: ["screen"],
      thumbnailSize: getSize(),
    });
    for (let source of sources) {
      if (parseInt(source.display_id, 10) === id) {
        // try {
        //     const stream = await navigator.mediaDevices.getUserMedia(
        //         {
        //             audio: false,
        //             video: {
        //                 mandatory: {
        //                     chromeMediaSource: 'desktop',
        //                     chromeMediaSourceId: source.id,
        //                     minWidth: size.width,
        //                     maxWidth: size.width,
        //                     minHeight: size.height,
        //                     maxHeight: size.height,
        //                 },
        //             },
        //         }
        //     )
        //     // console.log(stream);
        //     handleStream(stream, cb)
        // } catch (error) {
        //     console.log(error)
        // }
        // global.cutWindow.show();
        url = source.thumbnail.toDataURL("image/png");
      }
    }
    global.cutWindow.show();
    return url;
  });
};

// 获取到截图信息后关闭截图窗口，并把信息发送给主窗口
const getCutInfo = () => {
  ipcMain.on("get-cut-info", async (e, info) => {
    global.cutWindow.close();
    global.mainWindow.webContents.send("main-cut-info", info);
    global.mainWindow.show();
  });
};

// 取消截图
const closeCut = () => {
  ipcMain.on("close-cut", async (e) => {
    global.cutWindow.close();
    global.mainWindow.show();
  });
};

const InitController = (app) => {
  openNotification();
  screenshot();
  showCutScreen();
  getCutInfo();
  closeCut();
};

module.exports = {
  InitController,
};
