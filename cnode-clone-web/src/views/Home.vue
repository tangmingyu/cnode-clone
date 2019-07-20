<template>
  <HomeLayout :user="currentUser">
    <div class="home panel">
      <!-- header -->
      <div class="header">
        <!-- tabList  -->
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

      <div class="inner">
        <!-- contentList -->
        <ul class="contentList">
          <li
            class="content"
            v-show="currentTab === tab"
            v-for="{ tab, name, data, page, total, loading } in tabInfos"
            :key="tab"
          >
            <!-- topicList  -->
            <TopicList
              :page="page"
              :total="total"
              :data="data"
              :loading="loading"
              @loadPage="loadTopicPage"
            />
          </li>
        </ul>
      </div>
    </div>
  </HomeLayout>
</template>

<script>
import HomeLayout from "@/layouts/HomeLayout.vue";
import TopicList from "@/components/TopicList/TopicList.vue";
import { mapState } from "vuex";

import topic from "@/api/topic";

export default {
  name: "home",
  components: { HomeLayout, TopicList },
  props: {
    tab: {
      type: String,
      default: "all"
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
      topicTabs: state => state.app.topicTabs,
      currentUser: state => state.sign.currentUser
    })
  },
  created() {
    this.init();
  },
  mounted() {
    this.loadTopicData(this.currentTabInfo);
  },
  methods: {
    init() {
      this.tabInfos = this.topicTabs.reduce((infos, item) => {
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
        name: "home",
        query: { tab, page }
      });

      if (!data.length && !total !== 0 && !loading) {
        this.loadTopicData(this.currentTabInfo);
      }
    },
    loadTopicPage(page) {
      const tabInfo = this.currentTabInfo;
      tabInfo.page = page;
      this.loadTopicData(tabInfo);
    },
    async loadTopicData(info) {
      info.loading = true;
      const { data, total } = await topic.list(info.tab, info.page);
      info.data = data;
      info.total = total;
      info.loading = false;
    }
  }
};
</script>

<style lang="stylus" scoped>
.home
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
