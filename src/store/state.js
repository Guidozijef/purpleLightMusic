import { getHistoryList } from './storage'

const state = {
  audioEle: null, // audio元素
  songPlayUrl: null, // 当前播放的链接地址
  songPlayLrc: "", // 当前歌词
  currentTime: 0, // 当前已播放的时间
  importUserInfo: JSON.parse(localStorage.getItem("userInfo")) || [], // 存储导入的歌单
  prevPlayList: {}, // 当前播放的歌单 
  prevPlaySong: {}, // 当前播放的歌曲信息
  wangyiyun: {
    hottest: {},
    hot: {},// 最热歌单
    boutique: {}, // 精品歌单
  },
  qq: {
    allData: {}, // 全部qq音乐数据
    hottest: {},
    hot: {},// 最热歌单
    boutique: {}, // 精品歌单
  },
  historyList: getHistoryList() || [],
};

export default state;