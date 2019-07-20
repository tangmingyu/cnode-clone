import fetch from "@/utils/fetch";

const collect = {
  add(topicId) {
    // post /api/collect
    return fetch({
      method: "post",
      url: "/api/collect",
      data: { topicId }
    });
  },
  del(topicId) {
    // delete /api/collect
    return fetch({
      method: "delete",
      url: "/api/collect",
      data: { topicId }
    });
  }
};

export default collect;
