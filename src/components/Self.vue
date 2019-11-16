<template>
  <div class="Self-container">
    <div class="self-left" :style="{'height':containerHeight}">
      <div>
        <div class="selfTitle">
          我的歌单
          <span
            class="iconfont icon-jia"
            style="font-size:22px;float:right;margin-right:10px;cursor:pointer"
            @click="creatorSongList()"
          ></span>
        </div>
        <ul class="addList" v-if="addSongList">
          <li
            class="addItem"
            v-for="item in addSongList"
            :key="item.id"
            @click="goSongList(item.name)"
          >
            <div class="listCover">
              <img :src="item.img" alt srcset />
            </div>
            <div class="infoBox">
              <span class="listName">{{item.name}}</span>
              <div class="listSum">
                <span
                  calss="number"
                  style="margin-right:5px;"
                >{{item.tracks.length}}首 by {{item.creator}}</span>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div>
        <div class="selfTitle">网易歌单</div>
        <ul class="addList" v-if="this.importUserInfo.length">
          <li
            class="addItem"
            v-for="item in this.importUserInfo"
            :key="item.id"
            @click="goImportList(item.id)"
          >
            <div class="listCover" v-if="item">
              <img :src="item.coverImgUrl" alt srcset />
            </div>
            <div class="infoBox">
              <span class="listName">{{item.name}}</span>
              <div class="listSum">
                <span
                  calss="number"
                  style="margin-right:5px;"
                >{{item.trackCount}}首 by {{item.creator.nickname}}</span>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div class="addBtn" @click="importList()">
        <span>{{!this.importUserInfo.length ? "导入网易歌单" : "退出网易歌单"}}</span>
      </div>
    </div>
    <div class="self-right" v-if="this.importUserInfo.length || this.prevPlayList.name">
      <div :class="titleActive ? 'titleActive' : 'infoBox'">
        <div class="songListCover" v-if="prevPlayList">
          <img :src="prevPlayList.coverImgUrl" alt srcset />
        </div>
        <div class="songListInfoBox">
          <span class="songListName">{{prevPlayList.name}}</span>
          <span class="songListDescription">{{prevPlayList.description}}</span>
          <div class="songListSum" v-if="!titleActive" style="margin-left:20px;">
            <span calss="number" style="margin-right:5px;">共{{prevPlayList.trackCount}}首</span>
            <span
              calss="number"
              style="margin-right:5px;"
              v-if="prevPlayList.playCount"
            >共播放{{prevPlayList.playCount}}次</span>
          </div>
        </div>
      </div>
      <div class="songList">
        <ul>
          <li style="background-color: #e0e0e0;">
            <span class="idx"></span>
            <span class="songName">歌曲</span>
            <span class="songer">歌手</span>
            <span class="songAr">专辑</span>
          </li>
          <li
            v-for="(item, index) in prevPlayList.tracks"
            :key="index"
            :class="{bgEven :(index + 1) % 2 == 0 ? true : false}"
          >
            <span class="idx">{{index + 1}}</span>
            <span class="songName" @click="goSongDetails(item.id)">{{item.name}}</span>
            <span class="songer">{{item.ar[0].name}}</span>
            <span class="songAr">{{item.al.name}}</span>
            <div class="itemControl">
              <span class="iconfont icon-xiayishoubofang" style="cursor: pointer;" title="下一首播放"></span>
              <el-dropdown @command="handleCommand">
                <span
                  class="el-dropdown-link iconfont icon-gengduo5"
                  style="cursor: pointer;margin-top:-5px;"
                >
                  <!-- <span class="iconfont icon-gengduo5" style="cursor: pointer;margin-top:-5px;"></span> -->
                </span>
                <el-dropdown-menu
                  slot="dropdown"
                  v-for="(addSong, index) in addSongList"
                  :key="index"
                >
                  <el-dropdown-item
                    :command="{songListId:item.id, songName:addSong.name}"
                  >{{addSong.name}}</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
