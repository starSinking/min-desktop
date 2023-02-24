const { contextBridge, ipcRenderer } = require("electron");

const openNotification = async (message) => {
  let result = await ipcRenderer.invoke("on-openNotification-event", message);
};

const screenshot = () => {
  ipcRenderer.invoke("on-screenshot-event");
};

const sendCutInfo = (info) => ipcRenderer.on("main-cut-info", info);

contextBridge.exposeInMainWorld("electronAPI", {
  openNotification,
  screenshot,
  sendCutInfo,
});
