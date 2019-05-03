// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";
import store from "./store";

import router from "./router/router";
import "./assets/css/defined.scss";
// import "./assets/iconFont/iconfont";
import "./assets/iconFont/iconfont.css";

Vue.config.productionTip = false;


import "./listen1-api.js";
// const listen1Api = require("./listen1-api.min.js");




// 导入muse-ui
import MuseUI from "muse-ui";
import "muse-ui/dist/muse-ui.css";
import 'muse-ui-message/dist/muse-ui-message.css';
// 提示消息
import Toast from 'muse-ui-toast';
Vue.use(Toast);
Toast.config(
{
    position: 'top',               // 弹出的位置
    time: 2000,                       // 显示的时长
    closeIcon: 'close',               // 关闭的图标
    close: true,                      // 是否显示关闭按钮
    successIcon: 'check_circle',      // 成功信息图标
    infoIcon: 'info',                 // 信息信息图标
    warningIcon: 'priority_high',     // 提醒信息图标
    errorIcon: 'warning',             // 错误信息图标      
  },
);
// 弹框
import Message from 'muse-ui-message';
Vue.use(Message);


Vue.use(MuseUI);
// 自定义muse-ui的样式
import theme from "muse-ui/lib/theme";
theme.add(
  "teal",
  {
    primary: "#9530a3",
    secondary: "#9530a330",
    success: "#4caf50",
    warning: "#ffeb3b"
  },
  "light"
);

theme.use("teal");

/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  components: { App },
  template: "<App/>",
  store // 挂载 store 状态管理器
});
