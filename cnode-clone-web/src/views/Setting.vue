<template>
  <CommonLayout :user="currentUser">
    <div class="setting-wrapper">
      <!-- 信息设置 -->
      <div class="setting panel">
        <div class="header">设置</div>

        <div class="inner">
          <div class="form">
            <!-- 用户名 -->
            <label for="username">用户名</label>
            <input
              type="text"
              name="username"
              id="username"
              :value="profile.username"
              readonly
            />
            <!-- 邮箱 -->
            <label for="email">邮箱</label>
            <input
              type="text"
              name="email"
              id="email"
              :value="profile.email"
              readonly
            />
            <!-- 网站 -->
            <label for="url">个人网站</label>
            <input type="text" name="url" id="url" v-model="profile.url" />
            <!-- 所在地 -->
            <label for="location">所在地</label>
            <input
              type="text"
              name="location"
              id="location"
              v-model="profile.location"
            />
            <!-- weibo -->
            <label for="weibo">微博</label>
            <input
              type="text"
              name="weibo"
              id="weibo"
              v-model="profile.weibo"
            />
            <!-- github -->
            <!-- <label for="github">Github</label>
            <input
              type="text"
              name="github"
              id="github"
              :value="profile.githubUsername"
              readonly
            /> -->
            <!-- 签名 -->
            <label for="signature">个性签名</label>
            <textarea
              name="signature"
              id="signature"
              cols="30"
              rows="3"
              v-model="profile.signature"
            ></textarea>
            <button @click.stop="updateProfile">保存设置</button>
          </div>
        </div>
      </div>

      <!-- 更改密码 -->
      <div class="pass panel">
        <div class="header">更改密码</div>
        <div class="inner">
          <div class="form">
            <!-- 当前密码 -->
            <label for="old_password">当前密码</label>
            <input
              type="password"
              name="old_password"
              id="old_password"
              v-model="pass.old_password"
            />
            <!-- 新密码 -->
            <label for="new_password">新密码</label>
            <input
              type="password"
              name="new_password"
              id="new_password"
              v-model="pass.new_password"
            />
            <button @click.stop="changePass">更改密码</button>
          </div>
        </div>
      </div>

      <!-- access token -->
      <div class="access-token panel">
        <div class="header">Acess Token</div>
        <div class="inner">
          <!-- token -->
          <label for="token_text">字符串</label>
          <p name="token_text">
            {{ currentUser.accessToken }}
          </p>
          <button @click.stop="refreshToken">刷新Token</button>
        </div>
      </div>
    </div>
  </CommonLayout>
</template>

<script>
import CommonLayout from "@/layouts/CommonLayout.vue";
import { mapState } from "vuex";

import user from "@/api/user";

export default {
  name: "setting",
  components: {
    CommonLayout
  },
  data() {
    return {
      profile: {},
      pass: {}
    };
  },
  computed: {
    ...mapState({
      currentUser: state => state.sign.currentUser
    })
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      const profile = (this.profile = {});
      profile._id = this.currentUser._id;
      profile.username = this.currentUser.username;
      profile.email = this.currentUser.email;
      profile.url = this.currentUser.url;
      profile.location = this.currentUser.location;
      profile.weibo = this.currentUser.weibo;
      profile.signature = this.currentUser.signature;
    },
    async updateProfile() {
      // 数据验证
      await user.update(this.profile);
      this.init();
    },
    async changePass() {
      // 数据验证
      await user.changePass(this.pass);
      this.pass = {};
    },
    async refreshToken() {
      // 数据验证
      await user.refreshToken();
      this.init();
    }
  }
};
</script>

<style lang="stylus" scoped>
.setting-wrapper
  .form
    max-width 400px
  label, input, button
    font-size 12px
  button
    width auto
</style>
