import fetch from "@/utils/fetch";

const reply = {
  list(topicId, commentId, page = 1, limit = 30) {
    // get /api/topic/:topicId/comment/:commentId/replys?page=page&limit=limit
    return fetch({
      method: "get",
      url: `/api/topic/${topicId}/comment/${commentId}/replys`,
      params: { page, limit }
    });
  },
  create(topicId, commentId, content, replyId) {
    // post /api/reply
    return fetch({
      method: "post",
      url: "/api/reply",
      data: { topicId, commentId, content, replyId }
    });
  },
  update(topicId, commentId, replyId, content) {
    // put /api/reply
    return fetch({
      method: "put",
      url: "/api/reply",
      data: { topicId, commentId, replyId, content }
    });
  },
  delete(topicId, replyId) {
    // delete /api/reply
    return fetch({
      method: "delete",
      url: "/api/reply",
      data: { topicId, replyId }
    });
  },
  thumbUp(topicId, replyId) {
    // put /api/reply/up
    return fetch({
      method: "put",
      url: "/api/reply/up",
      data: { topicId, replyId }
    });
  }
};

export default reply;
