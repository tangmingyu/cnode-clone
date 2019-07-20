import fetch from "@/utils/fetch";

const topic = {
  list(tab, page = 1, limit = 30) {
    // get /api/topics?tab=tab&page=page&limit=limit
    return fetch({
      method: "get",
      url: "/api/topics",
      params: { tab, page, limit }
    });
  },
  info(topicId) {
    // get /api/topic/:topicId
    return fetch({
      method: "get",
      url: `/api/topic/${topicId}`
    });
  },
  create(tab, title, content) {
    // post /api/topic
    return fetch({
      method: "post",
      url: "/api/topic",
      data: { tab, title, content }
    });
  },
  update(topicId, tab, title, content) {
    // put /api/topic
    return fetch({
      method: "put",
      url: "/api/topic",
      data: { topicId, tab, title, content }
    });
  },
  delete(topicId) {
    // delete /api/topic
    return fetch({
      method: "delete",
      url: "/api/topic",
      data: { topicId }
    });
  }
};

export default topic;
