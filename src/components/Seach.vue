<template>
  <div class="Self-container">
    <div class="self-left" :style="{'height':containerHeight}">
      <div class="seachType">
        <div class="wangyiyun">
          <mu-radio v-model="type" value="wy"></mu-radio>
          <div class="img">
            <img src="../assets/images/网易云音乐.png" alt srcset />
          </div>
          <span class="name">网易云</span>
        </div>
        <div class="wangyiyun">
          <mu-radio v-model="type" value="qq"></mu-radio>
          <div class="img">
            <img src="../assets/images/QQ音乐.png" alt srcset />
          </div>
          <span class="name">QQ音乐</span>
        </div>
        <div class="wangyiyun">
          <mu-radio v-model="type" value="kg"></mu-radio>
          <div class="img">
            <img src="../assets/images/酷狗.png" alt srcset />
          </div>
          <span class="name">酷狗音乐</span>
        </div>
        <div class="wangyiyun">
          <mu-radio v-model="type" value="kw"></mu-radio>
          <div class="img">
            <img src="../assets/images/酷我.png" alt srcset />
          </div>
          <span class="name">酷我音乐</span>
        </div>
        <div class="wangyiyun">
          <mu-radio v-model="type" value="bd"></mu-radio>
          <div class="img">
            <img src="../assets/images/百度音乐.png" alt srcset />
          </div>
          <span class="name">百度音乐</span>
        </div>
        <div class="wangyiyun">
          <mu-radio v-model="type" value="xm"></mu-radio>
          <div class="img">
            <img src="../assets/images/虾米音乐.png" alt srcset />
          </div>
          <span class="name">虾米音乐</span>
        </div>
      </div>
    </div>
    <div class="self-right" v-if="seachData">
      <div class="songList">
        <ul>
          <li style="background-color: #e0e0e0;">
            <span class="idx"></span>
            <span class="songName">歌曲</span>
            <span class="songer">歌手</span>
            <span class="songAr">专辑</span>
          </li>
          <li
            v-for="(item, index) in seachData"
            :key="index"
            :class="{bgEven :(index + 1) % 2 == 0 ? true : false}"
          >
            <span class="idx">{{index + 1}}</span>
            <span class="songName" @click="goSongDetails(item.id)">{{item.name}}</span>
            <span class="songer">
              {{item.artists.length && item.artists.length == 2
              ? item.artists[0].name + "/" + item.artists[1].name
              : item.artists[0].name}}
            </span>
            <span class="songAr">{{item.album.name}}</span>
            <div class="itemControl">
              <span class="iconfont icon-xiayishoubofang" style="cursor: pointer;" title="下一首播放"></span>
              <el-dropdown @command="handleCommand" trigger="click">
                <span
                  class="el-dropdown-link iconfont icon-gengduo5"
                  style="cursor: pointer;margin-top:-5px;"
                  title="添加到本地歌单"
                >
                  <!-- <span class="iconfont icon-gengduo5" style="cursor: pointer;margin-top:-5px;"></span> -->
                </span>
                <el-dropdown-menu
                  slot="dropdown"
                  v-for="(addSong, index) in addSongList"
                  :key="index"
                >
                  <el-dropdown-item
                    :command="{songListId:item.id, songListName:addSong.name}"
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
      seachData: "",
      type: "wy",
      containerHeight: window.innerHeight - 122 + "px",
      addSongList: []
    };
  },
  computed: {
    ...mapGetters(["prevPlayList"])
  },
  created() {
    this.addSongList = JSON.parse(localStorage.getItem("addList"));
    $.ajax({
      type: "get",
      url: "https://api.mtnhao.com/search",
      data: {
        offset: 0,
        limit: 30,
        keywords: this.$route.params.seachValue
      },
      dataType: "json",
      success: data => {
        this.$nextTick(() => {
          this.seachData = data.result.songs;
          // this.setPrevPlayList({obj: });
          // console.log(data)
        });
      }
    });
  },
  methods: {
    ...mapActions(["setPrevPlaySong", "setPrevPlayList"]),
    goSongDetails(songId) {
      // this.seachData.forEach(item => {
      //   if (item.id == songId) {
      //     let obj = {
      //       al: { picUrl: item.artists[0].img1v1Url, name: item.album.name },
      //       ar: [
      //         {
      //           name:
      //             item.artists.length && item.artists.length == 2
      //               ? item.artists[0].name + "/" + item.artists[1].name
      //               : item.artists[0].name
      //         }
      //       ],
      //       name: item.name
      //     };
      //     this.setPrevPlaySong({ obj: obj });
      //   }
      // });
      this.$router.push({
        name: "songDetails",
        params: { songId: this.type + "_" + songId }
      });
    },
    // 点击添加到本地的函数
    handleCommand(command) {
      this.prevPlayList.tracks.forEach((item, n) => {
        if (command.songListId == item.id) {
          // 循环本地歌单，如果名字相同，就表示为当前要添加到的哪个歌单
          this.addSongList.forEach((ele, m) => {
            if (command.songListName == ele.name) {
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
  },
  watch: {
    type: function(val, old) {
      if (val == "wy") {
        $.ajax({
          type: "get",
          url: "https://api.mtnhao.com/search",
          data: {
            offset: 0,
            limit: 30,
            keywords: this.$route.params.seachValue
          },
          dataType: "json",
          success: data => {
            this.$nextTick(() => {
              this.seachData = data.result.songs;
              let seachObj = {
                coverImgUrl: resultData.data.songs[0].al.picUrl,
                creator: "",
                img: resultData.data.songs[0].al.picUrl,
                name: this.$route.params.seachValue,
                trackCount: resultData.data.songs.length
              };
              seachObj.tracks = resultData.data.songs;
              this.setPrevPlayList({ obj: seachObj });
            });
          }
        });
        $.ajax({
          type: "get",
          url: `https://v1.itooi.cn/netease/search?keyword=${this.$route.params.seachValue}&type=song&pageSize=20&page=0`,
          dataType: "json",
          success: resultData => {
            this.$nextTick(() => {
              this.seachData = resultData.data.songs;
              let seachObj = {
                coverImgUrl: resultData.data.songs[0].al.picUrl,
                creator: "",
                img: resultData.data.songs[0].al.picUrl,
                name: this.$route.params.seachValue,
                trackCount: resultData.data.songs.length
              };
              seachObj.tracks = resultData.data.songs;
              this.setPrevPlayList({ obj: seachObj });
              // console.log(data);
            });
          }
        });
      } else if (val == "qq") {
        $.ajax({
          type: "get",
          url: `https://v1.itooi.cn/tencent/search?keyword=${this.$route.params.seachValue}&type=song&pageSize=30&page=0`,
          dataType: "json",
          success: resultData => {
            this.$nextTick(() => {
              // console.log(data);
              // 将QQ音乐的数据转化为网易云一样的结构，方便后面的解析
              let praseData = [];
              resultData.data.list.forEach((item, index) => {
                let obj = {};
                obj = item;
                obj.name = item.songname;
                obj.id = item.songmid;
                obj.ar = item.singer;
                obj.al = {
                  name: item.albumname,
                  picUrl: `https://v1.itooi.cn/tencent/pic?id=${item.songmid}`
                };
                // obj.ar[0].name = item.singer;
                // obj.al.name = item.name;
                // obj.al.picUrl = item.pic;
                praseData.push(obj);
              });
              this.seachData = praseData;
            });
          }
        });
      }
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
    .seachType {
      .wangyiyun {
        margin-left: 20px;
        height: 50px;
        .mu-radio-wrapper {
          line-height: 50px !important;
        }
        .mu-radio-checked {
          color: #9530a3 !important;
        }
        .mu-radio {
          top: 5px !important;
        }
        .img {
          display: inline-block;
          width: 25px;
          height: 25px;
          position: relative;
          img {
            position: absolute;
            top: 6px;
            width: 25px;
            height: 25px;
            line-height: 50px;
            display: inline-block;
          }
        }
        .name {
          line-height: 50px;
          font-size: 20px;
        }
      }
    }
  }
  .self-right {
    margin-left: 300px;
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
                display: inline-block;
              }
            }
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
          .itemControl {
            display: none;
            float: right;
            margin-right: 20px;
            font-size: 20px;
            width: 50px;
          }
        }
      }
    }
  }
}
</style>