export default {
  data() {
    return {
      addSongList: [], // 创建的歌单
      titleActive: false,
      containerHeight: window.innerHeight - 122 + "px"
    };
  },
  computed: {
    ...mapGetters(["importUserInfo", "prevPlayList", "historyList"])
  },
  mounted() {
    this.$nextTick(() => {
      let _this = this;
      window.addEventListener("scroll", _this.handleScroll, true);
    });
  },
  created() {
    this.addSongList = JSON.parse(localStorage.getItem("addList")) || [];
  },
  methods: {
    ...mapActions([
      "setImportUserInfo",
      "setPrevPlayList",
      "setHistory",
      "setPrevPlaySong"
    ]),
    handleScroll() {
      if ($(".mainContainer").scrollTop() > 0) {
        this.titleActive = true;
      } else {
        this.titleActive = false;
      }
    },
    importList() {
      if (!this.importUserInfo.length) {
        var uid = "1581414085";
        this.$prompt("请输入网易云Uid", "提示", {
          validator(value) {
            return {
              valid: /\d+/.test(value),
              message: "请输入正确的网易云Uid"
            };
          }
        }).then(({ result, value }) => {
          if (result) {
            $.ajax({
              type: "get",
              url: "https://api.mtnhao.com/user/playlist",
              data: {
                uid: value
              },
              dataType: "json",
              success: data => {
                this.$nextTick(() => {
                  this.setImportUserInfo({ data: data.playlist });
                });
              }
            });
          } else {
            // this.$toast.message("点击了取消");
          }
        });
      } else {
        this.setImportUserInfo({ data: [] });
      }
    },
    goImportList(id) {
      $.ajax({
        type: "post",
        url: "https://api.mtnhao.com/playlist/detail",
        data: {
          id: id
        },
        dataType: "json",
        success: data => {
          this.$nextTick(() => {
            // this.importData = data.playlist;
            this.setPrevPlayList({ obj: data.playlist });
          });
        }
      });
    },
    goSongList(songListName) {
      JSON.parse(localStorage.getItem("addList")).forEach(ele => {
        if (ele.name == songListName) {
          ele.trackCount = ele.tracks.length;
          this.setPrevPlayList({ obj: ele });
        }
      });
    },
    goSongDetails(songId) {
      this.prevPlayList.tracks.forEach(ele => {
        if (ele.id == songId) {
          this.setPrevPlaySong({ obj: ele });
        }
      });
      this.$router.push({
        name: "songDetails",
        params: { songId: "wy_" + songId }
      });
    },
    creatorSongList() {
      this.$prompt("请输入歌单名称", "提示", {
        validator(value) {
          return {
            valid: value
            // message: "请输入正确的网易云Uid"
          };
        }
      }).then(({ result, value }) => {
        if (result) {
          let obj = {
            name: value,
            coverImgUrl:
              "http://p.qpic.cn/music_cover/aaxX4Babic4VicBPicJOwr5xmE7IYuBzNiaRLyfbDZHmatYE1EliaZeVD9Q/600?n=1",
            img:
              "http://p.qpic.cn/music_cover/aaxX4Babic4VicBPicJOwr5xmE7IYuBzNiaRLyfbDZHmatYE1EliaZeVD9Q/600?n=1",
            creator: "my",
            tracks: [],
            trackCount: 0
          };
          this.addSongList.push(obj);
          // this.setHistory(this.addSongList);
          localStorage.setItem("addList", JSON.stringify(this.addSongList));
        } else {
          // this.$toast.message("点击了取消");
        }
      });
    },
    // 点击添加到本地的函数
    handleCommand(command) {
      this.prevPlayList.tracks.forEach((item, n) => {
        if (command.songListId == item.id) {
          // 循环本地歌单，如果名字相同，就表示为当前要添加到的哪个歌单
          this.addSongList.forEach((ele, m) => {
            if (command.songName == ele.name) {
              ele.tracks.unshift(item);
              ele.img = ele.coverImgUrl = ele.tracks[0].al.picUrl;
              this.$toast.success("添加成功");
              localStorage.setItem("addList", JSON.stringify(this.addSongList));
            }
          });
        }
      });
      // this.$message("click on item " + command);
    }
  }
};
</script>
<style lang="scss" scoped>
.Self-container {
  .self-left {
    position: fixed;
    width: 300px;
    border-right: 1px solid #9b9b9b;
    overflow-y: auto;
    overflow-x: hidden;
    .selfTitle {
      background-color: #fff;
      position: sticky;
      top: 0px;
      font-size: 16px;
      font-weight: 700;
      padding-left: 20px;
      height: 50px;
      line-height: 50px;
      border-bottom: 1px solid #9b9b9b;
    }
    .addList {
      .addItem {
        padding-left: 20px;
        height: 60px;
        cursor: pointer;
        transition: all 0.5s ease;
        .listCover {
          img {
            width: 100%;
            height: 100%;
          }
          margin-top: 5px;
          line-height: 60px;
          width: 50px;
          height: 50px;
          background-color: rgba(0, 0, 0, 0.322);
          float: left;
        }
        .infoBox {
          margin-left: 10px;
          float: left;
          .listName {
            display: block;
            width: 200px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            line-height: 31px;
            font-size: 14px;
            font-weight: 700;
          }
          .listSum {
            font-size: 12px;
            line-height: 20px;
            color: #9b9b9b;
          }
        }
        &:hover {
          background-color: #9530a330;
          .listName {
            color: #b773c1;
          }
          .listSum {
            color: #b773c1;
          }
        }
      }
    }
    .addBtn {
      margin: 0 auto;
      display: block;
      cursor: pointer;
      width: 250px;
      text-align: center;
      line-height: 30px;
      &:hover {
        background-color: #9530a330;
        span {
          color: #9530a3;
        }
      }
      span {
        font-size: 14px;
      }
    }
  }
  .self-right {
    margin-left: 300px;
    .titleActive {
      position: fixed;
      top: 52px;
      height: 100px;
      width: 100%;
      background-color: #e6e6e6;
      opacity: 0.95;
      .songListCover {
        width: 80px;
        height: 80px;
        float: left;
        margin-left: 10px;
        img {
          margin: 10px;
          width: 100%;
          height: 100%;
        }
      }
      .songListInfoBox {
        margin: 20px 0;
        float: left;
        .songListName {
          margin-left: 20px;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: wrap;
          display: block;
          font-size: 18px;
          font-weight: 700;
          line-height: 50px;
        }
        .songListDescription {
          display: none;
        }
      }
    }
    .infoBox {
      height: 240px;
      .songListCover {
        width: 200px;
        height: 200px;
        float: left;
        line-height: 100px;
        img {
          margin: 20px;
          width: 100%;
          height: 100%;
        }
      }
      .songListInfoBox {
        margin: 20px 20px;
        float: left;
        .songListName {
          margin-left: 20px;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: wrap;
          display: block;
          font-size: 18px;
          font-weight: 700;
          line-height: 50px;
        }
        .songListDescription {
          margin-left: 20px;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: wrap;
          width: 550px;
          height: 127px;
          display: block;
          line-height: 25px;
        }
      }
    }
    .songList {
      ul {
        .bgEven {
          background-color: #f9f9f9;
        }
        li {
          height: 40px;
          width: 100%;
          &:hover {
            // background-color: #e0e0e0;
            background: -webkit-gradient(
              linear,
              0 0,
              0 bottom,
              from(#9530a330),
              to(#dedfdf)
            );
            .itemControl {
              display: inline-block;
              span {
                // color:#fff;
                font-size: 20px;
                margin-top: 5px;
                display: inline-block;
              }
            }
          }
          .idx {
            color: #6b3c71;
            line-height: 40px;
            text-align: center;
            display: inline-block;
            width: 30px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-size: 14px;
          }
          .songName {
            line-height: 40px;
            display: inline-block;
            margin-left: 20px;
            width: 250px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-size: 14px;
            cursor: pointer;
          }
          .songer {
            line-height: 40px;
            margin-left: 50px;
            display: inline-block;
            width: 180px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-size: 14px;
          }
          .songAr {
            line-height: 40px;
            display: inline-block;
            overflow: hidden;
            width: 200px;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-size: 14px;
          }
          .itemControl {
            display: none;
            float: right;
            margin-right: 20px;
            font-size: 20px;
            width: 100px;
          }
        }
      }
    }
  }
}
</style>

