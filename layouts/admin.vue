<template>
  <div>
    <admin-header />

    <nav v-if="$route.name !== 'admin'" aria-label="breadcrumb">
      <ol class="breadcrumb">
        <li class="breadcrumb-item">
          <nuxt-link to="/admin">Admin</nuxt-link>
        </li>
        <li v-if="levelSlug" class="breadcrumb-item">
          <nuxt-link :to="`/admin/level/${levelSlug}`">{{
            levelSlug
          }}</nuxt-link>
        </li>
        <li v-if="categoryId" class="breadcrumb-item">
          <nuxt-link :to="`/admin/level/${levelSlug}/category/${categoryId}`">
            Category
          </nuxt-link>
        </li>
      </ol>
    </nav>
    <div class="main-content">
      <nuxt />
    </div>
  </div>
</template>

<script>
import AdminHeader from "~/components/admin/AdminHeader.vue";
export default {
  components: { AdminHeader },
  computed: {
    levelSlug() {
      return this.$route.params.slug;
    },
    categoryId() {
      return this.$route.params.categoryId;
    }
  },
  mounted() {
    document.body.classList.add("theme--dark");

    // document.body.classList.add("theme--default");
  }
};
</script>

<style lang="scss">
.main-content {
  max-width: 100%;
  min-height: 100vh;
  overflow: hidden;
  // padding-top: 66px;
  display: flex;
  flex-direction: column;
}
</style>
