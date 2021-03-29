<template>
  <div class="container mt-3">
    <vue-element-loading
      spinner="spinner"
      :active="loading"
      background-color="none"
      color="#f46500"
    />
    <template v-if="categories.length && !messageError">
      <div>
        <div class="text-right">
          <nuxt-link :to="`${level.slug}/add`" class="btn btn-success mb-3">
            Add Category
          </nuxt-link>
        </div>
        <table-category
          :categories="categories"
          @delete-category="deleteCategory($event)"
        />
      </div>
    </template>
    <div v-else-if="messageError" class="empty-stage">
      <div class="h5">{{ messageError }}</div>
      <nuxt-link to="/admin" class="btn btn-link">
        Back to admin home
      </nuxt-link>
    </div>
    <div v-else-if="!categories.length && level.id" class="empty-stage">
      <div class="h5">category for {{ level.name }} not found</div>
      <nuxt-link :to="`${level.slug}/add`" class="btn btn-link">
        add category for {{ level.name }}
      </nuxt-link>
    </div>
  </div>
</template>

<script>
import TableCategory from "~/components/admin/TableCategory.vue";
import * as FirebaseService from "@/services/firebase.service";
export default {
  layout: "admin",
  components: {
    TableCategory
  },
  data() {
    return {
      loading: true,
      categories: [],
      level: {},
      messageError: ""
    };
  },
  computed: {
    slug() {
      return this.$route.params.slug;
    }
  },
  async mounted() {
    this.loading = true;
    await this.loadLevel();
    this.loading = false;
  },
  methods: {
    async loadLevel() {
      if (this.slug) {
        const level = await FirebaseService.getLevelIdBySlug(this.slug);
        console.log("loadCat queryLevel", level);
        if (level.error) {
          this.messageError = level.error;
          return;
        }
        this.level = level;
        await this.loadCategory();
      }
    },
    async loadCategory() {
      const res = await FirebaseService.getCategoryByLevel(this.level);
      this.categories = res;
      console.log(res);
      return;
    },
    async deleteCategory(id) {
      await FirebaseService.deleteCategory(id);
      this.$toast.success("Deleted success", { duration: 3000 });
      await this.loadCategory();
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@/assets/scss/styles/variables";
@import "~@/assets/scss/styles/mixins";
.empty-stage {
  text-align: center;
  border-radius: 1rem;
  margin-top: 1rem;
  padding: 127px 50px;
  @include themed {
    background: tget("nav-background");
  }
}
</style>
