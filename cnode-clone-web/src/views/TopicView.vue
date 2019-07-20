<template>
  <CommonLayout :user="topic.author" v-if="topic">
    <div class="topic-view panel">
      <!-- topic -->
      <div class="panel topic">
        <!-- topic-header -->
        <div class="header topic-header">
          <!-- title -->
          <h1 class="title">{{ topic.title }}</h1>
          <!-- infos -->
          <div class="infos">
            <span>发布于 {{ topic.createAt | datetime }}</span>
            <span>
              作者
              <router-link :to="'/user/' + topic.author.username">
                {{ topic.author.username }}
              </router-link>
            </span>
            <span>{{ topic.visitCount }} 次浏览</span>
            <span>最后一次编辑是 {{ topic.updateAt | datetime }}</span>
          </div>
        </div>

        <!-- topic-content -->
        <div class="inner topic-content">
          <MarkdownEditor v-model="topic.content" :editable="false" />
        </div>
      </div>

      <!-- comment -->
      <div class="comment-wrapper" v-if="currentUser">
        <CommentList :topicId="topicId" />
      </div>
    </div>
  </CommonLayout>
</template>

<script>
import CommonLayout from "@/layouts/CommonLayout.vue";
import MarkdownEditor from "@/components/MarkdownEditor/MarkdownEditor.vue";
import CommentList from "@/components/Comment/CommentList.vue";
import { mapState } from "vuex";

import topic from "@/api/topic";
import collect from "@/api/collect";

export default {
  name: "topic-view",
  components: {
    CommonLayout,
    MarkdownEditor,
    CommentList
  },
  props: {
    topicId: {
      type: String
    }
  },
  data() {
    return {
      topic: null
    };
  },
  computed: {
    isAuthor() {
      if (this.currentUser && this.topic.author) {
        return this.currentUser._id === this.topic.author._id;
      }
      return false;
    },
    ...mapState({
      currentUser: state => state.sign.currentUser
    })
  },
  created() {
    this.loadTopic(this.topicId);
  },
  methods: {
    async loadTopic(topicId) {
      this.topic = await topic.info(topicId);
    },
    async removeTopic(topicId) {
      await topic.delete(topicId);
    },
    async collectTopic(topicId) {
      await collect.add(topicId);
    },
    editTopic(topicId) {
      return topicId;
    }
  }
};
</script>

<style lang="stylus" scoped>
.topic-view
  .topic
    .topic-header
      background-color #fff
      .title
        margin 8px 0
        font-size 22px
        font-weight 700
        line-height 1.3
      .infos
        font-size 12px
        color #838383
        span::before
          content '•'
        a
          font-size 12px
          color #838383
          &:hover
            text-decoration underline
    .topic-content
      padding 0
      margin 0 -1px
      .v-note-panel
        border none !important
</style>
