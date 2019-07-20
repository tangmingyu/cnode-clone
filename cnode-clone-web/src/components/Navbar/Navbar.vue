<template>
  <div class="navbar">
    <div class="wrapper clearfix">
      <!-- 左栏 -->
      <div class="nav-left">
        <!-- logo -->
        <span class="logo">
          <a href="/">
            <img
              width="100%"
              height="100%"
              src="/cnodejs_light.svg"
              alt="logo"
            />
          </a>
        </span>

        <!-- 搜索 -->
        <!-- <SearchBox /> -->
      </div>

      <!-- 右栏 -->
      <div class="nav-right">
        <ul class="navlinks">
          <li>
            <router-link class="nav-item" to="/">首页</router-link>
          </li>
          <template v-if="user">
            <li>
              <router-link
                class="nav-item"
                :to="{
                  name: 'user-profile',
                  params: { username: user.username }
                }"
              >
                用户
              </router-link>
            </li>
            <li>
              <router-link class="nav-item" to="/message">消息</router-link>
            </li>
            <li>
              <router-link class="nav-item" to="/setting">设置</router-link>
            </li>
          </template>

          <li>
            <router-link class="nav-item" to="/about">关于</router-link>
          </li>

          <template v-if="!user">
            <li>
              <router-link class="nav-item" to="/sign/singIn">
                登录
              </router-link>
            </li>
            <li>
              <router-link class="nav-item" to="/sign/singUp">
                注册
              </router-link>
            </li>
          </template>
          <template v-else>
            <li>
              <a class="nav-item" @click.prevent="signOut">退出</a>
            </li>
          </template>
        </ul>
        <span class="new-topic-wrapper" v-if="user">
          <router-link class="new-topic" to="/create">
            发帖
          </router-link>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
// import SearchBox from "@/components/SearchBox/SearchBox.vue";
import { createNamespacedHelpers } from "vuex";
const { mapState, mapActions } = createNamespacedHelpers("sign");

export default {
  name: "navbar",
  // components: {
  //   SearchBox
  // },
  computed: {
    ...mapState({
      user: "currentUser"
    })
  },
  methods: {
    ...mapActions(["signOut"])
  }
};
</script>

<style lang="stylus" scoped>
.navbar
  width 100%
  height 50px
  color #eee
  background-color #444
  .nav-left
    height 100%
    float left
  .nav-right
    position relative
    height 100%
    float right
.logo
  display inline-block
  width 120px
  height 50px
  margin-right 20px
  vertical-align middle
.navlinks
  display inline-block
  font-size 14px
  line-height 50px
  vertical-align middle
  li
    display inline-block
    margin 0 5px
    list-style none
  .nav-item
    display inline-block
    height 50px
    padding 0 10px
    &:hover
      background-color #555
.new-topic-wrapper
  position relative
  display inline-block
  height 50px
  width 70px
  vertical-align middle
.new-topic
  display inline-block
  position absolute
  top 0
  right 0
  width 68px
  height 55px
  font-size 16px
  font-weight 600
  line-height 55px
  text-align center
  background-color #80bd01
  border-radius 0 0 5px 5px
  &:hover
    background-color lighten(#80bd01, 10%)
</style>
