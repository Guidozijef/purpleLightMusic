<template>
  <div class="homePage-container">
    <div class="leftImgBox" :style="{'height':containerHeight}">
      <div class="img">
        <img :src="(prevPlayList.coverImgUrl).replace('http','https')" alt srcset>
      </div>
      <span class="detailsName">{{prevPlayList.name}}</span>
      <span
        class="detailsTag"
      >{{prevPlayList.tags.length > 0 ? prevPlayList.tags.join("，") : ""}}</span>
      <span class="details">{{prevPlayList.description}}</span>
    </div>
    <div class="rightSongList">
      <div class="title">全部歌曲</div>
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
            :class="{bgEven :(index%2 == 0) ? true : false}"
          >
            <span class="idx">{{index + 1}}</span>
            <span class="songName" @click="goSongDetails(item.id)">{{item.name}}</span>
            <span class="songer">{{item.ar[0].name}}</span>
            <span class="songAr">{{item.al.name}}</span>
            <div class="itemControl">
              <span class="iconfont icon-xiayishoubofang" style="cursor: pointer;" title="下一首播放"></span>
              <el-dropdown @command="handleCommand" trigger="click">
                <span
                  class="el-dropdown-link iconfont icon-gengduo5"
                  style="cursor: pointer;margin-top:-5px;" title="添加到本地歌单"
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
// import "../../src/listen1-api.min.js"
import { mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {
      bgEven: false,
      dataList: {},
      addSongList: [],
      open: false,
      containerHeight: window.innerHeight - 122 + "px"
    };
  },
  computed: {
    ...mapGetters(["prevPlayList"])
  },
  created() {
    $.ajax({
      type: "get",
      url: "https://api.mtnhao.com/playlist/detail",
      data: {
        id: this.$route.params.id
      },
      dataType: "json",
      success: jsData => {
        // 注意使用 this.$nextTick(()=>{} 异步加载数据的时候 success回调函数只能用箭头函数，不然会改变 this
        this.$nextTick(() => {
          this.setPrevPlayList({ obj: jsData.playlist });
          // console.log(jsData.playlist);
        });
      }
    });
    this.addSongList = JSON.parse(localStorage.getItem("addList"));
  },

  methods: {
    ...mapActions(["setPrevPlayList", "setPrevPlaySong"]),
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
    },
  }
};
</script>
<style lang="scss" scoped>
.homePage-container {
  .leftImgBox {
    position: fixed;
    width: 400px;
    border-right: 1px solid #9b9b9b;
    .img {
      text-align: center;
      img {
        margin-top: 50px;
        width: 300px;
        // filter: blur(1px);
        box-shadow: 0 0 5px 5px rgba(0, 0, 0, 0.1);
      }
    }
    .detailsName {
      margin-top: 10px;
      margin-left: 50px;
      display: inline-block;
      font-size: 20px;
      font-weight: 700;
      width: 300px;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
    .detailsTag {
      margin-left: 50px;
      display: inline-block;
      font-size: 15px;
      width: 300px;
    }
    .details {
      margin-left: 50px;
      display: inline-block;
      font-size: 15px;
      width: 300px;
      height: 65px;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: wrap;
    }
  }
  .rightSongList {
    padding: 20px 20px 20px 420px;
    .title {
      font-size: 20px;
      font-weight: 700;
      padding-bottom: 20px;
      border-bottom: 1px solid #9b9b9b;
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

