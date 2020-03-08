<template>
  <div id="app">
    <audio
      autoplay
      :src="songPlayUrl"
      :loop="loop"
      @canplay="getDuration"
      @timeupdate="updateTime"
      ref="audio"
      id="audio"
    ></audio>
    <div class="menu">
      <ul class="menu-icon-list">
        <li class="iconFontItem">
          <span class="iconfont icon-fanhui" @click="goBack()"></span>
        </li>
        <li class="iconFontItem" @click="goHome()">
          <span class="iconfont icon-zhuye"></span>
          <a herf>首页</a>
        </li>
        <li class="iconFontItem" @click="goSlef()">
          <span class="iconfont icon-gengduo"></span>
          <a herf>Slef</a>
        </li>
        <li class="iconFontItem">
          <span class="iconfont icon-yinlehe" style="font-size:27px;" @click="goMusicBox()"></span>
          <a herf>音乐盒</a>
        </li>
        <li class="iconFontItem">
          <span class="iconfont icon-FMxia-copy" style="font-size:25px;" @click="goQieFM()"></span>
          <a herf>企鹅FM</a>
        </li>
        <li class="iconFontItem">
          <span class="iconfont icon-music_active"></span>
          <a herf>历史</a>
        </li>
      </ul>
    </div>
    <div class="main">
      <div class="heades">
        <input
          type="text"
          class="input"
          placeholder="在库中搜索"
          v-model="seachValue"
          @keyup.enter="goSeach(seachValue)"
        />
        <span class="blank"></span>
        <span class="iconfont icon-sousuo1" @click="goSeach(seachValue)"></span>
      </div>
    </div>
    <div class="musicControl">
      <ul class="iconControl">
        <li class="itemControl" @click="prev()">
          <span class="iconfont icon-shangyishou"></span>
          <span class="itemBorder"></span>
        </li>
        <li class="itemControl" @click="play()">
          <span class="iconfont" :class="{'icon-bofang':!playing,'icon-zanting':playing}"></span>
          <span class="itemBorder"></span>
        </li>
        <li class="itemControl" @click="next()">
          <span class="iconfont icon-shangyishou1"></span>
          <span class="itemBorder"></span>
        </li>
        <li class="itemControl">
          <el-dropdown trigger="click" style="height:100%;width:100%">
            <span class="el-dropdown-link">
              <span class="iconfont icon-laba" style="font-size:22px;"></span>
              <span class="itemBorder"></span>
            </span>
            <el-dropdown-menu slot="dropdown">
              <mu-slider class="demo-slider" @change="changeVolume" :display-value="false" :value="volume" track-color="#9530a3" color="#9530a3"></mu-slider>              
            </el-dropdown-menu>
          </el-dropdown>
        </li>
        <li class="itemControl">
          <span
            class="iconfont"
            @click="sequence=!sequence"
            :class="sequence ? 'icon-bofangye-caozuolan-suijibofang' : 'icon-xunhuanbofang'"
          ></span>
          <!-- <span class="iconfont icon-bofangye-caozuolan-suijibofang"></span> -->
          <span class="itemBorder"></span>
        </li>
        <li class="itemControl">
          <span
            class="iconfont icon-danquxunhuan"
            @click="loop=!loop"
            :style="{color:loop ? '#fff' : '#000'}"
            style="font-size:22px;"
          ></span>
          <span
            class="itemBorder"
            :style="{backgroundColor:loop ? '#9530a3' : null,display: loop ? 'inline-block' : 'none'}"
          ></span>
        </li>
      </ul>
      <div class="musicSilder">
        <mu-slider class="demo-slider" :display-value="false" @change="changePlayTime" v-model="playTime" color="#9530a3"></mu-slider>
        <!-- <el-slider v-model="this.playTime"></el-slider> -->
      </div>
      <div class="musicBarTime">
        {{ currentTime | format }}/{{ duration % 3600 | format }}
      </div>
      <div class="minBox" v-if="this.prevPlaySong.al" @click="goShowSonging()">
        <div class="minImg">
          <img
            :src="(this.prevPlaySong.al.picUrl).slice(0,5) == 'https' ? this.prevPlaySong.al.picUrl : this.prevPlaySong.al.picUrl.replace('http','https')"
            alt
            srcset
          />
        </div>
        <div class="infoBox">
          <span class="prevsonger">{{this.prevPlaySong.name}}</span>
          <span class="prevName">{{this.prevPlaySong.ar[0].name}}</span>
        </div>
      </div>
    </div>
    <div
      class="mainContainer"
      ref="main"
    >
      <!-- <keep-alive> -->
      <router-view></router-view>
      <!-- </keep-alive> -->
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
// 导入jquery
import $ from "jquery";

