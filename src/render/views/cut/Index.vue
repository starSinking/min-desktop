<template>
  <div
    class="container"
    :style="'background-image:url(' + bg + ')'"
    ref="container"
    @mousedown="onMouseDown"
    @mousemove="onMouseMove"
    @mouseup="onMouseUp"
  ></div>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue";
import Konva from "konva";
import { Shortcuts } from "shortcuts";
const shortcuts = new Shortcuts();

let container = ref(null);
let bg = ref("");

onMounted(async () => {
  const res = await window.electronAPI.showCutScreen();
  bg.value = res;
  render();
});

// 绘制截图
let stage: any, layer: any, rect: any, transformer;

const createStage = () => {
  return new Konva.Stage({
    container: container.value,
    width: window.innerWidth,
    height: window.innerHeight,
  });
};

const createLayer = (stage: any) => {
  let layer = new Konva.Layer();
  stage.add(layer);
  layer.draw();
  return layer;
};

const render = () => {
  stage = createStage();
  layer = createLayer(stage);
};

const createRect = (
  layer: any,
  x: any,
  y: any,
  w = 0,
  h = 0,
  opacity = 0,
  draggable = false
) => {
  const { clientWidth, clientHeight } = container.value;
  const width = w,
    height = h;
  let rect = new Konva.Rect({
    x,
    y,
    width,
    height,
    fill: `rgba(255,0,0,${opacity})`,
    name: "rect",
    draggable,
    // ...
  });
  layer.add(rect);
  return rect;
};

let isDown = false;
let rectOption = {};

const onMouseDown = (e: any) => {
  if (rect || isDown) return;
  isDown = true;
  const { pageX, pageY } = e;
  rectOption.x = pageX || 0;
  rectOption.y = pageY || 0;
  rect = createRect(layer, pageX, pageY, 0, 0, 0.25, false);
  rect.draw();
  console.log("鼠标按下");
};

const onMouseMove = (e) => {
  if (!isDown) return;
  const { pageX, pageY } = e;
  let w = pageX - rectOption.x;
  let h = pageY - rectOption.y;
  rect.remove();
  rect = createRect(layer, rectOption.x, rectOption.y, w, h, 0.25, false);
  rect.draw();
  console.log("鼠标移动");
};

const onMouseUp = (e) => {
  if (!isDown) return;
  isDown = false;
  const { pageX, pageY } = e;
  let w = pageX - rectOption.x;
  let h = pageY - rectOption.y;
  rect.remove();
  rect = createRect(layer, rectOption.x, rectOption.y, w, h, 0, true);
  rect.draw();
  console.log("鼠标抬起");
  //
  transformer = createTransformer(rect);
};

const createTransformer = (rect) => {
  var tr = new Konva.Transformer();
  layer.add(tr);
  tr.attachTo(rect);
  layer.draw();
};

// 根据区域生成图片
const getCutImage = async (info) => {
  const { x, y, width, height } = info;
  let img = new Image();
  img.src = bg.value;
  let canvas = document.createElement("canvas");
  let ctx = canvas.getContext("2d");
  canvas.width = ctx.width = width;
  canvas.height = ctx.height = height;
  ctx.drawImage(img, -x, -y, window.innerWidth, window.innerHeight);
  return canvas.toDataURL("image/png");
};

// 确认截图方法
const handleCut = async () => {
  const { width, height, x, y, scaleX = 1, scaleY = 1 } = rect.attrs;
  let _x = width > 0 ? x : x + width * scaleX;
  let _y = height > 0 ? y : y + height * scaleY;
  let pic = await getCutImage({
    x: _x,
    y: _y,
    width: Math.abs(width) * scaleX,
    height: Math.abs(height) * scaleY,
  });
  window.electronAPI.getCutInfo(pic);
};

// 直接退出截屏
const closeCut = () => {
  window.electronAPI.closeCut();
};

shortcuts.add([
  {
    shortcut: "Enter",
    handler: handleCut,
  },
  {
    shortcut: "Esc",
    handler: closeCut,
  },
]);
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background-color: transparent;
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
</style>
