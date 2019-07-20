<template>
  <CommonLayout :user="currentUser">
    <div class="message panel">
      <!-- tabList  -->
      <div class="header">
        <ul class="tabList">
          <li v-for="{ tab, name } in tabInfos" :key="tab">
            <span
              class="tab"
              :class="{ active: currentTab === tab }"
              @click="selectTab(tab)"
            >
              {{ name }}
            </span>
          </li>
        </ul>
      </div>

      <!-- contentList -->
      <div class="inner">
        <ul class="contentList">
          <li
            class="content"
            v-show="currentTab === tab"
            v-for="{ tab, name, data, page, total, loading } in tabInfos"
            :key="tab"
          >
            <!-- messageList  -->
            <MessageList
              :page="page"
              :total="total"
              :data="data"
              :loading="loading"
              @loadPage="loadMessagePage"
            />
          </li>
        </ul>
      </div>
    </div>
  </CommonLayout>
</template>

<script>
import CommonLayout from "@/layouts/CommonLayout.vue";
import MessageList from "@/components/MessageList/MessageList.vue";
import { mapState } from "vuex";

import message from "@/api/message";

export default {
  name: "message",
  components: {
    CommonLayout,
    MessageList
  },
  props: {
    tab: {
      type: String,
      default: "comment"
    },
    page: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      currentTab: this.tab,
      tabInfos: null
    };
  },
  computed: {
    currentTabInfo() {
      return this.tabInfos[this.currentTab];
    },
    ...mapState({
      messageTabs: state => state.app.messageTabs,
      currentUser: state => state.sign.currentUser
    })
  },
  created() {
    this.init();
  },
  mounted() {
    this.loadMessageData(this.currentTabInfo);
  },
  methods: {
    init() {
      this.tabInfos = this.messageTabs.reduce((infos, item) => {
        const [tab, name] = item;
        infos[tab] = {
          tab,
          name,
          page: 1,
          total: -1,
          data: [],
          loading: false
        };
        return infos;
      }, {});
    },
    selectTab(tab) {
      this.currentTab = tab;
      const { page, total, data, loading } = this.currentTabInfo;

      this.$router.push({
        name: "message",
        params: { tab, page }
      });

      if (!data.length && !total !== 0 && !loading) {
        this.loadMessageData(this.currentTabInfo);
      }
    },
    loadMessagePage(page) {
      const tabInfo = this.currentTab;
      tabInfo.page = page;
      this.loadMessageData(tabInfo);
    },
    async loadMessageData(info) {
      info.loading = true;
      const { data, total } = await message.list(info.tab, info.page);
      info.data = data;
      info.total = total;
      info.loading = false;
    }
  }
};
</script>

<style lang="stylus" scoped>
.message
  >.header
    .tabList
      color #80bd01
      font-size 14px
      line-height 20px
      li
        display inline
      .tab
        margin 0 10px
        padding 4px
        cursor pointer
        text-align center
      .active
        border-radius 3px
        color #fff
        background-color #80bd01
  >.inner
    position relative
    padding 0
</style>
