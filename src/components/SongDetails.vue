<template>
  <div class="songDetails-container">
    <div
      class="bg"
      v-if="this.prevPlaySong"
      :style="{'backgroundImage': 'url(' + this.prevPlaySong.al.picUrl.replace('http','https') + ')','height':containerHeight}"
    ></div>
    <div class="mark" :style="{'width':containerWidth,'height':containerHeight}"></div>
    <div class="songInfo">
      <div class="songImg" v-if="this.prevPlaySong">
        <img :src="this.prevPlaySong.al.picUrl.replace('http','https')" alt srcset />
      </div>
      <div class="songItem">
        <span class="songer">{{this.prevPlaySong.ar[0].name}}</span>
        <span class="song">{{this.prevPlaySong.name}}</span>
        <span class="songar">{{this.prevPlaySong.al.name}}</span>
      </div>
    </div>
    <div class="ricBox" ref="musicLyric">
      <div class="songRicBox" :style="lyricTop">
        <ul v-if="!noLyric">
          <!-- <li style="margin-top:50px;height:20px"></li> -->
          <li class="ricItem" v-for="(item, index) in this.songPlayLrc" :key="index">
            <span class="ricText" :class="{active:lyricIndex == index ? true:false}">{{item.clause}}</span>
          </li>
        </ul>
        <span
          style="text-align:center;font-size:16px;line-height:400px;color:#9530a3"
          v-if="noLyric"
        >暂无歌词！</span>
      </div>
      <!-- <canvas
        id="canvas"
        ref="canvas"
        width="800"
        height="600"
      >Your browser does not support Canvas tag.</canvas>-->
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";

