const { InitController } = require("./modules/controller/main.js");
const { app, BrowserWindow } = require("electron");
const { createMainWindow } = require("./windows/mainWindows.js");
const { createLoginWindow } = require("./windows/loginWindows.js");
const { createLoadWindow } = require("./windows/loadWindows.js");
const { initTray } = require("./tray/index.js");
const { initShortCut, unInstallShortCut } = require("./shortcut/index");
app.whenReady().then(() => {
  createMainWindow(BrowserWindow);
  // createLoadWindow(BrowserWindow);
  app.on("activate", () => {
    //即使没有打开任何窗口，macOS 应用通常也会继续运行， 在mac上如果没有任何活动的窗口，就创建一个
    if (BrowserWindow.getAllWindows().length === 0)
      createLoginWindow(BrowserWindow);
  });
  // 初始化监听事件
  InitController(app);
  // 初始化托盘
  initTray();
  // 初始化快捷键
  initShortCut();
});
// 除了 macOS 外，当所有窗口都被关闭的时候退出程序。
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
// 客户端聚焦
app.on("browser-window-focus", () => {
  // 初始化快捷键
  initShortCut();
  console.log("browser-window-focus");
});
// 客户端失去焦点
app.on("browser-window-blur", () => {
  // 注销快捷键
  unInstallShortCut();
  console.log("browser-window-blur");
});
app.on("will-quit", () => {
  // 注销快捷键
  unInstallShortCut();
});
