import path from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
// 自动导入element ui
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import Icons from "unplugin-icons/vite";
import IconsResolver from "unplugin-icons/resolver";

const pathSrc = path.resolve(__dirname, "src");

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [
        ElementPlusResolver(),
        // 自动导入图标组件
        IconsResolver({
          prefix: "Icon",
        }),
      ],
      dts: path.resolve(pathSrc, "auto-imports.d.ts"),
    }),
    Components({
      resolvers: [
        // 自动注册图标组件
        IconsResolver({
          enabledCollections: ["ep"],
        }),
        ElementPlusResolver(),
      ],
      dts: path.resolve(pathSrc, "components.d.ts"),
    }),
    Icons({
      autoInstall: true,
    }),
  ],
  define: {
    "process.env": {},
  },
  resolve: {
    alias: {
      "@": resolve("./src"),
    },
  },
  css: {
    preprocessorOptions: {
      // 引入公用的样式
      scss: {
        additionalData: `@use "@/render/styles/index.scss" as *; @use "@/render/styles/element/index.scss" as *;`,
        charset: false,
      },
    },
  },
  base: "./", // 打包路径
  server: {
    host: "0.0.0.0", //指定服务器应该监听哪个 IP 地址
    port: 8080, // 服务端口号
    cors: true, // 允许跨域
    base: "./ ", //生产环境路径
    strictPort: false, // 设为 true 时若端口已被占用则会直接退出，而不是尝试下一个可用端口
    open: true, // 服务器启动时自动在浏览器中打开应用程序 此值为字符串时，会被用作 URL 的路径名
    fs: {
      strict: false,
    },
    proxy: {
      //拦截请求地址包含/api，匹配到的是生产环境
      "/api": {
        target: "http://192.168.12.184:30002", //后台服务地址
        changeOrigin: true,
        //重写，/api开头的替换成空字符串，即去掉接口中去掉这个字符串
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
      //匹配到的时开发环境
      "/dev-api": {
        target: "http://192.168.12.184:30002", //后台服务地址
        changeOrigin: true,
        //重写，/api开头的替换成空字符串，即去掉接口中去掉这个字符串
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  build: {
    target: "es2015",
    outDir: "dist", // 输出路径
    assetsDir: "static/", // 生成静态资源的存放路径
    cssCodeSplit: true, // 启用/禁用 CSS 代码拆分
  },
  esbuild: {
    drop: ["console", "debugger"],
  },
});
