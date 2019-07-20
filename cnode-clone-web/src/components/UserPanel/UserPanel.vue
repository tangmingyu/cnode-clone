<template>
  <div class="user-panel-wrapper">
    <!-- 已登录 -->
    <div v-if="user" class="user-panel">
      <!-- 背景图 -->
      <div class="user-pic"></div>

      <!-- 用户名 -->
      <router-link
        :to="{ name: 'user-profile', params: { username: user.username } }"
      >
        <span class="user-name">{{ user.username }}</span>
      </router-link>

      <!-- 积分/话题/回复 -->
      <div class="user-infos">
        <span class="user-score">积分：{{ user.score }}</span>
        <span class="topic-count">话题：{{ user.topicCount }}</span>
        <span class="reply-count">参与：{{ user.participateCount }}</span>
      </div>

      <!-- 签名 -->
      <p class="user-signature">{{ user.signature }}</p>

      <!-- 头像 -->
      <router-link
        tag="span"
        class="user-avatar"
        :to="{ name: 'user-profile', params: { username: user.username } }"
      >
        <img width="100%" height="100%" class="avatar" v-lazy="user.avatar" />
      </router-link>
    </div>

    <!-- 未登录 -->
    <div v-else class="sign-panel">
      <button class="sign-in" @click="signIn">登录</button>
      <button class="sign-up" @click="signUp">注册</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    user: {
      type: Object
    }
  },
  methods: {
    signIn() {
      this.$router.push("/sign/singIn");
    },
    signUp() {
      this.$router.push("/sign/singUp");
    }
  }
};
</script>

<style lang="stylus" scoped>
.user-panel-wrapper
  position relative
  margin-bottom 13px
  font-size 12px
  background-color #fff
  border-radius 3px
  overflow hidden
.user-panel
  .user-pic
    height 60px
    background-color #444
  .user-name
    display inline-block
    margin 5px 5px 5px 100px
    color #333
    font-size 14px
    font-weight 600
    cursor pointer
  .user-infos
    margin 5px 5px 5px 100px
    color #666
    span
      margin-right 10px
      vertical-align middle
  .user-signature
    margin 10px
    color #aaa
    line-height 14px
    max-height 42px
    word-wrap break-word
    overflow hidden
    text-overflow ellipsis
  .user-avatar
    position absolute
    width 60px
    height 60px
    left 30px
    top 45px
    cursor pointer
    .avatar
      width 100%
      height 100%
      border-radius 50%
      background-color #fff
.sign-panel
  padding 20px
  button:last-child
    margin-bottom 0
</style>
