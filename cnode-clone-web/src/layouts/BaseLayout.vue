<template>
  <div class="layout">
    <div class="aside">
      <!-- 边栏 -->
      <slot name="aside"></slot>
    </div>
    <div class="content">
      <!-- 内容区 -->
      <slot name="content"></slot>
    </div>
  </div>
</template>

<style lang="stylus" scoped>
.layout
  height 100%
  &::after
    content ''
    display block
    visibility hidden
    height 0
    line-height 0
    clear both
  >.content
    display block
    margin-right 305px
    height 100%
  >.aside
    display block
    float right
    width 290px
</style>
