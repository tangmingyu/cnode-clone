import Cookies from "js-cookie";
import sign from "@/api/sign";

export default {
  namespaced: true,
  state: {
    currentUser: null,
    signed: Cookies.get("signed") || false
  },
  mutations: {
    set_current_user(state, user) {
      state.currentUser = user;
    },
    set_signed(state, signed) {
      state.signed = signed;
      Cookies.set("signed", signed);
    }
  },
  actions: {
    async signInfo({ commit }) {
      try {
        const user = await sign.signInfo();
        if (user) {
          commit("set_current_user", user);
          commit("set_signed", true);
        }
      } catch (e) {
        throw e;
      }
    },
    async signIn({ commit }, info) {
      const userInfo = await sign.signIn(info);
      commit("set_current_user", userInfo);
      commit("set_signed", true);
    },
    async signOut({ commit }) {
      await sign.signOut();
      commit("set_current_user", null);
      commit("set_signed", false);
    },
    signReset({ commit }) {
      commit("set_current_user", null);
      commit("set_signed", false);
    }
  }
};
