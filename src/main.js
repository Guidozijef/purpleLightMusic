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


// import "./listen1-api.js";
// const listen1Api = require("./listen1-api.min.js");

//引入这个懒加载插件
import VueLazyload from 'vue-lazyload'; 

// Vue.use(VueLazyload);
// 或者提娜佳配置项
Vue.use(VueLazyload, {
  preLoad: 1.3,
  // error: 'dist/error.png',
  loading: './assets/images/loading.gif',
  attempt: 1,
  // the default is ['scroll', 'wheel', 'mousewheel', 'resize', 'animationend', 'transitionend']
  listenEvents: [ 'scroll' ]
})

import { Carousel, CarouselItem, Backtop, Dropdown, DropdownItem, DropdownMenu } from 'element-ui';
Vue.component(Carousel.name, Carousel);
Vue.component(CarouselItem.name, CarouselItem);
Vue.component(Backtop.name, Backtop);
Vue.component(Dropdown.name, Dropdown);
Vue.component(DropdownItem.name, DropdownItem);
Vue.component(DropdownMenu.name, DropdownMenu);

import infiniteScroll from 'vue-infinite-scroll'
Vue.use(infiniteScroll)

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


console.info("本播放器由Gavin zijef根据极光音乐改编创作\n全是利用网上的开源api作为数据来源，本软件不作为破解音乐软件，也不提供下载功能，如有侵权请联系作者\n也希望你有好的建议和想法反馈\n作者QQ：913497146，微信：913497146zjf，网易云：1581414085");