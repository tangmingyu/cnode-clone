<template>
  <CommonLayout :user="user">
    <div class="user-replys-wrapper">
      <!-- 标题 -->
      <div class="panel">
        <div class="header">主页</div>
      </div>

      <!-- 创建的主题 -->
      <div class="user-replys panel">
        <div class="header">参与的话题</div>

        <div class="inner">
          <!-- topicList  -->
          <TopicList
            :page="page"
            :total="total"
            :data="data"
            :loading="loading"
            @loadPage="loadPage"
          />
        </div>
      </div>
    </div>
  </CommonLayout>
</template>

<script>
import CommonLayout from "@/layouts/CommonLayout.vue";
import TopicList from "@/components/TopicList/TopicList.vue";

import user from "@/api/user";
import { mapState } from "vuex";

export default {
  name: "user-participates",
  components: {
    CommonLayout,
    TopicList
  },
  props: {
    username: String
  },
  data() {
    return {
      user: null,
      data: [],
      page: 1,
      total: -1,
      loading: false
    };
  },
  computed: {
    ...mapState(["currentUser"])
  },
  created() {
    this.loadPage();
    this.loadUser();
  },
  methods: {
    async loadUser() {
      if (this.currentUser && this.currentUser.username === this.username) {
        this.user = this.currentUser;
      } else {
        this.user = await user.profile(this.username);
      }
    },
    async loadPage(page) {
      this.page = page;
      this.loading = true;
      const { total, data } = await user.participates(this.username, this.page);
      this.total = total;
      this.data = data;
      this.loading = false;
    }
  }
};
</script>

<style lang="stylus" scoped>
.user-replys
  .inner
    padding 0
</style>