export default {
  name: "App",
  data() {
    return {
      sequence: false, // 是否乱序播放
      loop: false, // 是否循环
      alert1: false,
      seachValue: "",
      duration: 0,
      currentTime1: 0,
      // playTime1: 0,
      lyric: [],
      value: 0,
      volume:0.4,
      playing: null,
      // containerWidth: document.body.clientWidth - 70 + "px",
      // containerHeight: window.innerHeight - 122 + "px"
    };
  },
  computed: {
    ...mapGetters([
      "songPlayUrl",
      "currentTime",
      "prevPlaySong",
      "prevPlayList",
      "historyList"
    ]),
    playTime: function() {
      return parseInt(this.currentTime * (100 / this.duration)); //将当前时间转换为进度条显示
    }
    // containerWidth: function(){
    //   return `width:${document.body.clientWidth-70} + px`
    // }
  },
  filters:{
    // 时间格式化
    format(value){
      let minute = Math.floor(value / 60) +"";
      let second = Math.floor(value % 60) +"";
      return `${minute.padStart(2,0)}:${second.padStart(2,0)}`
    }
  },
  created() {
    // 设置audio元素
    this.$nextTick(() => {
      this.setAudioEle({ url: this.$refs.audio });
    });
  },

  methods: {
    ...mapActions([
      "setAudioEle",
      "setCurrentTime",
      "setSongPlayUrl",
      "setPrevPlaySong",
      "setSongPlayLrc",
      "setHistory"
    ]),
    changePlayTime(val){
      console.log(val);
    },
    // 去首页
    goHome() {
      this.$router.push({ name: "homePage" });
    },
    // 返回
    goBack() {
      this.$router.go(-1);
    },
    // 去自己的页面
    goSlef() {
      this.$router.push({ name: "self" });
    },
    // 去音乐盒
    goMusicBox() {
      this.$router.push({ name: "musicBox" });
    },
    // 去企鹅FM
    goQieFM() {
      this.$router.push({ name: "qieFM" });
    },
    // 获取当前播放的时间
    updateTime(e) {
      this.setCurrentTime({ data: e.target.currentTime }); //获取audio当前播放时间
    },
    // 获取总时长
    getDuration() {
      // console.log(this.$refs.audio.duration); //此时可以获取到duration
      this.duration = this.$refs.audio.duration; // 总共时长
    },
    // 去到歌词的页面
    goShowSonging() {
      this.$router.push({ name: "showSonging" });
    },
    // 搜索
    goSeach(seachValue) {
      seachValue
        ? this.$router.push({ name: "seach", params: { seachValue } })
        : null;
    },
    // 点击播放
    play() {
      var audio = this.$refs.audio;
      this.playing = audio.paused; // 播放器的状态
      this.playing ? audio.play() : audio.pause();
    },
    // 上一首
    prev() {
      if (this.songPlayUrl.indexOf("ws.stream.fm.qq.com") == -1) {
        var prevPlayId = this.prevPlaySong.id;
        this.prevPlayList.tracks.forEach((item, index) => {
          if (prevPlayId == item.id) {
            var ele = index <= 0 ? item : this.prevPlayList.tracks[index - 1];
            // this.setPrevPlaySong({ obj: ele });
            $.ajax({
              type: "get",
              url: "https://api.mtnhao.com/song/detail?ids=" + ele.id,
              dataType: "json",
              success: data => {
                // 注意使用 this.$nextTick(()=>{} 异步加载数据的时候 回调函数只能用箭头函数，不然会改变 this
                this.$nextTick(() => {
                  this.setPrevPlaySong({obj:data.songs[0]})
                });
              },
            });
            $.ajax({
              type: "get",
              url: "https://api.imjad.cn/cloudmusic/?type=song&id=" + ele.id,
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
                id: ele.id
              },
              dataType: "json",
              success: dataRic => {
                // 注意使用 this.$nextTick(()=>{} 异步加载数据的时候 回调函数只能用箭头函数，不然会改变 this
                this.$nextTick(() => {
                  // var lyric = parseLyric(dataRic.lyric);
                  this.setSongPlayLrc({ lrc: dataRic.lrc.lyric || {}});
                  // console.log(parseLyric(dataRic.lyric))
                });
              },
            });
          }
        });
      } else {
        // 正则匹配出企鹅FM的播放链接id
        var reg = new RegExp(/R196(\w+).m4a/g);
        var Mid = reg.exec(this.songPlayUrl);
        // console.log(Mid)
        var prevPlayList = [];
        for (let item in this.prevPlayList.showList) {
          prevPlayList.push(this.prevPlayList.showList[item]);
        }
        prevPlayList.forEach((ele, nI) => {
          if (ele.show.strMid == Mid[1]) {
            var nextUrlMid =
              nI != 0
                ? prevPlayList[nI - 1].show.strMid
                : prevPlayList[nI].show.strMid;
            this.setSongPlayUrl({
              url: `http://ws.stream.fm.qq.com/vfm.tc.qq.com/R196${nextUrlMid}.m4a?fromtag=36&vkey=98837D0874E15B38FB695D0A78FF157379BCD2F8515C42A2E57B9E9B58C78C58C8093F96E2A9A6AA66D273AB647D42FBAF2BF882425C245B&guid=10000`
            });
          }
        });
      }
    },
    // 下一首
    next() {
      if (this.songPlayUrl.indexOf("ws.stream.fm.qq.com") == -1) {
        var prevPlayId = this.prevPlaySong.id;
        if (this.prevPlayList.tracks.length) {
          this.prevPlayList.tracks.forEach((item, index) => {
            if (prevPlayId == item.id) {
              var ele =
                index >= this.prevPlayList.tracks.length - 1
                  ? item
                  : this.prevPlayList.tracks[index + 1];
              // this.setPrevPlaySong({ obj: ele }); // 改变当前播放的歌曲信息
              // console.log(this.prevPlayList.tracks[index + 1]);
              $.ajax({
                type: "get",
                url: "https://api.mtnhao.com/song/detail?ids=" + ele.id,
                dataType: "json",
                success: data => {
                  // 注意使用 this.$nextTick(()=>{} 异步加载数据的时候 回调函数只能用箭头函数，不然会改变 this
                  this.$nextTick(() => {
                    this.setPrevPlaySong({obj:data.songs[0]})
                  });
                },
              });
              $.ajax({
                type: "get",
                url: "https://api.imjad.cn/cloudmusic/?type=song&id=" + ele.id,
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
                  id: ele.id
                },
                dataType: "json",
                success: dataRic => {
                  // 注意使用 this.$nextTick(()=>{} 异步加载数据的时候 回调函数只能用箭头函数，不然会改变 this
                  this.$nextTick(() => {
                    // var lyric = parseLyric(dataRic.lyric);
                    this.setSongPlayLrc({ lrc: dataRic.lrc.lyric || {}});
                    // console.log(parseLyric(dataRic.lyric))
                  });
                },
              });
            }
          });
        }
      } else {
        // 正则匹配出企鹅FM的播放链接id
        var reg = new RegExp(/R196(\w+).m4a/g);
        var Mid = reg.exec(this.songPlayUrl);
        // console.log(Mid)
        var prevPlayList = [];
        for (let item in this.prevPlayList.showList) {
          prevPlayList.push(this.prevPlayList.showList[item]);
        }
        prevPlayList.forEach((ele, nI) => {
          if (ele.show.strMid == Mid[1]) {
            var nextUrlMid =
              nI != prevPlayList.length
                ? prevPlayList[nI + 1].show.strMid
                : prevPlayList[nI].show.strMid;
            this.setSongPlayUrl({
              url: `http://ws.stream.fm.qq.com/vfm.tc.qq.com/R196${nextUrlMid}.m4a?fromtag=36&vkey=98837D0874E15B38FB695D0A78FF157379BCD2F8515C42A2E57B9E9B58C78C58C8093F96E2A9A6AA66D273AB647D42FBAF2BF882425C245B&guid=10000`
            });
          }
        });
      }
    },
    // 按键事件
    initKeyDown() {
      document.onkeydown = e => {
        switch (e.ctrlKey && e.keyCode) {
          // case 13: // 回车
          //   this.$refs.input.focus(function() {
          //     console.log("adfgdsf");
          //     this.goSeach(this.seachValue);
          //   });
          //   break;
          case 32: // 播放暂停Ctrl + Space
            this.play();
            break;
          case 37: // 上一曲Ctrl + Left
            this.prev();
            break;
          case 38: // 音量加Ctrl + Up
            let plus = Number((this.volume += 0.1).toFixed(1));
            if (plus > 1) {
              plus = 1;
            }
            this.volumeChange(plus);
            break;
          case 39: // 下一曲Ctrl + Right
            this.next();
            break;
          case 40: // 音量减Ctrl + Down
            let reduce = Number((this.volume -= 0.1).toFixed(1));
            if (reduce < 0) {
              reduce = 0;
            }
            this.volumeChange(reduce);
            break;
          case 79: // 切换播放模式Ctrl + O
            this.modeChange();
            break;
        }
      };
    },
    changeVolume(value){
      console.log(value);
      // this.$refs.audio.volume = this.volume;
    }
  },
  mounted() {
    this.$refs.audio.volume = 0.4;
    // 自动播放下一首
    this.$refs.audio.onended = () => {
      !this.loop ? this.next() : null;
    };
    // 音乐播放出错
    this.$refs.audio.onerror = () => {
      this.prevPlayList
        ? this.$toast.error("暂时无法播放，已自动播放下一首")
        : null;
      this.next();
      // console.log('播放出错啦！')
    };
    // 开始播放音乐
    this.$refs.audio.onplay = () => {
      this.playing = true;
    };
    // 初始化按键事件
    this.$nextTick(() => {
      this.initKeyDown();
    });
    // 将能播放的音乐加入播放历史
    this.$refs.audio.oncanplay = () => {
      if (
        this.historyList.length === 0 ||
        this.prevPlaySong.id !== this.historyList[0].id
      ) {
        this.setHistory(this.prevPlaySong);
      }
    };
  },
  watch: {
    // currentSong() {
    //   //监听正在播放的歌曲改变
    //   this.$nextTick(() => {
    //     this.$refs.audio.play();
    //     console.log(this.$refs.audio.currentTime); //此时duration为NaN
    //   });
    // }
  }
};
</script>

