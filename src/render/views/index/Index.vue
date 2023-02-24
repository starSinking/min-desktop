<template>
  <div class="index-content">
    <h1>1111</h1>
    <el-button type="primary" @click="handleSendNotification"
      >发送通知</el-button
    >
    <el-button type="primary" @click="handleScreenshot">截屏</el-button>

    <div class="demo-image__preview">
      <el-image
        style="width: 100px; height: 100px"
        :src="url"
        :zoom-rate="1.2"
        :preview-src-list="srcList"
        :initial-index="0"
        fit="cover"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

onMounted(() => {
  getCutInfo();
});

let url = ref("");
let srcList = ref([]);

const handleSendNotification = () => {
  window.electronAPI.openNotification("我发送了一个通知");
};

const handleScreenshot = () => {
  window.electronAPI.screenshot();
};
const getCutInfo = () => {
  window.electronAPI.sendCutInfo((_event: any, info: string) => {
    url.value = info;
    srcList.value.push(info);
  });
};
</script>

<style lang="scss" scoped>
.index-content {
  max-width: 1280px;
  margin: 0 auto;
  text-align: center;
}
</style>
