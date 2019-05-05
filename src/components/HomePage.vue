<template>
  <div class="homePage-container" ref="homePage">
    <div class="like-container">
      <span class="title">{{hello}}</span>
      <div class="history">上次播放</div>
      <ul class="likeBox" v-if="historyData">
        <li
          class="itemLike"
          v-for="item in historyData"
          :key="item.id"
          @click="goSongDetails(item.id)"
        >
          <div class="imgLike" v-if="item.al">
            <img v-lazy="item.al.picUrl" alt>
          </div>
          <span class="imgTitle" v-if="item.name" :title="item.name">{{item.name}}</span>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
// import "../../src/listen1-api.min.js"
import { mapGetters, mapActions } from "vuex";

export default {
  data() {
    return {
      hello: "",
      historyData: []
    };
  },
  computed: {
    ...mapGetters(["likeSowList", "historyList"])
  },
  created() {
    // 清除历史记录中的空对象
    if (this.historyList) {
      this.historyList.forEach((ele, index) => {
        if (ele.name != undefined) {
          this.historyData.push(ele);
        }
      });
    }
    let time = new Date().getHours(); //获取当前小时数(0-23)
    if (0 < time && time < 5) {
      this.hello = "晚上好";
    } else if (5 <= time && time < 11) {
      this.hello = "早上好";
    } else if (11 <= time && time < 14) {
      this.hello = "中午好";
    } else if (14 <= time && time < 18) {
      this.hello = "下午好";
    } else {
      this.hello = "晚上好";
    }

    // console.log(time);
  },
  mounted() {
    this.$refs.homePage.addEventListener('scroll', this.handleScroll, false);
    document.querySelector(".homePage-container").addEventListener("scroll", this.handleScroll, false);
    // window.addEventListener("scroll", this.handleScroll);
  },
  destroyed() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    ...mapActions(["setPrevPlaySong"]),
    goSongDetails(songId) {
      this.historyList.forEach(item => {
        if (item.id == songId) {
          this.setPrevPlaySong({ obj: item });
        }
      });
      this.$router.push({
        name: "songDetails",
        params: { songId: "wy_" + songId }
      });
    },
    handleScroll() {
      console.log("osTop");
      let top = document.querySelector("#searchBar").offsetTop;
      let osTop = document.documentElement.scrollTop || document.body.srcollTop;
      if (osTop > 0) {
        console.log(osTop);
        this.titleActive = true;
      }
    },
  }
};
</script>
<style lang="scss" scoped>
.homePage-container {
  width: 100%;
  height: 100%;
  padding: 20px;
  .like-container {
    .title {
      margin-top: 150px;
      display: block;
      font-size: 50px;
      font-weight: 700;
    }
    .history {
      line-height: 50px;
      border-bottom: 1px solid #ccc;
      font-size: 20px;
      font-weight: 700;
    }
    .likeBox {
      padding-left: 10px;
      padding-top: 10px;
      // display: flex;
      // justify-content: space-around;
      .itemLike {
        float: left;
        margin: 20px;
        text-align: center;
        cursor: pointer;
        .imgLike {
          background-color: #9530a3;
          width: 200px;
          height: 200px;
          img {
            width: 200px;
            height: 200px;
          }
        }
        .imgTitle {
          font-size: 14px;
          display: block;
          line-height: 30px;
          height: 30px;
          width: 200px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
}
</style>