<style lang="scss" scoped>
#app {
  // width: 100%;
  // height: 100%;
  // background-color: #efefef;
  // position: relative;
  overflow: hidden;
  .menu {
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    width: 100px;
    background: -webkit-gradient(
      linear,
      0 0,
      0 bottom,
      from(#9530a330),
      to(#dedfdf)
    );

    // background-color: #dedfdf;
    // filter: blur(5px);
    .menu-icon-list {
      height: 100%;
      width: 70px;
      .iconFontItem {
        padding: 10px 0px;
        text-align: center;
        transition: all 0.5s ease;
        cursor: pointer;
        &:hover {
          background-color: #9530a3;
          .iconfont {
            color: #fff;
          }
          a {
            color: #fff;
          }
        }
        .iconfont {
          display: block;
          width: 100%;
          font-size: 30px;
        }
        a {
          font-size: 12px;
          color: #000;
        }
      }
    }
  }
  .main {
    // position: relative;
    .heades {
      margin-top: 10px;
      position: absolute;
      text-align: center;
      left: 550px;
      width: 600px;
      .input {
        background-color: #fafafa;
        position: absolute;
        left: 10px;
        padding-left: 20px;
        width: 320px;
        color: #b6b6b9;
        // background-color: #eae8e7;
        height: 30px;
        margin: 0 auto;
        font-size: 16px;
        outline: none;
        outline-color: invert;
        outline-style: none;
        outline-width: 0px;
        border: none;
        border-style: none;
        text-shadow: none;
        -webkit-appearance: none;
        -webkit-user-select: text;
        outline-color: transparent;
        box-shadow: none;
      }
      .blank {
        position: absolute;
        width: 320px;
        height: 1px;
        top: 30px;
        left: 10px;
        border-bottom: 1px solid #abacaf;
      }
      .icon-sousuo1 {
        position: absolute;
        right: 280px;
        font-size: 25px;
        color: #434343;
        cursor: pointer;
      }
    }
  }
  .musicControl {
    position: absolute;
    bottom: 0px;
    height: 70px;
    .iconControl {
      line-height: 70px;
      margin-left: 120px;
      .itemControl {
        position: relative;
        float: left;
        line-height: 50px;
        text-align: center;
        bottom: 0px;
        width: 50px;
        height: 50px;
        margin-top: 10px;
        margin-left: 10px;
        cursor: pointer;
        transition: all 0.5s ease;
        &:hover {
          .itemBorder {
            display: inline-block;
          }
          .iconfont {
            color: #9530a3;
          }
        }
        .iconfont {
          position: absolute;
          top: 0;
          left: 15px;
          z-index: 99;
          text-align: center;
          line-height: 50px;
          font-size: 25px;
        }
        .itemBorder {
          position: absolute;
          top: 2px;
          left: 3px;
          display: none;
          border: 1px solid #7b7b7d;
          background-color: #e6e6e6;
          width: 45px;
          height: 45px;
          border-radius: 35px;
        }
      }
    }
    .musicSilder {
      position: relative;
      top: -38px;
      left: 500px;
      width: 430px;
      height: 40px;
    }
    .musicBarTime{
      position: relative;
      top: -38px;
      left: 950px;
      height: 40px;
    }
    .minBox {
      cursor: pointer;
      &:hover {
        background-color: #9530a330;
      }
      position: absolute;
      right: -850px;
      bottom: 1px;
      width: 270px;
      height: 70px;
      .minImg {
        margin-left: 5px;
        margin-top: 5px;
        float: left;
        width: 60px;
        height: 60px;
        line-height: 70px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .infoBox {
        float: left;
        .prevsonger,
        .prevName {
          margin-top: 10px;
          display: block;
          margin-left: 10px;
          width: 180px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .prevsonger {
          font-size: 16px;
          font-weight: 700;
        }
      }
    }
  }
  // 弹框动画
  .mu-scale-transition-enter-active,
  .mu-scale-transition-leave-active {
    transition: transform 0.45s cubic-bezier(0.23, 1, 0.32, 1),
      opacity 0.45s cubic-bezier(0.23, 1, 0.32, 1);
    backface-visibility: hidden;
  }

  .mu-scale-transition-enter,
  .mu-scale-transition-leave-active {
    transform: scale(0);
    opacity: 0;
  }
  .mainContainer {
    overflow-y: auto;
    overflow-x: hidden;
    position: absolute;
    top: 52px;
    left: 70px;
    background-color: #fff;
    width: calc(100% - 70px);
    height: calc(100% - 122px);
    // box-shadow: 0 0 5px 5px rgba(0, 0, 0, 0.3);
    box-shadow: -5px 3px 13px rgba(0, 0, 0, 0.2);
  }
}
</style>
