import fetch from "@/utils/fetch";

const sign = {
  signInfo() {
    // post /api/signiup
    return fetch({
      method: "get",
      url: "/api/signinfo"
    });
  },
  signUp(user) {
    // post /api/signiup
    return fetch({
      method: "post",
      url: "/api/signup",
      data: user
    });
  },
  signIn(user) {
    // post /api/signin
    return fetch({
      method: "post",
      url: "/api/signin",
      data: user
    });
  },
  signOut() {
    // post /api/signout
    return fetch({
      method: "post",
      url: "/api/signout"
    }).then(function() {
      // clear cookie
    });
  },
  resetRequest(username, email) {
    // post /api/signout
    return fetch({
      method: "post",
      url: "/api/reset/request",
      data: { username, email }
    });
  },
  resetVerify(key, username) {
    // post /api/signout
    return fetch({
      method: "get",
      url: "/api/reset/verify",
      data: { key, username }
    });
  },
  resetPass(key, username, new_password) {
    // post /api/signout
    return fetch({
      method: "put",
      url: "/api/reset",
      data: { key, username, new_password }
    });
  }
};

export default sign;
