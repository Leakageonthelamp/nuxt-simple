<template>
  <nav class="navbar navbar-light bg-light">
    <a class="navbar-brand" href="/admin">
      <img
        src="~/assets/images/english-der-logo.png"
        width="30"
        height="30"
        alt=""
      />
      <strong>Admin</strong>
    </a>
    <span>
      <a href="/">Home</a>
      <a href="/admin" @click="signOut">Sign out</a>
    </span>
  </nav>
</template>

<script>
export default {
  name: "AdminHeader",
  methods: {
    signOut() {
      this.$firebase
        .auth()
        .signOut()
        .then(() => {
          this.user = null;
        })
        .catch(err => console.log(err));
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@/assets/scss/styles/variables";
@import "~@/assets/scss/styles/mixins";
label {
  color: #f46500cf;
  display: flex;
  justify-content: center;
}
a {
  padding-right: 10px;
  color: #f46500cf;
}
strong {
  padding-left: 0.3rem;
  padding-top: 5px;
}
.navbar {
  display: flex;
  justify-content: space-between;
  box-shadow: 0 2px 6px -2px rgba(0, 0, 0, 0.15);
  @include themed {
    background: tget("nav-background");
  }
}
.navbar-brand {
  color: #f46500cf;
}
</style>
