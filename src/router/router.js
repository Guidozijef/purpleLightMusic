import Vue from "vue";
import Router from "vue-router";
import HomePage from "../components/HomePage.vue";
import SongListDetails from "../components/SongListDetails.vue";
import SongDetails from "../components/SongDetails.vue";
import Self from "../components/Self.vue";
import MusicBox from "../components/MusicBox.vue";
import Seach from "../components/Seach.vue";

Vue.use(Router);

export default new Router({
  routes: [
    { path: '/', redirect: '/homePage' },
    {
      path: "/homePage",
      name: "homePage",
      component: HomePage,
      meta: {
        keepAlive: false // true 表示需要使用缓存 false表示不需要被缓存
      }
    },
    {
      path: "/songListDetails/:id",
      name: "songListDetails",
      component: SongListDetails,
      meta: {
        keepAlive: false // true 表示需要使用缓存 false表示不需要被缓存
      }
    },
    {
      path: "/songListDetails/songDetails/:songId",
      name: "songDetails",
      component: SongDetails,
      meta: {
        keepAlive: true // true 表示需要使用缓存 false表示不需要被缓存
      }
    },
    {
      path: "/songListDetails/songDetails/showSonging",
      name: "showSonging",
      component: SongDetails,
      meta: {
        keepAlive: false // true 表示需要使用缓存 false表示不需要被缓存
      }
    },
    {
      path: "/self",
      name: "self",
      component: Self,
      meta: {
        keepAlive: false // true 表示需要使用缓存 false表示不需要被缓存
      }
    },
    {
      path: "/musicBox",
      name: "musicBox",
      component: MusicBox,
      meta: {
        keepAlive: false // true 表示需要使用缓存 false表示不需要被缓存
      }
    },
    {
      path: "/seach/:seachValue",
      name: "seach",
      component: Seach,
      meta: {
        keepAlive: false // true 表示需要使用缓存 false表示不需要被缓存
      }
    }
  ]
});
