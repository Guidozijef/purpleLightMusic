<template>
  <div class="musicBox-container">
    <mu-container>
      <mu-tabs :value.sync="active2" color="#9530a3" indicator-color="#FE4080" full-width ripple>
        <mu-tab>网易云音乐</mu-tab>
        <mu-tab @click="getQQData()">QQ音乐</mu-tab>
        <mu-tab>酷狗音乐</mu-tab>
        <mu-tab>酷我音乐</mu-tab>
      </mu-tabs>
      <div class="musicContiner" v-if="active2 === 0">
        <div class="hotSongList" v-if="this.wy_HottestSongList">
          <h3 class="hot">最热门</h3>
          <el-carousel :interval="4000" trigger="click" type="card" height="300px" class="hotInfo">
            <el-carousel-item
              class="item"
              v-for="item in this.wy_HottestSongList"
              :key="item.playlist.id"
              :style="{backgroundImage: 'url(' + item.playlist.coverImgUrl + ')'}"
            >
              <div @click="goSongListDetails(item.playlist.id)">
                <img
                  :src="item.playlist.coverImgUrl"
                  alt
                  srcset
                  class="img"
                  ondragstart="return false;"
                />
                <div class="itemInfo">
                  <div class="itemName" :title="item.playlist.name">{{item.playlist.name}}</div>
                  <span
                    class="itemTag"
                  >{{item.playlist.tags.length ? item.playlist.tags.join(",") : item.playlist.tags[0]}}</span>
                  <span class="itemDescription">{{item.playlist.description}}</span>
                </div>
              </div>
            </el-carousel-item>
          </el-carousel>
        </div>
        <div class="newSongList">
          <div class="newTitle">最新歌单</div>
          <ul class="itemBox" v-if="wy_HotSongList">
            <li
              class="item"
              v-for="item in wy_HotSongList"
              :key="item.id"
              @click="goSongListDetails(item.id)"
            >
              <img v-lazy="item.picUrl" alt srcset class="img" />
              <div class="itemInfo">
                <div class="itemName" :title="item.name">{{item.name}}</div>
                <span class="itemTag">{{item.arg}}</span>
                <span class="itemDescription">{{item.copywriter}}</span>
              </div>
            </li>
          </ul>
          <p v-if="loading1" style="text-align:center;">
            <img src="../assets/images/loading.gif" alt srcset style="width:30px;" />
          </p>
          <p v-if="noMore1" style="text-align:center;">没有更多了</p>
        </div>
        <!-- <div class="boutiqueSongList">
          <div class="boutiqueTitle">精品歌单</div>
          <ul
            class="itemBox"
            v-if="wy_BoutiqueSongList"
            v-infinite-scroll="loadMore2"
            infinite-scroll-disabled="disabled2"
            infinite-scroll-distance="20"
          >
            <li
              class="item"
              v-for="item in wy_BoutiqueSongList"
              :key="item.id"
              @click="goSongListDetails(item.id)"
            >
              <img v-lazy="item.coverImgUrl" alt srcset class="img" />
              <div class="itemInfo">
                <div class="itemName" :title="item.name">{{item.name}}</div>
                <span class="itemTag">{{item.tags.join(",")}}</span>
                <span class="itemDescription">{{item.description}}</span>
              </div>
            </li>
          </ul>
          <p v-if="loading2" style="text-align:center;">
            <img src="../assets/images/loading.gif" alt srcset style="width:30px;" />
          </p>
          <p v-if="noMore2" style="text-align:center;">没有更多了</p>
        </div>-->
      </div>
      <div class="musicContiner" v-if="active2 === 1">
        <!-- <div class="hotSongList">
          <h3 class="hot">最热门</h3>
          <el-carousel :interval="4000" trigger="click" type="card" height="300px" class="hotInfo">
            <el-carousel-item
              class="item"
              v-for="item in this.qq_HotSongList.list.slice(0,6)"
              :key="item.dissid"
              :style="{backgroundImage: 'url(' + item.imgurl + ')'}"
            >
              <img :src="item.imgurl" alt srcset class="img" />
              <div class="itemInfo">
                <div class="itemName">{{item.dissname}}</div>
                <span class="itemTag">{{item.creator.name}}</span>
                <span class="itemDescription">{{item.createtime}}</span>
              </div>
            </el-carousel-item>
          </el-carousel>
        </div>-->
        <!-- <div class="newSongList">
          <div class="newTitle">最新歌单</div>
          <ul class="itemBox" v-if="this.qq_HotSongList">
            <li
              class="item"
              v-for="item in this.qq_HotSongList.list"
              :key="item.dissid"
              @click="goSongListDetails(item.dissid)"
            >
              <img v-lazy="item.imgurl" alt srcset class="img" />
              <div class="itemInfo">
                <div class="itemName">{{item.dissname}}</div>
                <span class="itemTag">{{item.creator.name}}</span>
                <span class="itemDescription">{{item.createtime}}</span>
              </div>
            </li>
          </ul>
        </div>-->
        <div class="boutiqueSongList">
          <div class="boutiqueTitle">精品歌单</div>
          <ul class="itemBox" v-if="this.qq_BoutiqueSongList">
            <li
              class="item"
              v-for="item in this.qq_BoutiqueSongList.v_playlist"
              :key="item.access_num"
              @click="goSongListDetails(item.id)"
            >
              <img v-lazy="item.cover_url_medium" alt srcset class="img" />
              <div class="itemInfo">
                <div class="itemName">{{item.title}}</div>
                <span class="itemTag">{{item.creator_info.nick}}</span>
                <span class="itemDescription">{{52075}}</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="musicContiner" v-if="active2 === 2">
        <span
          style="font-size:20px;text-align:center;display:block;width:100%;margin-top：100px;"
        >敬请期待</span>
      </div>
      <div class="musicContiner" v-if="active2 === 3">
        <span
          style="font-size:20px;text-align:center;display:block;width:100%;margin-top：100px;"
        >敬请期待</span>
      </div>
    </mu-container>
    <el-backtop target=".musicBox-container"></el-backtop>
  </div>
