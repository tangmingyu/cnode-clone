<template>
  <CommonLayout :user="currentUser">
    <div class="about panel">
      <div class="header">
        关于
      </div>

      <div class="inner">
        <h1>This is an about page</h1>
        <p>总要写点什么吧</p>
      </div>
    </div>
  </CommonLayout>
</template>

<script>
import CommonLayout from "@/layouts/CommonLayout.vue";
import { mapState } from "vuex";

export default {
  name: "about",
  components: {
    CommonLayout
  },
  computed: {
    ...mapState({
      currentUser: state => state.sign.currentUser
    })
  }
};
</script>
