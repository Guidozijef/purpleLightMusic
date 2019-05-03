const storage = {
  get(key, defa = []) {
    if (window.localStorage) {
      return localStorage.getItem(key)
        ? Array.isArray(defa)
          ? JSON.parse(localStorage.getItem(key))
          : localStorage.getItem(key)
        : defa;
    }
  },
  set(key, val) {
    if (window.localStorage) {
      localStorage.setItem(key, val);
    }
  },
  clear(key) {
    if (window.localStorage) {
      localStorage.removeItem(key);
    }
  }
};

/**
 * 播放历史
 * @type    HISTORYLIST_KEY：key值
 *          HistoryListMAX：最大长度
 */
const HISTORYLIST_KEY = "_purpleLight__historyList__";
const HistoryListMAX = 50;
// 获取播放历史
export function getHistoryList() {
  return storage.get(HISTORYLIST_KEY);
}

// 更新播放历史
export function setHistoryList(music) {
  let list = storage.get(HISTORYLIST_KEY);
  if (list != {}) {
    list.forEach((item, m) => {
      if (item == {}) {
        list.split(m, 1);
      }
    });
  }
  const index = list.findIndex(item => {
    return item.id === music.id;
  });
  if (index === 0) {
    return list;
  }
  if (index > 0) {
    list.splice(index, 1);
  }
  list.unshift(music);
  if (HistoryListMAX && list.length > HistoryListMAX) {
    list.pop();
  }
  storage.set(HISTORYLIST_KEY, JSON.stringify(list));
  return list;
}

// 删除一条播放历史
export function removeHistoryList(music) {
  storage.set(HISTORYLIST_KEY, JSON.stringify(music));
  return music;
}

// 清空播放历史
export function clearHistoryList() {
  storage.clear(HISTORYLIST_KEY);
  return [];
}
