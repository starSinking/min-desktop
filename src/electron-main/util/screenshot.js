const { desktopCapturer, screen, BrowserWindow } = require("electron");
const screenCapture = () => {
  //定义屏幕大小
  const getSize = () => {
    const { size, scaleFactor } = screen.getPrimaryDisplay();
    return {
      width: size.width * scaleFactor,
      height: size.height * scaleFactor,
    };
  };

  const sizeInfo = getSize();
  desktopCapturer
    .getSources({
      types: ["window", "screen"], // 设定需要捕获的是"屏幕"，还是"窗口"
      thumbnailSize: sizeInfo,
    })
    .then(async (sources) => {
      //获取第一个屏幕
      let imageData = sources[0].thumbnail.toDataURL("image/png");
      //将base64 流发送到渲染进程
      BrowserWindow.getFocusedWindow().webContents.send(
        "screenSource",
        imageData
      );
    });
};

module.exports = {
  screenCapture,
};
