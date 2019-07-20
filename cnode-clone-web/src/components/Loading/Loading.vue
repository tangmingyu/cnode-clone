<template>
  <div class="loading">
    <div class="mask"></div>
    <span class="text">loading...</span>
  </div>
</template>

<style lang="stylus" scoped>
.loading
  position absolute
  top 0
  bottom 0
  left 0
  right 0
  z-index 100
  .mask
    width 100%
    height 100%
    background-color #ccc
    opacity 0.4
  .text
    display inline-block
    position absolute
    top 50%
    left 50%
    color #999
    font-size 24px
    font-weight 600
    transform translate(-50%, -50%)
</style>
