import Vue from "vue";
import Vuex from "vuex";
import createLogger from "vuex/dist/logger";

import app from "./modules/app";
import sign from "./modules/sign";
import user from "./modules/user";

Vue.use(Vuex);
const debug = process.env.NODE_ENV !== "production";

export default new Vuex.Store({
  strict: debug,
  plugins: debug ? [createLogger()] : [],

  modules: {
    app,
    sign,
    user
  }
});