</template>

<script>
// 导入jquery
import $ from "jquery";
import { mapActions, mapGetters } from "vuex";

// import musicApi from "@suen/music-api";
export default {
  data() {
    return {
      active2: 0,
      loading1: false,
      loading2: false,
      count1: 20,
      count2: 20
    };
  },
  computed: {
    noMore1() {
      return this.count1 >= 60;
    },
    disabled1() {
      return this.loading1 || this.noMore1;
    },
    noMore2() {
      return this.count2 >= 60;
    },
    disabled2() {
      return this.loading2 || this.noMore2;
    },
    ...mapGetters([
      "wy_HotSongList",
      "wy_BoutiqueSongList",
      "wy_HottestSongList",
      "qq_HotSongList",
      "qq_BoutiqueSongList"
    ])
  },
  created() {
    let idList = [
      "3778678",
      "3779629",
      "4395559",
      "64016",
      "112504",
      "19723756",
      "2884035",
      "440103454"
    ];
    let allData = [];

    idList.forEach(element => {
      $.ajax({
        type: "post",
        url: "http://www.gequdaquan.net/gqss/api.php?",
        data: {
          types: "playlist",
          id: element
        },
        dataType: "jsonp",
        success: data => {
          allData.push(data);
        }
      });
    });
    this.$nextTick(() => {
      this.set_WY_HottestSongList({ data: allData });
    });
    $.ajax({
      type: "get",
      url: "http://api.mtnhao.com/personalized",
      ContentType: "application/x-www-form-urlencoded",
      dataType: "json",
      success: jsData => {
        // 注意使用 this.$nextTick(()=>{} 异步加载数据的时候 success回调函数只能用箭头函数，不然会改变 this
        this.$nextTick(() => {
          this.set_WY_HotSongList({ data: jsData.result });
          // console.log(jsData);
        });
      }
    });
  },
  methods: {
    ...mapActions([
      "set_WY_HottestSongList",
      "set_WY_HotSongList",
      "set_WY_BoutiqueSongList",
      "set_QQ_HotSongList",
      "set_QQ_BoutiqueSongList"
    ]),
    goSongListDetails(id) {
      this.$router.push({ name: "songListDetails", params: { id } });
    },
    getQQData() {
      $.ajax({
        type: "get",
        url:
          "https://u.y.qq.com/cgi-bin/musicu.fcg?-=recom4017956852977256&g_tk=5381&loginUin=0&hostUin=0&format=json&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq.json&needNewCode=0&data=%7B%22comm%22%3A%7B%22ct%22%3A24%7D%2C%22category%22%3A%7B%22method%22%3A%22get_hot_category%22%2C%22param%22%3A%7B%22qq%22%3A%22%22%7D%2C%22module%22%3A%22music.web_category_svr%22%7D%2C%22recomPlaylist%22%3A%7B%22method%22%3A%22get_hot_recommend%22%2C%22param%22%3A%7B%22async%22%3A1%2C%22cmd%22%3A2%7D%2C%22module%22%3A%22playlist.HotRecommendServer%22%7D%2C%22playlist%22%3A%7B%22method%22%3A%22get_playlist_by_category%22%2C%22param%22%3A%7B%22id%22%3A8%2C%22curPage%22%3A1%2C%22size%22%3A40%2C%22order%22%3A5%2C%22titleid%22%3A8%7D%2C%22module%22%3A%22playlist.PlayListPlazaServer%22%7D%2C%22new_song%22%3A%7B%22module%22%3A%22newsong.NewSongServer%22%2C%22method%22%3A%22get_new_song_info%22%2C%22param%22%3A%7B%22type%22%3A5%7D%7D%2C%22new_album%22%3A%7B%22module%22%3A%22newalbum.NewAlbumServer%22%2C%22method%22%3A%22get_new_album_info%22%2C%22param%22%3A%7B%22area%22%3A1%2C%22sin%22%3A0%2C%22num%22%3A10%7D%7D%2C%22new_album_tag%22%3A%7B%22module%22%3A%22newalbum.NewAlbumServer%22%2C%22method%22%3A%22get_new_album_area%22%2C%22param%22%3A%7B%7D%7D%2C%22toplist%22%3A%7B%22module%22%3A%22musicToplist.ToplistInfoServer%22%2C%22method%22%3A%22GetAll%22%2C%22param%22%3A%7B%7D%7D%2C%22focus%22%3A%7B%22module%22%3A%22QQMusic.MusichallServer%22%2C%22method%22%3A%22GetFocus%22%2C%22param%22%3A%7B%7D%7D%7D",
        ContentType: "application/x-www-form-urlencoded",
        dataType: "jsonp",
        success: jsData => {
          // 注意使用 this.$nextTick(()=>{} 异步加载数据的时候 success回调函数只能用箭头函数，不然会改变 this
          this.$nextTick(() => {
            this.set_QQ_BoutiqueSongList({ data: jsData.playlist.data });
            // console.log(jsData);
          });
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.musicBox-container {
  // 覆盖muse-ui的样式
  .container {
    max-width: 100% !important;
    padding: 0;
  }
  .musicContiner {
    padding: 0 20px;
    .hotSongList {
      .hot {
        font-size: 30px;
        line-height: 30px;
        margin-left: 20px;
      }
      // .el-carousel__item:nth-child(2n) {
      //   background-color: #99a9bf;
      // }

      // .el-carousel__item:nth-child(2n + 1) {
      //   background-color: #d3dce6;
      // }
      .hotInfo {
        .item {
          background-size: 5000%;
          img {
            float: left;
            height: 300px;
          }
          .itemInfo {
            float: left;
            margin-left: 20px;
            .itemName {
              margin-top: 80px;
              width: 290px;
              text-overflow: ellipsis;
              overflow: hidden;
              white-space: nowrap;
              color: #fff;
              display: block;
              line-height: 50px;
              font-size: 30px;
              font-weight: 700;
              line-height: 50px;
            }
            .itemTag,
            .itemDescription {
              width: 290px;
              text-overflow: ellipsis;
              overflow: hidden;
              white-space: nowrap;
              font-size: 20px;
              line-height: 50px;
              display: block;
              line-height: 50px;
              color: #ccc;
            }
          }
        }
      }
    }
    .newSongList {
      .newTitle {
        line-height: 50px;
        border-bottom: 1px solid #ccc;
        font-size: 20px;
        font-weight: 700;
        position: sticky;
        top: 0px;
        background-color: #fff;
      }
      .itemBox {
        // float: left;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        .item {
          margin: 10px 0;
          width: 358px;
          height: 120px;
          transition: all 0.5s ease;
          cursor: pointer;
          &:hover {
            background-color: #e9e9e9;
            // border:1px solid #9530A3;
          }
          .img {
            margin-top: 8px;
            margin-left: 8px;
            width: 104px;
            height: 104px;
            float: left;
            background-color: rgba(234, 0, 255, 0.678);
          }
          .itemInfo {
            float: left;
            margin-left: 10px;
            .itemName {
              width: 200px;
              text-overflow: ellipsis;
              overflow: hidden;
              white-space: nowrap;
              display: block;
              line-height: 20px;
              font-size: 18px;
              font-weight: 700;
              line-height: 50px;
            }
            .itemTag,
            .itemDescription {
              width: 200px;
              text-overflow: ellipsis;
              overflow: hidden;
              white-space: nowrap;
              line-height: 20px;
              display: block;
              line-height: 20px;
              color: #666;
            }
          }
        }
      }
    }
    .boutiqueSongList {
      .boutiqueTitle {
        line-height: 50px;
        border-bottom: 1px solid #ccc;
        font-size: 20px;
        font-weight: 700;
        position: sticky;
        top: 0px;
        background-color: #fff;
      }
      .itemBox {
        // float: left;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        .item {
          margin: 10px 0;
          width: 358px;
          height: 120px;
          transition: all 0.5s ease;
          &:hover {
            background-color: #e9e9e9;
            // border:1px solid #9530A3;
          }
          .img {
            margin-top: 8px;
            margin-left: 8px;
            width: 104px;
            height: 104px;
            float: left;
            background-color: rgba(234, 0, 255, 0.678);
          }
          .itemInfo {
            float: left;
            margin-left: 10px;
            .itemName {
              width: 200px;
              text-overflow: ellipsis;
              overflow: hidden;
              white-space: nowrap;
              display: block;
              line-height: 20px;
              font-size: 18px;
              font-weight: 700;
              line-height: 50px;
            }
            .itemTag,
            .itemDescription {
              width: 200px;
              text-overflow: ellipsis;
              overflow: hidden;
              white-space: nowrap;
              line-height: 20px;
              display: block;
              color: #666;
            }
          }
        }
      }
    }
  }
}
</style>