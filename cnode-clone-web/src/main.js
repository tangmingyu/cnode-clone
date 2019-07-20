import Vue from "vue";
import moment from "moment";
import VueLazyload from "vue-lazyload";
import mavonEditor from "mavon-editor";

import App from "./App.vue";
import router from "./router";
import store from "./store";

import "mavon-editor/dist/css/index.css";
import "@/assets/stylus/index.styl";

Vue.config.productionTip = false;

Vue.use(VueLazyload, {
  error: require("@/assets/images/default.jpeg"),
  loading: require("@/assets/images/default.jpeg")
});
Vue.use(mavonEditor);

moment.locale("zh-cn");
Vue.filter("datetime", date => {
  return moment(date).fromNow();
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
