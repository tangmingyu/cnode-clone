<template>
  <div class="comment">
    <!-- user-link -->
    <div class="userlink">
      <UserLink :user="comment.author" />
    </div>

    <!-- comment-content -->
    <div class="content">
      <!-- user name -->
      <router-link class="author" :to="'/user/' + comment.author.username">
        {{ comment.author.username }}
      </router-link>

      <!-- content -->
      <p class="text">
        {{ comment.content }}
      </p>
      <div class="infos">
        <span class="time">
          {{ comment.createAt | datetime }}
        </span>
        <span class="ups">
          <a href="#" @click.prevent="upComment">点赞</a>
          <span v-if="comment.thumbUps.length">
            {{ comment.thumbUps.length }}
          </span>
        </span>
        <span class="reply">
          <a href="#" @click.prevent="replyTarget">回复</a>
        </span>
      </div>

      <div class="reply-wrapper">
        <!-- reply-list -->
        <div class="reply-list" v-if="replys.length">
          <!-- reply -->
          <div class="reply-item" v-for="reply in replys" :key="reply._id">
            <UserLink :user="reply.author" />
            <router-link class="author" :to="'/user/' + reply.author.username">
              {{ reply.author.username }}
            </router-link>
            <span class="text">
              {{ reply.content }}
            </span>
            <div class="infos">
              <span class="time">
                {{ reply.createAt | datetime }}
              </span>
              <span class="ups">
                <a href="#" @click.prevent="upReply(reply)">点赞</a>
                <span v-if="reply.thumbUps.length">
                  {{ reply.thumbUps.length }}
                </span>
              </span>
              <span class="reply">
                <a href="#" @click.prevent="replyTarget('reply', reply)"
                  >回复</a
                >
              </span>
            </div>
          </div>

          <!-- pagination -->
          <Pagination
            class="reply-page"
            v-show="replyTotal > 5"
            :page-size="5"
            :pager-count="5"
            :page="replyPage"
            :total="replyTotal"
            @change="pageChange"
          />
        </div>

        <!-- reply-editor -->
        <div class="reply-editor" v-if="showEditor">
          <UserLink class="user" :user="currentUser" />
          <button class="btn" @click.stop="addReply">添加评论</button>
          <div class="text">
            <!-- @blur="clearTarget" -->
            <textarea
              name="reply"
              id="reply"
              cols="30"
              rows="3"
              v-model="textContent"
              autofocus
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import UserLink from "@/components/UserLink/UserLink.vue";
import Pagination from "@/components/Pagination/Pagination.vue";
import { mapState } from "vuex";

import reply from "@/api/reply";

export default {
  components: {
    UserLink,
    Pagination
  },
  props: {
    comment: {
      type: Object
    }
  },
  data() {
    return {
      replyPage: 1,
      replyTotal: -1,
      target: null,
      targetType: null,
      textContent: "",
      replys: []
    };
  },
  created() {
    this.loadReply();
  },
  computed: {
    showEditor() {
      if (this.currentUser && this.target) return true;
      return false;
    },
    ...mapState({
      currentUser: state => state.sign.currentUser
    })
  },
  methods: {
    clearTarget() {
      this.target = null;
      this.targetType = null;
    },
    replyTarget(type, data) {
      if (type === "reply") {
        this.target = data;
        this.targetType = "reply";
      } else {
        this.target = this.comment;
        this.targetType = "comment";
      }
    },
    pageChange(page) {
      this.loadReply(page);
    },
    async loadReply(page = 1) {
      const topicId = this.comment.topic;
      const commentId = this.comment._id;
      const { data, total } = await reply.list(topicId, commentId, page, 10);
      this.replyTotal = total;
      this.replys = data;
    },
    async delReply(data) {
      const topicId = this.comment.topic;
      const replyId = data._id;
      await reply.delete(topicId, replyId);
      await this.loadReply(this.replyPage);
    },
    async addReply() {
      debugger;
      const topicId = this.comment.topic;
      const commentId = this.comment._id;
      const content = this.textContent;
      if (!content || content.trim() === "") {
        alert("内容不能为空");
        return;
      }

      if (this.targetType === "comment") {
        await reply.create(topicId, commentId, content);
      }

      if (this.targetType === "reply") {
        const parentId = this.target._id;
        await reply.create(topicId, commentId, content, parentId);
      }
      this.textContent = "";
      this.clearTarget();
      this.loadReply(this.replyPage);
    },
    async upReply(data) {
      const topicId = this.comment.topic;
      const replyId = data._id;
      await reply.thumbUp(topicId, replyId);
      this.loadReply(this.replyPage);
    },
    async upComment() {
      const topicId = this.comment.topic;
      const commentId = this.comment._id;
      await comment.thumbUp(topicId, commentId);
      this.loadReply(this.replyPage);
    }
  }
};
</script>

<style lang="stylus" scoped>
.comment
  .userlink
    float left
    margin 10px
  .content
    margin-left 85px
    .author
      font-size 12px
      font-weight 700
      line-height 18px
      padding-bottom 4px
      word-wrap break-word
    .text
      padding 2px 0
      font-size 14px
      line-height 20px
      overflow hidden
      word-wrap break-word
      word-break break-word
    .infos
      color #99a2aa
      line-height 26px
      font-size 12px
      span
        margin-right 20px
      .ups, .reply
        a:hover
          text-decoration underline
    .reply-wrapper
      .reply-page
        transform scale(0.5) translateX(-50%)
        text-align left
      .reply-item
        .infos
          margin-left 45px
          color #99a2aa
          line-height 26px
          font-size 12px
          span
            margin-right 20px
          .ups, .reply
            a:hover
              text-decoration underline
      .reply-editor
        .user
          float left
          box-sizing border-box
          width 80px
          height 60px
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
