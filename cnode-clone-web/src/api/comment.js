import fetch from "@/utils/fetch";

const comment = {
  list(topicId, page = 1, limit = 30) {
    // get /api/topic/:topicId/comments?page=page&limit=limit
    return fetch({
      method: "get",
      url: `/api/topic/${topicId}/comments`,
      params: { page, limit }
    });
  },
  create(topicId, content) {
    // post /api/comment
    return fetch({
      method: "post",
      url: "/api/comment",
      data: { topicId, content }
    });
  },
  update(topicId, commentId, content) {
    // put /api/comment
    return fetch({
      method: "put",
      url: "/api/comment",
      data: { topicId, commentId, content }
    });
  },
  delete(topicId, commentId) {
    // delete /api/comment
    return fetch({
      method: "delete",
      url: "/api/comment",
      data: { topicId, commentId }
    });
  },
  thumbUp(topicId, commentId) {
    // put /api/comment/up
    return fetch({
      method: "put",
      url: "/api/comment/up",
      data: { topicId, commentId }
    });
  }
};

export default comment;
