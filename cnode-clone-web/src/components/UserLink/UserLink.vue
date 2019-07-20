<template>
  <div class="user-link" @mouseenter="mouseenter" @mouseleave="mouseleave">
    <!-- 头像 -->
    <span class="user-avatar">
      <router-link
        :to="{ name: 'user-profile', params: { username: user.username } }"
      >
        <img width="100%" height="100%" class="avatar" v-lazy="user.avatar" />
      </router-link>
    </span>

    <!-- 用户名 -->
    <router-link
      v-if="showName"
      :to="{ name: 'user-profile', params: { username: user.username } }"
    >
      <span class="user-name">{{ user.username }}</span>
    </router-link>

    <!-- 信息面板 -->
    <div
      class="user-panel"
      v-show="showPanel"
      @mouseenter="enterPanel"
      @mouseleave="leavePanel"
    >
      <!-- 背景图 -->
      <div class="user-pic"></div>

      <!-- 用户名 -->
      <span class="user-name">{{ user.username }}</span>

      <!-- 积分/话题/回复 -->
      <div class="user-infos">
        <span class="user-score">积分：{{ user.score }}</span>
        <span class="topic-count">话题：{{ user.topicCount }}</span>
        <span class="reply-count">回复：{{ user.participateCount }}</span>
      </div>

      <!-- 签名 -->
      <p class="user-signature">{{ user.signature }}</p>

      <!-- 头像 -->
      <span class="user-avatar">
        <img width="100%" height="100%" class="avatar" v-lazy="user.avatar" />
      </span>
    </div>
  </div>
</template>

<script>
import { clearTimeout, setTimeout } from "timers";
export default {
  props: {
    user: {
      type: Object,
      default: null
    },
    showName: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showPanel: false,
      hoverPanel: false,
      timer: null
    };
  },
  methods: {
    mouseenter() {
      this.showPanel = true;
    },
    mouseleave() {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.showPanel = this.hoverPanel;
      }, 100);
    },
    enterPanel() {
      this.hoverPanel = true;
    },
    leavePanel() {
      this.hoverPanel = false;
    }
  }
};
</script>

<style lang="stylus" scoped>
.user-link
  display inline-block
  position relative
  margin 0 0.4em
  font-size 16px
  line-height 1
  >.user-avatar
    display inline-block
    width 2em
    height 2em
    vertical-align middle
    cursor pointer
    .avatar
      width 100%
      height 100%
      border-radius 50%
      background-color #fff
  >.user-name
    margin-left 0.2em
    font-size 1em
    vertical-align middle
.user-panel
  position absolute
  left 0
  top 100%
  width 350px
  min-height 250px
  margin-top 5px
  border 1px solid #eee
  border-radius 5px
  font-size 14px
  text-align left
  background-color #fff
  box-shadow 0 0 10px #ccc
  overflow hidden
  z-index 10
  >.user-pic
    height 100px
    background-color #444
  >.user-name
    display inline-block
    margin-left 100px
    padding 10px 0
    color #333
    font-size 16px
    font-weight 600
    cursor pointer
  >.user-infos
    margin-left 100px
    padding 10px 0
    color #666
    font-size 12px
    span
      margin-right 10px
      vertical-align middle
  >.user-signature
    margin 10px 10px 10px 100px
    color #aaa
    line-height 16px
    max-height 48px
    word-wrap break-word
    overflow hidden
    text-overflow ellipsis
  >.user-avatar
    position absolute
    width 60px
    height 60px
    left 30px
    top 85px
    cursor pointer
    .avatar
      width 100%
      height 100%
      border-radius 50%
      background-color #fff
</style>
