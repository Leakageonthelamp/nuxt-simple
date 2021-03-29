<template>
  <div>
    <!-- <nav-bar :link-back="queryLevel ? `/kids/${queryLevel}` : '/'" /> -->
    <div class="main">
      <nuxt />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
// import NavBar from "~/components/DefaultNavbar.vue";
export default {
  //   components: { NavBar },
  computed: {
    ...mapGetters({
      queryLevel: "getQueryLevel"
    })
  },
  async mounted() {
    document.body.classList.add("theme--kids");
    if (this.$route.query.user) {
      await this.$store.commit("setUser", this.$route.query.user);
    }

    if (this.$route.query.classId) {
      await this.$store.commit("setClassId", this.$route.query.classId);
    }
  }
};
</script>
<style lang="scss" scoped>
.main {
  max-width: 100%;
  min-height: 100vh;
  overflow: hidden;
  // padding-top: 60px;
  display: flex;
  flex-direction: column;
  // background: -webkit-linear-gradient(70deg, #f46500 30%, rgba(0, 0, 0, 0) 30%),
  //   -webkit-linear-gradient(150deg, #ffb820 60%, rgb(36, 106, 187) 60%);
  // background: -o-linear-gradient(70deg, #f46500 30%, rgba(0, 0, 0, 0) 30%),
  //   -o-linear-gradient(150deg, #ffb820 60%, rgb(36, 106, 187) 60%);
  // background: -moz-linear-gradient(70deg, #f46500 30%, rgba(0, 0, 0, 0) 30%),
  //   -moz-linear-gradient(150deg, #ffb820 60%, rgb(36, 106, 187) 60%);
  // background: linear-gradient(70deg, #f46500 30%, rgba(0, 0, 0, 0) 30%),
  //   linear-gradient(150deg, #ffb820 60%, rgb(36, 106, 187) 60%);
}
</style>
