<template>
  <BaseLayout>
    <!-- 边栏 -->
    <template #aside>
      <!-- 用户面板 -->
      <UserPanel :user="user" />

      <!-- 推广连接 -->
      <!-- 本月积分榜 -->
      <!-- 友情连接 -->
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
import UserPanel from "@/components/UserPanel/UserPanel.vue";

export default {
  components: {
    BaseLayout,
    UserPanel
  },
  props: {
    user: {
      type: Object
    }
  }
};
</script>

<style lang="stylus"></style>
