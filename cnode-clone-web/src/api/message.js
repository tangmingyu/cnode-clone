import fetch from "@/utils/fetch";

const message = {
  list(type, page = 1, limit = 30) {
    // get /api/messages/:type?page=page&limit=limit
    return fetch({
      method: "get",
      url: `/api/messages/${type}`,
      params: { page, limit }
    });
  },
  check() {
    // get /api/message/check
    return fetch({
      method: "get",
      url: "/api/message/check"
    });
  },
  markReaded(messageId) {
    // put /api/message/mark
    return fetch({
      method: "put",
      url: "/api/message/mark",
      data: { messageId }
    });
  },
  markAllReaded(messages) {
    // put /api/message/markall
    return fetch({
      method: "put",
      url: "/api/message/markall",
      data: messages
    });
  },
  delete(messageId) {
    // delete /api/message
    return fetch({
      method: "delete",
      url: "/api/message",
      data: { messageId }
    });
  }
};

export default message;
