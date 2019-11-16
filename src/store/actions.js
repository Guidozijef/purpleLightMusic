import {
  clearHistoryList,
  setHistoryList,
  removeHistoryList,
} from "./storage";

export const setAudioEle = function ({ commit }, { url }) {
  commit("set_audioEle", url);
};

export const setSongPlayUrl = function ({ commit }, { url }) {
  commit("set_songPlayUrl", url);
};

export const setSongPlayLrc = function ({ commit }, { lrc }) {
  commit("set_songPlayLrc", lrc);
};

export const setCurrentTime = function ({ commit }, { data }) {
  commit("set_currentTime", data);
};
// 保存所有数据
export const set_WY_HottestSongList = function ({ commit }, { data }) {
  commit("set_wyHottestSongList", data);
};
// 保存所有数据
export const set_WY_HotSongList = function ({ commit }, { data }) {
  commit("set_wyHotSongList", data);
};

export const set_WY_BoutiqueSongList = function ({ commit }, { data }) {
  commit("set_wyBoutiqueSongList", data);
};
// 保存所有qq数据
export const set_QQ_allDataList = function ({ commit }, { data }) {
  commit("set_qqAllDataList", data);
};
// 保存所有数据
export const set_QQ_HottestSongList = function ({ commit }, { data }) {
  commit("set_qqHottestSongList", data);
};
// 保存所有数据
export const set_QQ_HotSongList = function ({ commit }, { data }) {
  commit("set_qqHotSongList", data);
};

export const set_QQ_BoutiqueSongList = function ({ commit }, { data }) {
  commit("set_qqBoutiqueSongList", data);
};

export const setImportUserInfo = function ({ commit }, { data }) {
  localStorage.setItem("userInfo", JSON.stringify(data))
  commit("set_importUserInfo", data);
};

export const setPrevPlayList = function ({ commit }, { obj }) {
  commit("set_prevPlayList", obj);
};

export const setPrevPlaySong = function ({ commit }, { obj }) {
  commit("set_prevPlaySong", obj);
};

// 设置播放历史
export const setHistory = function ({ commit }, music) {
  commit("set_historyList", setHistoryList(music))
}
// 删除播放历史
export const removeHistory = function ({ commit }, music) {
  commit("set_historyList", removeHistoryList(music))
}
// 清空播放历史
export const clearHistory = function ({ commit }) {
  commit("set_historyList", clearHistoryList())
}