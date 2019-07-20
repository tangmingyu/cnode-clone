<template>
  <div class="message-wrapper">
    <!-- messageList -->
    <div v-if="data.length > 0" class="message-content">
      <ul class="message-list">
        <li class="message" v-for="message in data" :key="message._id">
          <!-- author -->
          <UserLink class="author" :user="message.sender" />

          <!-- comment消息 -->

          <!-- reply消息 -->

          <!-- at消息 -->

          <!-- thumbup消息 -->
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
    <div v-else-if="!loading" class="no-message-found">
      <div class="mask"></div>
      <div class="no-data-wrapper">
        <div class="text">无消息</div>
      </div>
    </div>

    <!-- loading -->
    <Loading v-show="loading" />
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
.message-wrapper
  position relative
  min-height 200px
  text-align center
.message-list
  min-height 200px
  height 200px
.message
  display flex
  padding 10px
  border-top 1px solid #f0f0f0
  color #778087
  font-size 12px
  text-align left
  background-color #fff
  align-items center
  .author
    font-size 20px
  &:first-child
    border none
.no-message-found
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
