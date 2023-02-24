<template>
  <el-config-provider :locale="localLanguage">
    <el-scrollbar ref="scroll" height="100vh">
      <router-view></router-view>
    </el-scrollbar>
  </el-config-provider>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { ElConfigProvider } from "element-plus";
import zhCn from "element-plus/lib/locale/lang/zh-cn";

let localLanguage = zhCn;

const scroll = ref(null);
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  font-size: 14px;
  color: #2c3e50;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width: 100%;
  margin: 0;
  padding: 0;
  max-width: none;
  text-align: initial;
}
</style>
