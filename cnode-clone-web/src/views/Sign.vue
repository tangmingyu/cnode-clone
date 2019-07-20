<template>
  <SignLayout>
    <div class="panel sign">
      <div class="header">登录/注册</div>
      <div class="inner">
        <div class="sign-info">
          <div class="header">
            <router-link
              tag="span"
              to="/sign/singIn"
              :class="{ active: tab === 'singIn' }"
            >
              登录
            </router-link>
            <router-link
              tag="span"
              to="/sign/singUp"
              :class="{ active: tab === 'singUp' }"
            >
              注册
            </router-link>
          </div>

          <!-- 登录 -->
          <div class="content" :class="{ active: tab === 'singIn' }">
            <label for="username">用户名/邮箱</label>
            <input
              type="text"
              name="username"
              id="username"
              v-model="username"
            />
            <label for="password">密码</label>
            <input
              type="password"
              name="password"
              id="password"
              v-model="password"
            />
            <a href="#" @click.stop.prevent="resetPass">忘记密码了?</a>
            <button @click="signInAction">登录</button>
          </div>

          <!-- 注册 -->
          <div class="content" :class="{ active: tab === 'singUp' }">
            <label for="new_username">用户名</label>
            <input
              type="text"
              name="new_username"
              id="new_username"
              v-model="new_username"
            />
            <label for="new_email">邮箱</label>
            <input
              type="text"
              name="new_email"
              id="new_email"
              v-model="new_email"
            />
            <label for="new_password">密码</label>
            <input
              type="password"
              name="new_password"
              id="new_password"
              v-model="new_password"
            />
            <label for="new_password_confirm">确认密码</label>
            <input
              type="password"
              name="new_password_confirm"
              id="new_password_confirm"
              v-model="new_password_confirm"
            />
            <button @click="signUpAction">注册</button>
          </div>
        </div>

        <!-- 社交帐号登录 -->
        <!-- <div class="panel social-account">
            <div class="header">通过社交帐号登录</div>
            <ul class="inner">
              <li><span>Github</span></li>
            </ul>
          </div> -->
      </div>
    </div>
  </SignLayout>
</template>

<script>
import SignLayout from "@/layouts/SignLayout.vue";
import { createNamespacedHelpers } from "vuex";
const { mapActions } = createNamespacedHelpers("sign");

import sign from "@/api/sign";

export default {
  name: "sign",
  components: {
    SignLayout
  },
  props: {
    tab: {
      type: String
    }
  },
  data() {
    return {
      username: "",
      password: "",
      new_email: "",
      new_username: "",
      new_password: "",
      new_password_confirm: ""
    };
  },
  methods: {
    async signInAction() {
      const user_info = {
        username: this.username,
        password: this.password
      };
      await this.signIn(user_info);
    },
    async signUpAction() {
      const user_info = {
        username: this.new_username,
        password: this.new_password,
        email: this.new_email
      };
      await sign.signUp(user_info);
    },
    resetPass() {
      console.log("resetPass");
      // 显示页面，先验证email和username
    },
    resetPassRequest() {
      console.log("resetPassRequest");
    },
    ...mapActions(["signIn"])
  }
};
</script>

<style lang="stylus" scoped>
.sign-info
  width 400px
  margin 20px auto
  border 1px solid #eee
  border-radius 5px
  >.header
    display flex
    text-align center
    >span
      flex 1
      padding 10px
      cursor pointer
      border-bottom 2px solid #eee
      color #707070
      background-color #fafafa
    >.active
      border-color #80bd01
      color #000
      font-weight 600
      background-color #fff
  >.content
    display none
    box-sizing border-box
    width 100%
    padding 20px
  >.active
    display block
.social-account
  width 400px
  margin 20px auto
  border 1px solid #eee
  border-radius 5px
#forgot_password
  display inline-block
  // float right
  margin-bottom 10px
  color #778087
  line-height 20px
  text-align right
  vertical-align middle
</style>
