<template>
  <div class="topic-wrapper">
    <!-- topicList -->
    <div v-if="data.length > 0" class="topic-content">
      <ul class="topic-list">
        <li class="topic" v-for="topic in data" :key="topic._id">
          <!-- author -->
          <UserLink class="author" :user="topic.author" />

          <!-- participateCount/visitCount -->
          <span class="topic-info">
            <span class="reply-count" title="回复数">
              {{ topic.participateCount }}
            </span>
            <span class="seperator">/</span>
            <span class="visit-count" title="访问数">
              {{ topic.visitCount }}
            </span>
          </span>

          <!-- topic title  -->
          <span class="topic-title-wrapper">
            <span class="badge good"></span>
            <a
              class="topic-title"
              target="_blank"
              :href="'/topic/' + topic._id"
              :title="topic.title"
            >
              {{ topic.title }}
            </a>
          </span>

          <!-- lastParticipate -->
          <span class="last-reply" v-if="topic.lastParticipate">
            <UserLink
              class="last-reply-by"
              :user="topic.lastParticipate.user"
            />
            <span class="last-reply-at">
              {{ topic.lastParticipate.incrementAt | datetime }}
            </span>
          </span>
        </li>
      </ul>

      <!-- pagination -->
      <Pagination
        v-if="showPage"
        :page-size="30"
        :pager-count="10"
        :page="page"
        :total="total"
        @change="pageChange"
      />
    </div>

    <!-- no data -->
    <div v-else-if="!loading" class="no-topic-found">
      <div class="mask"></div>
      <div class="no-data-wrapper">
        <div class="text">无话题</div>
      </div>
    </div>

    <!-- loading -->
    <Loading v-show="loading" />

    <!-- test -->
    <!-- <Pagination
      :page-size="30"
      :pager-count="10"
      :page="1"
      :total="301"
      @change="pageChange"
    /> -->
  </div>
</template>

<script>
import UserLink from "@/components/UserLink/UserLink.vue";
import Loading from "@/components/Loading/Loading.vue";
import Pagination from "@/components/Pagination/Pagination.vue";

export default {
  components: {
    UserLink,
    Loading,
    Pagination
  },
  props: {
    page: {
      type: Number,
      default: -1
    },
    total: {
      type: Number,
      default: -1
    },
    showPage: {
      type: Boolean,
      default() {
        return this.page !== -1 || this.total !== -1;
      }
    },
    loading: {
      type: Boolean,
      default: false
    },
    data: {
      type: Array
    }
  },
  methods: {
    pageChange(page) {
      this.$emit("loadPage", page);
    }
  }
};
</script>

<style lang="stylus" scoped>
.topic-wrapper
  position relative
  min-height 200px
  text-align center
.topic-list
  min-height 200px
.topic
  display flex
  padding 10px
  border-bottom 1px solid #f0f0f0
  color #778087
  font-size 12px
  text-align left
  background-color #fff
  align-items center
  &:hover
    background-color #f5f5f5
  .author
    font-size 20px
  .topic-info
    width 70px
    font-size 12px
    text-align center
    .reply-count
      color #9e78c0
      font-size 14px
  .topic-title-wrapper
    flex 1 1 500px
    text-overflow ellipsis
    .topic-title
      &:hover
        text-decoration underline
      color #888
      font-size 16px
      line-height 30px
      white-space nowrap
  .last-reply
    margin-left 20px
    .last-reply-by
      font-size 12px
    .last-reply-at
      min-width 50px
      margin-left 10px
      text-align right
.no-topic-found
  position absolute
  left 0
  right 0
  top 0
  bottom 0
  .mask
    width 100%
    height 100%
    background-color #ddd
    opacity 0.5
  .no-data-wrapper
    position absolute
    top 50%
    left 50%
    transform translate(-50%, -50%)
    .text
      color #999
      font-size 24px
      font-weight 600
</style>
