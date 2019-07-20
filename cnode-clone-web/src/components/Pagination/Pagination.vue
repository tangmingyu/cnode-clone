<template>
  <div class="pagination">
    <!-- 上一页 -->
    <button
      class="page pre"
      :disabled="currentPage === 1"
      @click.stop.prevent="preOne"
    >
      &lt;
    </button>

    <!-- 页码选择 -->
    <ul class="pager" @click.stop.prevent="selectPage($event)">
      <!-- 第一页 -->
      <li
        class="page number"
        :class="{ active: currentPage === 1 }"
        v-if="pagerCount > 0"
      >
        1
      </li>

      <!-- 快退 -->
      <li class="page prevMore" v-if="showPrevMore">&lt;&lt;</li>

      <!-- 分页 -->
      <li
        class="page number"
        v-for="page in pageList"
        :class="{ active: currentPage === page }"
        :key="page"
      >
        {{ page }}
      </li>

      <!-- 快进 -->
      <li class="page nextMore" v-if="showNextMore">&gt;&gt;</li>

      <!-- 最后一页 -->
      <li
        class="page number"
        :class="{ active: currentPage === totalPage }"
        v-if="totalPage > 1"
      >
        {{ totalPage }}
      </li>
    </ul>

    <!-- 下一页 -->
    <button
      href="#"
      class="page next"
      :disabled="currentPage === totalPage"
      @click.stop.prevent="nextOne"
    >
      &gt;
    </button>
  </div>
</template>

<script>
export default {
  props: {
    // 当前页码
    page: {
      type: Number,
      default: 1
    },
    // 总记录数
    total: {
      type: Number,
      default: 1
    },
    // 每页记录数
    pageSize: {
      type: Number,
      default: 20
    },
    // pager显示几页
    pagerCount: {
      type: Number,
      default: 5
    }
  },
  data() {
    return {
      currentPage: this.page
    };
  },
  computed: {
    totalPage() {
      return Math.ceil(this.total / this.pageSize);
    },
    showPrevMore() {
      const halfPagerCount = Math.ceil(this.pagerCount / 2);
      return (
        this.totalPage > this.pagerCount && this.currentPage > halfPagerCount
      );
    },
    showNextMore() {
      const halfPagerCount = Math.ceil(this.pagerCount / 2);
      return (
        this.totalPage > this.pagerCount &&
        this.currentPage < this.totalPage - halfPagerCount
      );
    },
    pageList() {
      const {
        currentPage,
        totalPage,
        pagerCount,
        showPrevMore,
        showNextMore
      } = this;

      const pageList = [];
      // both prevMore and nextMore
      if (showPrevMore && showNextMore) {
        // 当前页向前1/2到向后1/2
        const offset = Math.floor(pagerCount / 2) - 1;
        for (let i = currentPage - offset; i <= currentPage + offset; i++) {
          pageList.push(i);
        }
      }
      // only prevMore
      if (showPrevMore && !showNextMore) {
        // 最后pagerCount页, 显示倒数第pagerCount - 2页到totalPage
        const startPage = totalPage - (pagerCount - 2);
        for (let i = startPage; i < totalPage; i++) {
          pageList.push(i);
        }
      }
      // only nextMore
      if (!showPrevMore && showNextMore) {
        // 前pagerCount页，显示第2页到第pagerCount页
        for (let i = 2; i < pagerCount; i++) {
          pageList.push(i);
        }
      }
      // neither prevMore nor nextMore
      if (!showPrevMore && !showNextMore) {
        // total小于pagerCount, 显示从第2页到最后一页
        for (let i = 2; i < totalPage; i++) {
          pageList.push(i);
        }
      }
      return pageList;
    }
  },
  methods: {
    preOne() {
      const num = this.currentPage > 1 ? this.currentPage - 1 : 1;
      this.changePage(num);
    },
    nextOne() {
      const num =
        this.currentPage < this.totalPage
          ? this.currentPage + 1
          : this.totalPage;
      this.changePage(num);
    },
    selectPage(e) {
      const target = e.target;
      if (target.classList.contains("number")) {
        const num = Number(target.innerText);
        this.changePage(num);
      }
      if (target.classList.contains("prevMore")) {
        const halfPagerCount = Math.ceil(this.pagerCount / 2);
        const num = this.currentPage - halfPagerCount;
        this.changePage(num);
      }
      if (target.classList.contains("nextMore")) {
        const halfPagerCount = Math.ceil(this.pagerCount / 2);
        const num = this.currentPage + halfPagerCount;
        this.changePage(num);
      }
    },
    changePage(num) {
      if (num === this.currentPage) {
        return;
      }
      this.currentPage = num;
      this.$emit("change", num);
    }
  }
};
</script>

<style lang="stylus" scoped>
.pagination
  padding 1em
  font-size 14px
  text-align center
  line-height 2.5em
.pager
  display inline-block
  height 2.5em
  line-height 2.5em
.page
  display inline-block
  box-sizing border-box
  width 2.5em
  height 2.5em
  margin 0 0.2em
  border-radius 2.5em
  color #80bd01
  font-weight 600
  text-align center
  background #eee
  cursor pointer
  vertical-align middle
  &:disabled
    color #eee
    background-color #ddd
    cursor default
  &:hover:not(:disabled)
    color #fff
    background-color #999
  &.active
    color #fff
    background-color #80bd01
    cursor default
</style>
