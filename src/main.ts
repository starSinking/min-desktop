import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { store } from "@/render/store";
import router from "@/render/router/index"; //引入路由

const app = createApp(App);
app.use(router);
app.use(store);
app.mount("#app");
