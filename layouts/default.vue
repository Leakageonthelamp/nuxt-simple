<template>
  <div>
    <nav-bar :link-back="queryLevel ? `/?level=${queryLevel}` : '/'" />
    <div class="main">
      <nuxt />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import NavBar from "~/components/DefaultNavbar.vue";
export default {
  components: { NavBar },
  computed: {
    ...mapGetters({
      queryLevel: "getQueryLevel"
    })
  },
  async mounted() {
    document.body.classList.add("theme--dark");

    if (this.$route.query.user) {
      await this.$store.commit("setUser", this.$route.query.user);
    }
    if (this.$route.query.classId) {
      await this.$store.commit("setClassId", this.$route.query.classId);
    }
    //document.body.classList.add("theme--default");
  }
};
</script>
<style lang="scss" scoped>
.main {
  max-width: 100%;
  min-height: 100vh;
  overflow: hidden;
  padding-top: 66px;
  display: flex;
  flex-direction: column;
}
</style>
