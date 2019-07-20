<template>
  <EditTopicLayout>
    <div class="topic-edit panel">
      <div class="header">发布话题</div>
      <div class="inner">
        <!-- 板块 -->
        <label for="tab">板块</label>
        <select name="tab" id="tab" v-model="tab">
          <option value="请选择">请选择</option>
          <option v-for="[tab, name] in newTopicTabs" :key="tab" :value="tab">
            {{ name }}
          </option>
        </select>

        <!-- 标题 -->
        <label for="title">标题</label>
        <input type="text" name="title" id="title" v-model="title" />

        <!-- markdown编辑器 -->
        <label>正文</label>
        <MarkdownEditor v-model="content" />
      </div>
      <div class="footer">
        <!-- 提交 -->
        <button @click.stop="submit">提交</button>
      </div>
    </div>
  </EditTopicLayout>
</template>

<script>
import EditTopicLayout from "@/layouts/EditTopicLayout.vue";
import MarkdownEditor from "@/components/MarkdownEditor/MarkdownEditor.vue";
import { mapGetters } from "vuex";

import topic from "@/api/topic";

export default {
  name: "topic-edit",
  components: {
    EditTopicLayout,
    MarkdownEditor
  },
  props: {
    topicId: String
  },
  data() {
    return {
      tab: "",
      title: "",
      content: ""
    };
  },
  computed: {
    ...mapGetters({
      newTopicTabs: "app/newTopicTabs"
    })
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
      if (this.topicId) {
        // 编辑主题, 加载数据
        this.topic = await topic.info(this.topicId);
        this.tab = this.topic.tab;
        this.title = this.topic.title;
        this.content = this.topic.content;
      }
    },
    submit() {
      if (this.topicId || this.topic) {
        this.updateTopic();
      } else {
        this.createTopic();
      }
    },
    async createTopic() {
      const { topicId } = await topic.create(
        this.tab,
        this.title,
        this.content
      );
      this.topicId = topicId;
      // this.$router.push(`/topic/${topic._id}`);
    },
    async updateTopic() {
      await topic.update(this.topicId, this.tab, this.title, this.content);
      // this.$router.push(`/topic/${topic._id}`);
    }
  }
};
</script>

<style lang="stylus" scoped>
.topic-edit
  button
    width auto
    margin 0
</style>
