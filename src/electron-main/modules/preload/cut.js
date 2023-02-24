const { contextBridge, ipcRenderer } = require("electron");

const showCutScreen = async () => {
  let result = await ipcRenderer.invoke("show-cut-screen");
  return result;
};

// const showCutScreen = () => ipcRenderer.send("show-cut-screen");

const getCutInfo = (info) => ipcRenderer.send("get-cut-info", info);
const closeCut = () => ipcRenderer.send("close-cut");

contextBridge.exposeInMainWorld("electronAPI", {
  showCutScreen,
  getCutInfo,
  closeCut,
});
