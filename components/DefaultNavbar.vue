<template>
  <nav class="navbar bg-light fixed-top">
    <label class="navbar-brand">
      <img
        src="~/assets/images/english-der-logo.png"
        width="30"
        height="30"
        alt=""
      />
      <strong>Engder</strong>
    </label>
    <nuxt-link v-if="$route.name !== 'index'" :to="linkBack"
      ><i class="fas fa-arrow-left"></i> Back</nuxt-link
    >
  </nav>
</template>
<script>
export default {
  props: {
    linkBack: {
      type: String,
      default: "/"
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@/assets/scss/styles/variables";
@import "~@/assets/scss/styles/mixins";
label {
  color: #ff9720;
  display: flex;
  justify-content: center;
}
a {
  position: fixed;
  left: 10px;
  color: #f46500cf;
}
strong {
  padding-left: 0.3rem;
  padding-top: 5px;
}
.navbar {
  display: flex;
  justify-content: center;
  box-shadow: 0 2px 6px -2px rgba(0, 0, 0, 0.15);
  @include themed {
    background: tget("nav-background");
  }
}
</style>
