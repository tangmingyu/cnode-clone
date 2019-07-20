const app = {
  namespaced: true,
  state: {
    messageTabs: [
      ["at", "@我的"],
      ["comment", "评论我的"],
      ["reply", "回复我的"],
      ["up", "给我点赞的"]
    ],
    topicTabs: [
      // code, name, create
      ["all", "全部", false],
      ["good", "精华", false],
      ["share", "分享", true],
      ["ask", "问答", true],
      ["job", "招聘", true],
      ["dev", "客户端测试", true]
    ]
    // 无人回复的话题
    // 积分榜
  },
  getters: {
    newTopicTabs(state) {
      return state.topicTabs.filter(tab => tab[2]);
    }
  }
};

export default app;
