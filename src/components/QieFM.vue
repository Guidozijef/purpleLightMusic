<template>
  <div class="FM-container">
    <div class="FM-left" :style="{'height':containerHeight}">
      <div v-for="(info, index) in FMData" :key="index">
        <div class="FMTitle">{{info.type}}</div>
        <div class="infoBox">
          <ul>
            <li
              v-for="item in info.albumData"
              :key="item.album.albumID"
              class="itemBox"
              @click="goFMList(item.album)"
            >
              <div class="itemImg">
                <img :src="item.album.cover.urls[0].url" alt srcset>
              </div>
              <span class="name" :title="item.album.name">{{item.album.name}}</span>
              <span class="desc" :title="item.album.desc">{{item.album.desc}}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="FM-right" v-if="this.prevPlayList != {}">
      <div :class="titleActive ? 'titleActive' : 'infoBox'">
        <div class="songListCover" v-if="this.prevPlayList">
          <img v-lazy="this.prevPlayList.img" alt srcset>
        </div>
        <div class="songListInfoBox">
          <span class="songListName">{{this.prevPlayList.name}}</span>
          <span class="songListDescription">{{this.prevPlayList.desc}}</span>
          <div class="songListSum" v-if="!titleActive" style="margin-left:20px;">
            <!-- <span calss="number" style="margin-right:5px;">共{{prevPlayList.trackCount}}首</span>
            <span calss="number" style="margin-right:5px;">共播放{{prevPlayList.playCount}}次</span>-->
          </div>
        </div>
      </div>
      <div class="FMList">
        <ul>
          <li
            v-for="(item, m) in this.prevPlayList.showList"
            :key="m"
            :class="{bgEven :(m%2 == 0) ? true : false, FMItem:true}"
            @click="goPlayFM(item.show.strMid)"
          >
            <div class="time">{{toTime(item.show.createTime)}}</div>
            <!-- <div class="time">{{item.show.createTime}}</div> -->
            <div class="nameInfo">
              <span class="ablumName">{{item.show.name}}</span>
              <span class="ablumDesc">{{item.show.desc}}</span>
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
      bgEven: false,
      FMData: [
        { id: "39104", type: "情感生活", albumData: [] },
        { id: "39110", type: "音乐电台", albumData: [] },
        { id: "39092", type: "有声小说", albumData: [] },
        { id: "4", type: "相声曲艺", albumData: [] },
        { id: "1", type: "综艺娱乐", albumData: [] },
        { id: "39126", type: "知识干货", albumData: [] },
        { id: "18", type: "历史人文", albumData: [] },
        { id: "5", type: "新闻资讯", albumData: [] },
        { id: "39087", type: "搞笑段子", albumData: [] },
        { id: "39137", type: "广播电台", albumData: [] }
      ],
      titleActive: false,
      // albumItemData: {},
      containerHeight: window.innerHeight - 122 + "px"
    };
  },
  computed: {
    ...mapGetters(["prevPlayList"])
  },
  mounted() {
    this.$nextTick(() => {
      let _this = this;
      window.addEventListener("scroll", _this.handleScroll, true);
    });
    this.FMData.forEach(item => {
      $.ajax({
        type: "get",
        url: `https://api.imjad.cn/qqfm/v1/?type=album&page_size=20&id=${
          item.id
        }&page=1`,
        ContentType: "application/x-www-form-urlencoded",
        dataType: "json",
        success: jsData => {
          // 注意使用 this.$nextTick(()=>{} 异步加载数据的时候 success回调函数只能用箭头函数，不然会改变 this
          this.$nextTick(() => {
            // console.log(jsData);
            item.albumData = jsData.data.albumInfoList;
          });
        }
      });
    });
  },
  methods: {
    ...mapActions(["setSongPlayUrl", "setPrevPlayList", "setPrevPlaySong"]),
    handleScroll() {
      if ($(".mainContainer").scrollTop() > 0) {
        this.titleActive = true;
      } else {
        this.titleActive = false;
      }
    },
    goFMList(album) {
      $.ajax({
        type: "get",
        url: `https://api.imjad.cn/qqfm/v1/?type=show&id=${album.albumID}`,
        ContentType: "application/x-www-form-urlencoded",
        dataType: "json",
        success: jsData => {
          // 注意使用 this.$nextTick(()=>{} 异步加载数据的时候 success回调函数只能用箭头函数，不然会改变 this
          this.$nextTick(() => {
            // console.log(jsData);
            if (jsData.length > 100) {
              jsData.length = 100;
            }
            let albumIDList = jsData || [];
            // console.log(albumIDList);
            $.ajax({
              type: "get",
              url: `https://api.imjad.cn/qqfm/v1/?type=skip_show&id=${
                album.albumID
              }&shows=${albumIDList.join(",")}`,
              ContentType: "application/x-www-form-urlencoded",
              dataType: "json",
              success: itemData => {
                // 注意使用 this.$nextTick(()=>{} 异步加载数据的时候 success回调函数只能用箭头函数，不然会改变 this
                this.$nextTick(() => {
                  // console.log(data);
                  // 将专辑的封面信息绑定到专辑详情列表上
                  itemData.data.img = album.cover.urls[0].url;
                  itemData.data.name = album.name;
                  itemData.data.desc = album.desc;
                  // this.albumItemData = itemData.data;
                  this.setPrevPlayList({ obj: itemData.data });
                });
              }
            });
          });
        }
      });
    },
    goPlayFM(strMid) {
      // console.log(strMid);
      this.setSongPlayUrl({
        url: `http://ws.stream.fm.qq.com/vfm.tc.qq.com/R196${strMid}.m4a?fromtag=36&vkey=98837D0874E15B38FB695D0A78FF157379BCD2F8515C42A2E57B9E9B58C78C58C8093F96E2A9A6AA66D273AB647D42FBAF2BF882425C245B&guid=10000`
      });
      this.setPrevPlaySong({obj:""});
    },
    // 转化时间戳
    toTime(time) {
      var date = new Date(time);
      var Y = date.getFullYear() + "/";
      var M =
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "/";
      var D = date.getDate() + " ";
      var h = date.getHours() + ":";
      var m = date.getMinutes() + ":";
      var s = date.getSeconds();
      // console.log(Y + M + D);
      return Y + M + D;
    }
  }
};
</script>
<style lang="scss" scoped>
.FM-container {
  .FM-left {
    position: fixed;
    width: 450px;
    border-right: 1px solid #9b9b9b;
    overflow-y: auto;
    overflow-x: hidden;
    background-color: #f6f5f5;
    padding: 0 10px;
    top: 52px;
    .FMTitle {
      background-color: #f6f5f5;
      position: sticky;
      top: 0px;
      font-size: 20px;
      font-weight: 700;
      height: 80px;
      line-height: 100px;
      border-bottom: 1px solid #9b9b9b;
    }
    .infoBox {
      .itemBox {
        box-sizing: border-box;
        border: 2px solid #f6f5f5;
        margin-top: 10px;
        margin-right: 15px;
        width: 120px;
        height: 150px;
        text-align: center;
        display: inline-block;
        cursor: pointer;
        &:hover {
          border-color: #dcdada;
        }
        .itemImg {
          margin-top: 10px;
          margin-left: 20px;
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background-color: #6b3c71;
          overflow: hidden;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .name,
        .desc {
          display: block;
          line-height: 25px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .name {
          font-size: 16px;
          font-weight: 900;
        }
        .desc {
          color: #919191;
        }
      }
    }
  }
  .FM-right {
    margin-left: 450px;
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
      // transition: all 0.5s linear;
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
    .bgEven {
      background-color: #f9f9f9;
    }
    .FMList {
      padding: 0 15px;

      .FMItem {
        cursor: pointer;
        height: 52px;
        width: 100%;
        &:hover {
          background-color: #dedede;
        }
        .time {
          line-height: 52px;
          font-size: 16px;
          color: #6b3c71;
          width: 100px;
          float: left;
        }
        .nameInfo {
          width: 75%;
          float: left;
          margin-left: 20px;
          .ablumName,
          .ablumDesc {
            // line-height: 26px;
            display: block;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .ablumName {
            font-size: 16px;
            color: #000;
          }
          .ablumDesc {
            // font-size:16px;
            color: #959595;
          }
        }
      }
    }
  }
}
</style>

