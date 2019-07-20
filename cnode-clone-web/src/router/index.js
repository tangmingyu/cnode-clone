import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

import Home from "@/views/Home.vue";
import NotFound from "@/views/NotFound.vue";

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
      props: route => ({
        tab: route.query.tab,
        page: +route.query.page
      })
    },
    {
      path: "/404",
      redirect: "not-found"
    },
    {
      path: "/about",
      name: "about",
      component: () =>
        import(/* webpackChunkName: "about" */ "@/views/About.vue")
    },
    {
      path: "/sign/:tab",
      name: "sign",
      props: route => ({
        tab: route.params.tab
      }),
      component: () => import(/* webpackChunkName: "sign" */ "@/views/Sign.vue")
    },
    {
      path: "/create",
      name: "topic-create", // 需要登录
      component: () =>
        import(/* webpackChunkName: "topic" */ "@/views/TopicEdit.vue")
    },
    {
      path: "/topic/:topic_id",
      name: "topic-view",
      props: route => ({
        topicId: route.params.topic_id
      }),
      component: () =>
        import(/* webpackChunkName: "topic" */ "@/views/TopicView.vue")
    },
    {
      path: "/edit/:topic_id",
      name: "topic-edit", // 需要登录
      props: route => ({
        topicId: route.params.topic_id
      }),
      component: () =>
        import(/* webpackChunkName: "topic" */ "@/views/TopicEdit.vue")
    },
    {
      path: "/user/:username",
      name: "user-profile",
      props: route => route.params,
      component: () =>
        import(/* webpackChunkName: "profile" */ "@/views/Profile.vue")
    },
    {
      path: "/user/:username/topics",
      name: "user-topics",
      props: route => route.params,
      component: () =>
        import(
          /* webpackChunkName: "profile" */ "@/views/Profile/UserTopics.vue"
        )
    },
    {
      path: "/user/:username/participates",
      name: "user-participates",
      props: route => route.params,
      component: () =>
        import(
          /* webpackChunkName: "profile" */ "@/views/Profile/UserParticipates.vue"
        )
    },
    {
      path: "/user/:username/collects",
      name: "user-collects",
      props: route => route.params,
      component: () =>
        import(
          /* webpackChunkName: "profile" */ "@/views/Profile/UserCollects.vue"
        )
    },
    {
      path: "/message", // 需要登录
      redirect: "/message/comment/1"
    },
    {
      path: "/message/:tab/:page",
      name: "message", // 需要登录
      props: route => ({
        tab: route.params.tab,
        page: +route.params.page
      }),
      component: () =>
        import(/* webpackChunkName: "message" */ "@/views/Message.vue")
    },
    {
      path: "/setting",
      name: "setting", // 需要登录
      component: () =>
        import(/* webpackChunkName: "setting" */ "@/views/Setting.vue")
    },
    {
      path: "*",
      name: "not-found",
      component: NotFound
    }
  ]
});
