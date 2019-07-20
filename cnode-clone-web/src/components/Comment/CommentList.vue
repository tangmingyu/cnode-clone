<template>
  <div class="comment-list">
    <!-- comment-editor -->
    <div class="panel comment-editor" v-if="currentUser">
      <div class="header">添加回复</div>

      <div class="inner">
        <UserLink class="user" :user="currentUser" />
        <button class="btn" @click.stop="addComment">添加评论</button>
        <div class="text">
          <textarea
            name="comment"
            cols="30"
            rows="3"
            v-model="comment"
          ></textarea>
        </div>
      </div>
    </div>

    <!-- comment-list -->
    <div class="panel comment-list" v-if="comments.length">
      <div class="header">{{ comments.length }} 回复</div>

      <div class="inner">
        <div
          class="comment-wrapper"
          v-for="comment in comments"
          :key="comment._id"
        >
          <Comment :comment="comment" />
        </div>

        <!-- pagination -->
        <Pagination
          v-show="total > 15"
          class="comment-page"
          :page-size="15"
          :pager-count="5"
          :page="page"
          :total="total"
          @change="pageChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
import UserLink from "@/components/UserLink/UserLink.vue";
import Comment from "@/components/Comment/Comment.vue";
import Pagination from "@/components/Pagination/Pagination.vue";
import { mapState } from "vuex";

import comment from "@/api/comment";

export default {
  components: {
    UserLink,
    Comment,
    Pagination
  },
  props: {
    topicId: {
      type: String
    }
  },
  data() {
    return {
      page: 1,
      total: -1,
      comment: "",
      comments: []
    };
  },
  computed: {
    // isAuthor() {
    //   if (this.currentUser && this.topic.author) {
    //     return this.currentUser._id === this.topic.author._id;
    //   }
    //   return false;
    // },
    ...mapState({
      currentUser: state => state.sign.currentUser
    })
  },
  created() {
    this.loadComment();
  },
  methods: {
    pageChange(page) {
      this.loadComment(page);
    },
    async loadComment(page = 1) {
      const topicId = this.topicId;
      const { data, total } = await comment.list(topicId, page);
      this.page = page;
      this.total = total;
      this.comments = data;
    },
    async addComment() {
      const topicId = this.topicId;
      const content = this.comment;
      if (!content || content.trim() === "") {
        alert("内容不能为空");
      }
      await comment.create(topicId, content);
      this.loadComment();
      this.comment = "";
    },
    async delComment(comment) {
      const commentId = comment._id;
      await comment.delete(commentId);
      await this.loadComment(this.page);
    }
  }
};
</script>

<style lang="stylus" scoped>
.comment-list
  .comment-list
    .comment-wrapper
      border-top 1px solid #eee
      &:first-child
        border-top none
    .comment-page
      transform scale(0.8)
  .comment-editor
    .user
      float left
      box-sizing border-box
      width 80px
      height 60px
      margin 0
      margin-top 20px
      font-size 20px
      text-align center
    .text
      box-sizing border-box
      margin-left 85px
      margin-right 85px
    .btn
      font-size 16px
      float right
      width 80px
      height 80px
</style>
