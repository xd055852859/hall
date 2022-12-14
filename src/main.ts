import { createApp } from "vue";
import App from "./App.vue";
import { createPinia } from "pinia";
import { registerStore } from "@/store";
import router from "@/router";
// import i18n from "@/language/i18n";
import dayjs from "dayjs";
// import relativeTime from "dayjs/plugin/relativeTime";
import Cheader from "@/components/cheader.vue";
// import Cbutton from "@/components/cbutton.vue";
import Cicon from "@/components/cIcon.vue";
import ElementPlus from "element-plus";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import "./styles/common/common.scss";
import "./styles/element/common.scss";
import "element-plus/dist/index.css";
import "amfe-flexible/index.js";
const app = createApp(App);
// dayjs.extend(relativeTime);
app.provide("dayjs", dayjs);
app
  .component("cheader", Cheader)
//   .component("cbutton", Cbutton)
  .component("cicon", Cicon)
app
  .use(router)
  .use(ElementPlus, {
    locale: zhCn,
  })
  .use(createPinia())
registerStore();
app.mount("#app");