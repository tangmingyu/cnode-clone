<template>
  <div class="search-box">
    <!-- 搜索框 -->
    <input
      type="text"
      class="query"
      :value="query"
      :class="{ focused: focused }"
      @input="query = $event.target.value"
      @focus="focused = true"
      @blur="focused = false"
      @keyup.enter="go(focusIndex)"
      @keyup.up="onUp"
      @keyup.down="onDown"
    />

    <!-- 提示列表 -->
    <ul class="suggestions" v-if="showSuggestions" @mouseleave="unfocus">
      <li
        class="suggestion"
        v-for="(item, i) in suggestions"
        :key="i"
        :class="{ focused: i === focusIndex }"
        @mousedown="go(i)"
        @mouseenter="focus(i)"
      >
        {{ item }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {
      query: "",
      focused: false,
      focusIndex: -1
    };
  },
  computed: {
    showSuggestions() {
      return this.focused && this.suggestions && this.suggestions.length;
    },
    suggestions() {
      // TODO:
      return ["史蒂芬森的", "栾克军", "丹娜康丽"];
    }
  },
  methods: {
    go(index) {
      // TODO:
      console.log(index);
    },
    onUp() {
      if (this.showSuggestions) {
        if (this.focusIndex > 0) {
          this.focusIndex--;
        } else {
          this.focusIndex = this.suggestions.length - 1;
        }
      }
    },
    onDown() {
      if (this.showSuggestions) {
        if (this.focusIndex < this.suggestions.length - 1) {
          this.focusIndex++;
        } else {
          this.focusIndex = 0;
        }
      }
    },
    focus(i) {
      this.focusIndex = i;
    },
    unfocus() {
      this.focusIndex = -1;
    }
  }
};
</script>

<style lang="stylus" scoped>
.search-box
  display inline-block
  position relative
  vertical-align middle
.query
  display inline-block
  width 180px
  height 2em
  padding-left 2em
  margin 0
  color #000
  font-size 12px
  line-height 2em
  outline none
  border 1px solid #ccc
  border-radius 1em
  cursor text
  background #fff url('../../assets/images/search.svg') 0.5em 0.5em / 1em 1em no-repeat
.suggestions
  position absolute
  top 100%
  left 0
  margin-top 10px
  min-width 100%
  border 1px solid #ccc
  border-radius 5px
  color #000
  text-align left
  background #fff
  z-index 1000
.suggestion
  border-top 1px solid #ccc
  padding 6px 12px
  font-size 12px
  line-height 18px
  cursor pointer
  &.focused
    background-color #80bd01
  &:first-child
    border none
</style>
