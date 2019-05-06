<template>
  <div class="Self-container">
    <div class="self-left">
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
            @click="goImportList(item.id)"
          >
            <div class="listCover">
              <img :src="item.img" alt srcset>
            </div>
            <div class="infoBox">
              <span class="listName">{{item.name}}</span>
              <div class="listSum">
                <span
                  calss="number"
                  style="margin-right:5px;"
                >{{item.trackCount}}首 by {{item.creator}}</span>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div>
        <div class="selfTitle">网易歌单</div>
        <ul class="addList" v-if="this.importUserInfo">
          <li
            class="addItem"
            v-for="item in this.importUserInfo.playlist"
            :key="item.id"
            @click="goImportList(item.id)"
          >
            <div class="listCover">
              <img :src="item.coverImgUrl" alt srcset>
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
        <span>导入网易歌单</span>
      </div>
    </div>
    <div class="self-right" v-if="this.prevPlayList && this.importUserInfo">
      <div class="infoBox">
        <div class="songListCover">
          <img :src="prevPlayList.coverImgUrl" alt srcset>
        </div>
        <div class="songListInfoBox">
          <span class="songListName">{{prevPlayList.name}}</span>
          <span class="songListDescription">{{prevPlayList.description}}</span>
          <div class="songListSum">
            <span calss="number" style="margin-right:5px;">共{{prevPlayList.trackCount}}首</span>
            <span calss="number" style="margin-right:5px;">共播放{{prevPlayList.playCount}}次</span>
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
      addSongList:[], // 创建的歌单
      // importData: '',
    };
  },
  computed: {
    ...mapGetters(["importUserInfo", "prevPlayList", "historyList"])
  },
  methods: {
    ...mapActions(["setImportUserInfo", "setPrevPlayList","setHistory", "setPrevPlaySong"]),
    importList() {
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
            type: "post",
            url: "http://www.gequdaquan.net/gqss/api.php?",
            data: {
              types: "userlist",
              uid: value
            },
            dataType: "jsonp",
            success: data => {
              this.$nextTick(() => {
                this.setImportUserInfo({ data: data });
              });
            }
          });
        } else {
          // this.$toast.message("点击了取消");
        }
      });
    },
    goImportList(id) {
      $.ajax({
        type: "post",
        url: "http://www.gequdaquan.net/gqss/api.php?",
        data: {
          types: "playlist",
          id: id
        },
        dataType: "jsonp",
        success: data => {
          this.$nextTick(() => {
            // this.importData = data.playlist;
            this.setPrevPlayList({ obj: data.playlist });
          });
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
            valid: value,
            // message: "请输入正确的网易云Uid"
          };
        }
      }).then(({ result, value }) => {
        if (result) {
          let obj = {"name":value,"img":"http://p.qpic.cn/music_cover/aaxX4Babic4VicBPicJOwr5xmE7IYuBzNiaRLyfbDZHmatYE1EliaZeVD9Q/600?n=1","creator":"my","List":[],"trackCount":0,}
          this.addSongList.push(obj);
          this.setHistory(this.addSongList);
        } else {
          // this.$toast.message("点击了取消");
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.Self-container {
  .self-left {
    position: fixed;
    width: 300px;
    height: 510px;
    border-right: 1px solid #9b9b9b;
    overflow-y: auto;
    overflow-x: hidden;
    .selfTitle {
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
    .infoBox {
      // position:fixed;
      height: 240px;
      bottom: 1px solid #9b9b9b;
      .songListCover {
        margin: 20px;
        width: 200px;
        height: 200px;
        float: left;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .songListInfoBox {
        margin: 20px 0;
        float: left;
        .songListName {
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: wrap;
          display: block;
          font-size: 18px;
          font-weight: 700;
          line-height: 50px;
        }
        .songListDescription {
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
          line-height: 40px;
          &:hover {
            background-color: #e0e0e0;
          }
          .idx {
            text-align: center;
            display: inline-block;
            width: 30px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-size: 14px;
          }
          .songName {
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
            margin-left: 50px;
            display: inline-block;
            width: 180px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-size: 14px;
          }
          .songAr {
            display: inline-block;
            overflow: hidden;
            width: 200px;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-size: 14px;
          }
        }
      }
    }
  }
}
</style>

