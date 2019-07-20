<template>
  <BaseLayout>
    <!-- 边栏 -->
    <template #aside>
      <!-- Markdown提示信息 -->
      <div class="reference panel">
        <div class="header">
          <span>Markdown 语法参考</span>
        </div>
        <div class="inner">
          <ol>
            <li><tt>### 单行的标题</tt></li>
            <li><tt>**粗体**</tt></li>
            <li><tt>`console.log('行内代码')`</tt></li>
            <li><tt>```js\n code \n```</tt> 标记代码块</li>
            <li><tt>[内容](链接)</tt></li>
            <li><tt>![文字说明](图片链接)</tt></li>
          </ol>
          <span>
            <a href="https://segmentfault.com/markdown" target="_blank"
              >Markdown 文档</a
            >
          </span>
        </div>
      </div>

      <!-- 发帖指南 -->
      <div class="guide panel">
        <div class="header">
          话题发布指南
        </div>
        <div class="inner">
          <ol>
            <li>尽量把话题要点浓缩到标题里</li>
            <li>
              代码含义和报错可在
              <a href="http://segmentfault.com/t/node.js">SegmentFault</a> 提问
            </li>
          </ol>
        </div>
      </div>
    </template>

    <!-- 内容 -->
    <!-- 这是2.6后的v-slot="content"写法，需要在外面套一个template，#content是简写方式 -->
    <template #content>
      <slot name="default"></slot>
    </template>
    <!-- 这是2.6之前的slot="content"写法，用来将default这个slot的内容向下传递到content这个slot，已经废弃了 -->
    <!-- <slot name="default" slot="content"></slot> -->
  </BaseLayout>
</template>

<script>
import BaseLayout from "@/layouts/BaseLayout.vue";

export default {
  components: {
    BaseLayout
  }
};
</script>

<style lang="stylus"></style>
