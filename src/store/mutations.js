const mutations = {
  // 修改audio元素
  set_audioEle(state, audioEle) {
    state.audioEle = audioEle;
  },
  // 播放链接地址
  set_songPlayUrl(state, songPlayUrl) {
    state.songPlayUrl = songPlayUrl;
  },
  // 播放的歌词
  set_songPlayLrc(state, songPlayLrc) {
    // state.songPlayLrc = songPlayLrc;
    if (songPlayLrc === "") return "";
    var lyrics = songPlayLrc.split("\n");
    var lrcList = [];
    for (var i = 0; i < lyrics.length; i++) {
      var lyric = decodeURIComponent(lyrics[i]);
      var timeReg = /\[\d*:\d*((\.|\:)\d*)*\]/g;
      var timeRegExpArr = lyric.match(timeReg);
      if (!timeRegExpArr) continue;
      var clause = lyric.replace(timeReg, "");
      for (var k = 0, h = timeRegExpArr.length; k < h; k++) {
        var t = timeRegExpArr[k];
        var min = Number(String(t.match(/\[\d*/i)).slice(1));
        var sec = Number(String(t.match(/\:\d*/i)).slice(1));
        var times = min * 60 + sec;
        lrcList.push({ times: times, clause: clause });
      }
    }
    state.songPlayLrc = lrcList;
  },
  // 当前播放的时间
  set_currentTime(state, currentTime) {
    state.currentTime = currentTime;
  },
  // 网易云最热歌单
  set_wyHottestSongList(state, wyHottestSongList) {
    state.wangyiyun.hottest = wyHottestSongList;
  },
  // 网易云最热歌单
  set_wyHotSongList(state, wyHotSongList) {
    state.wangyiyun.hot = wyHotSongList;
  },
  // 网易云最热歌单
  set_wyBoutiqueSongList(state, wyBoutiqueSongList) {
    state.wangyiyun.boutique = wyBoutiqueSongList;
  },
  // QQ全部数据
  set_qqAllDataList(state, qqAllDataList) {
    state.qq.allData = qqAllDataList;
  },
  // QQ最热歌单
  set_qqHottestSongList(state, qqHottestSongList) {
    state.qq.hottest = qqHottestSongList;
  },
  // QQ最热歌单
  set_qqHotSongList(state, qqHotSongList) {
    state.qq.hot = qqHotSongList;
  },
  // QQ最热歌单
  set_qqBoutiqueSongList(state, qqBoutiqueSongList) {
    state.qq.boutique = qqBoutiqueSongList;
  },
  // 修改audio元素
  set_importUserInfo(state, importUserInfo) {
    state.importUserInfo = importUserInfo;
  },
  // 修改audio元素
  set_prevPlayList(state, prevPlayList) {
    state.prevPlayList = prevPlayList;
  },
  // 修改audio元素
  set_prevPlaySong(state, prevPlaySong) {
    state.prevPlaySong = prevPlaySong;
  },
  // 历史记录数据
  set_historyList(state, historyList) {
    state.historyList = historyList;
  }
};

export default mutations;
