import fetch from "@/utils/fetch";

const user = {
  profile(username) {
    // get /api/user/:username
    return fetch({
      method: "get",
      url: `/api/user/${username}`
    });
  },
  topics(username, page = 1, limit = 30) {
    // get /api/user/:username/topics?page=page&limit=limit
    return fetch({
      method: "get",
      url: `/api/user/${username}/topics`,
      params: { page, limit }
    });
  },
  participates(username, page = 1, limit = 30) {
    // get /api/user/:username/participates?page=page&limit=limit
    return fetch({
      method: "get",
      url: `/api/user/${username}/participates`,
      params: { page, limit }
    });
  },
  collects(username, page = 1, limit = 30) {
    // get /api/user/:username/collects?page=page&limit=limit
    return fetch({
      method: "get",
      url: `/api/user/${username}/collects`,
      params: { page, limit }
    });
  },
  update(profile) {
    // put /api/user
    return fetch({
      method: "put",
      url: "/api/user",
      data: profile
    });
  },
  changePass(profile) {
    // put /api/user/pass
    return fetch({
      method: "put",
      url: "/api/user/pass",
      data: profile
    });
  },
  refreshToken() {
    // put /api/user/token/refresh
    return fetch({
      method: "put",
      url: "/api/user/token/refresh"
    });
  }
};

export default user;
