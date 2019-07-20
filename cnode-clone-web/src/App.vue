<template>
  <div id="app">
    <Navbar />
    <div id="main">
      <router-view />
    </div>
    <Bottombar />
  </div>
</template>

<script>
import Navbar from "@/components/Navbar/Navbar.vue";
import Bottombar from "@/components/Bottombar/Bottombar.vue";
import { mapState, mapActions } from "vuex";

export default {
  name: "app",
  components: {
    Navbar,
    Bottombar
  },
  computed: {
    ...mapState({
      signed: state => state.sign.signed
    })
  },
  async created() {
    if (this.signed) {
      await this.signInfo();
    }
  },
  methods: {
    ...mapActions({
      signInfo: "sign/signInfo"
    })
  }
};
</script>

<style lang="stylus">
#app
  width 100%
  height 100%
  display flex
  flex-direction column
#main
  width 90%
  max-width 1400px
  min-width 960px
  margin 15px auto
  flex 1 1 400px
</style>
