<template>
  <div class="md-editor">
    <mavon-editor
      placeholder=" "
      :defaultOpen="editorOpen"
      :editable="editable"
      :toolbarsFlag="editable"
      :value="content"
      :boxShadow="false"
      :subfield="false"
      @change="change"
      :toolbars="{
        bold: true, // 粗体
        italic: true, // 斜体
        header: true, // 标题
        underline: true, // 下划线
        strikethrough: true, // 中划线
        mark: true, // 标记
        quote: true, // 引用
        ol: true, // 有序列表
        ul: true, // 无序列表
        link: true, // 链接
        imagelink: false, // 图片链接
        code: true, // code
        table: true, // 表格
        fullscreen: true, // 全屏编辑
        readmodel: true, // 沉浸式阅读
        help: true, // 帮助
        alignleft: true, // 左对齐
        aligncenter: true, // 居中
        alignright: true, // 右对齐
        preview: true // 预览
      }"
    />
  </div>
</template>

<script>
export default {
  model: {
    prop: "content",
    event: "change"
  },
  props: {
    content: {
      type: String
    },
    editable: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    editorOpen() {
      return this.editable ? "edit" : "preview";
    }
  },
  methods: {
    change(value, renderer) {
      this.$emit("change", value, renderer);
    }
  }
};
</script>

<style lang="stylus" scoped></style>