export default {
  data() {
    return {
      // songInfo: "",
      // lyric: [],
      value: 0, // 前面五条歌词先不滚动
      lyricIndex: 0, // 当前歌词的索引
      noLyric: false,
      top: 0, // 歌词居中
      containerWidth: document.body.clientWidth - 70 + "px",
      containerHeight: window.innerHeight - 122 + "px"
    };
  },
  computed: {
    ...mapGetters([
      "currentTime",
      "prevPlayList",
      "prevPlaySong",
      "songPlayLrc",
      "audioEle"
    ]),
    // lyricTop () {
    //   return `transform :translate3d(0, ${-35 *
    //     this.value}px, 0)`
    // },
    currentTime1() {
      return parseInt(this.currentTime);
    },
    lyricTop() {
      // return `top: ${-35 * (this.value - 3)}px`;
      return `transform :translate3d(0, ${-35 *
        (this.lyricIndex - this.top)}px, 0)`;
    }
  },
  created() {
    // 利用下划线前面的标示，判断是网易云还是qq等等，后面接的数字就为当前的ID
    let re = /[_]/.test(this.$route.params.songId);
    if (re) {
      let type = this.$route.params.songId.split("_")[0];
      this.$route.params.songId = this.$route.params.songId.split("_")[1];
      switch (type) {
        case "wy":
          $.ajax({
            type: "get",
            url:
              "https://api.imjad.cn/cloudmusic/?type=song&id=" +
              this.$route.params.songId,
            ContentType: "application/x-www-form-urlencoded",
            dataType: "json",
            success: jsData => {
              // 注意使用 this.$nextTick(()=>{} 异步加载数据的时候 success回调函数只能用箭头函数，不然会改变 this
              this.$nextTick(() => {
                this.setSongPlayUrl({ url: jsData.data[0].url });
              });
            }
          });
          $.ajax({
            type: "get",
            url: "https://api.mtnhao.com/lyric",
            data: {
              id: this.$route.params.songId
            },
            dataType: "json",
            success: dataRic => {
              // 注意使用 this.$nextTick(()=>{} 异步加载数据的时候 回调函数只能用箭头函数，不然会改变 this
              this.$nextTick(() => {
                // var lyric = parseLyric(dataRic.lyric);
                this.setSongPlayLrc({ lrc: dataRic.lrc.lyric });
                // console.log(parseLyric(dataRic.lyric))
              });
            },
            error: error => {
              this.$nextTick(() => {
                this.noLyric = true;
              });
            }
          });
          break;
        case "qq":
          this.$nextTick(() => {
            this.setSongPlayUrl({
              url: `https://v1.itooi.cn/tencent/url?id=${this.$route.params.songId}&quality=128`
            });
            this.setSongPlayLrc({
              lrc: `https://v1.itooi.cn/tencent/lrc?id=${this.$route.params.songId}`
            });
          });
          break;

        default:
          break;
      }
    }

    // 歌词
    //  $.ajax({
    //   type: "get",
    //   url: "https://api.imjad.cn/cloudmusic/?type=lyric&id=" + this.$route.params.songId,
    //   ContentType: "application/x-www-form-urlencoded",
    //   dataType: "json",
    //   success: dataRic => {
    //     // 注意使用 this.$nextTick(()=>{} 异步加载数据的时候 success回调函数只能用箭头函数，不然会改变 this
    //     this.$nextTick(() => {
    //         this.lyric = parseLyric(dataRic.lyric);
    //         console.log(dataRic);
    //     });
    //   }
    // });
    // 获取当前歌曲的歌曲链接、歌词
    // $.ajax({
    //   type: "get",
    //   url: "http://www.gequdaquan.net/gqss/api.php",
    //   data: {
    //     types: "url",
    //     id: this.$route.params.songId,
    //     source: "netease"
    //   },
    //   dataType: "jsonp",
    //   success: dataUrl => {
    //     // 注意使用 this.$nextTick(()=>{} 异步加载数据的时候 success回调函数只能用箭头函数，不然会改变 this
    //     this.$nextTick(() => {
    //       this.setSongPlayUrl({ url: dataUrl.url }); // 改变歌曲链接
    //       // console.log(dataUrl.url)
    //     });
    //   }
    // });
  },
  mounted() {
    window.addEventListener("resize", () => {
      clearTimeout(this.resizeTimer);
      this.resizeTimer = setTimeout(() => this.clacTop(), 60);
    });
    this.$nextTick(() => this.clacTop());
  },

  methods: {
    ...mapActions(["setSongPlayUrl", "setPrevPlaySong", "setSongPlayLrc"]),
    // 计算歌词居中的 top值
    clacTop() {
      if (this.$refs.musicLyric) {
        let height = this.$refs.musicLyric.offsetHeight;
        this.top = Math.floor(height / 35 / 2);
      }
    }
  },
  watch: {
    currentTime(val, oldval) {
      if (this.songPlayLrc.length) {
        for (let index = 0; index < this.songPlayLrc.length; index++) {
          const element = this.songPlayLrc[index];
          // var css = element.times < parseInt(val) < this.songPlayLrc[index+1].times ? true : false;
          if (
            element.times <= parseInt(val) &&
            parseInt(val) <= this.songPlayLrc[index + 1].times
          ) {
            this.value = index >= 4 ? index : 0;
            this.lyricIndex = index;
          }
        }
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.songDetails-container {
  overflow: hidden;
  width: 100%;
  height: 100%;
  .bg {
    width: 100%;
    height: 100%;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    filter: blur(12px);
    opacity: 0.7;
    position: fixed;
  }
  .mark {
    background-color: #000;
    opacity: 0.5;
    position: fixed;
    z-index: 2;
  }
  .songInfo {
    position: relative;
    left: 50px;
    z-index: 10;
    .songImg {
      img {
        width: 300px;
        height: 300px;
        margin-top: 50px;
      }
    }
    .songItem {
      .song,
      .songer,
      .songar {
        display: block;
        width: 300px;
        font-size: 14px;
        line-height: 30px;
        color: #fff;
      }
      .song {
        font-weight: 700;
        font-size: 20px;
      }
    }
  }
  .ricBox {
    z-index: 10;
    overflow: hidden;
    position: relative;
    right: 150px;
    float: right;
    height: 400px;
    top: -390px;
    width: 400px;
    .songRicBox {
      transition: all 0.5s ease;
      position: absolute;
      top: 0;
      left: 0;
      width: 400px;
      // height: 400px;
      .ricItem {
        line-height: 35px;
        text-align: center;
      }
      .ricText {
        color: #aeafaa;
        font-size: 16px;
        font-family: "Mircosoft YaHei";
      }
      // 当前歌词样式
      .active {
        color: #fff;
      }
    }
  }
}
</style>

