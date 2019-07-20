<template>
  <CommonLayout :user="user">
    <div class="profile">
      <!-- 基本信息 -->

      <!-- 发布的话题 -->
      <div class="topic-list panel">
        <div class="header">最近创建的话题</div>

        <!-- topics  -->
        <div class="inner">
          <TopicList :data="topics" />
        </div>

        <!-- check more -->
        <div class="footer" v-if="topics.length == 5">
          <a class="more" @click.stop.prevent="checkMore('topics')">
            查看更多&gt;&gt;
          </a>
        </div>
      </div>

      <!-- 回复的话题 -->
      <div class="reply-list panel">
        <div class="header">最近参与的话题</div>

        <!-- participates  -->
        <div class="inner">
          <TopicList :data="participates" />
        </div>

        <!-- check more -->
        <div class="footer" v-if="participates.length == 5">
          <a class="more" @click.stop.prevent="checkMore('participates')">
            查看更多&gt;&gt;
          </a>
        </div>
      </div>

      <!-- 收藏的话题 -->
      <div class="reply-list panel">
        <div class="header">最近收藏的话题</div>

        <!-- collects  -->
        <div class="inner">
          <TopicList :data="collects" />
        </div>

        <!-- check more -->
        <div class="footer" v-if="collects.length == 5">
          <a class="more" @click.stop.prevent="checkMore('collects')">
            查看更多&gt;&gt;
          </a>
        </div>
      </div>
    </div>
  </CommonLayout>
</template>

<script>
import CommonLayout from "@/layouts/CommonLayout.vue";
import TopicList from "@/components/TopicList/TopicList.vue";
import { mapState, mapActions } from "vuex";

export default {
  name: "profile",
  components: {
    CommonLayout,
    TopicList
  },
  props: {
    username: {
      type: String
    }
  },
  data() {
    return {
      user: null,
      topics: [],
      participates: [],
      collects: []
    };
  },
  computed: {
    ...mapState({
      currentUser: state => state.sign.currentUser
    })
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
        this.user = await this.getProfile(this.username);
      }
    },
    async loadPage() {
      const [topics, participates, collects] = await Promise.all([
        this.getTopics(this.username),
        this.getParticipates(this.username),
        this.getCollects(this.username)
      ]);
      this.topics = topics.data;
      this.participates = participates.data;
      this.collects = collects.data;
    },
    checkMore(path) {
      this.$router.push({
        name: `user-${path}`
      });
    },
    ...mapActions({
      getProfile: "user/getUserProfile",
      getTopics: "user/getUsersTopics",
      getCollects: "user/getUsersCollects",
      getParticipates: "user/getUsersParticipates"
    })
  },
  watch: {
    username() {
      this.loadPage();
      this.loadUser();
    }
  }
};
</script>

<style lang="stylus" scoped>
.inner
  padding 0
.footer
  .more
    color #666
    text-decoration none
    &:hover
      color #385f8a
</style>
