<template>
  <BaseLayout>
    <!-- 关于 -->
    <template #aside>
      <div class="panel about">
        <div class="header">
          <span>关于</span>
        </div>
        <div class="inner">
          <p>CNode：Node.js专业中文社区</p>
          <p>在这里你可以：</p>
          <ul>
            <li>向别人提出你遇到的问题</li>
            <li>帮助遇到问题的人</li>
            <li>分享自己的知识</li>
            <li>和其它人一起进步</li>
          </ul>
        </div>
      </div>
    </template>

    <!-- 注册表单 -->
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

<style lang="stylus">
.about
  p
    font-size 14px
  ul
    padding 0
    margin 0 0 10px 25px
    li
      list-style-type disc
</style>
