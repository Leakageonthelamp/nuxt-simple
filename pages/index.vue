<template>
  <section>
    <div class="container">
      <loading v-if="isLoading" />
      <div v-if="categories.length" class="row">
        <div
          v-for="category in categories"
          :key="category.id"
          class="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6"
        >
          <category
            :category="category"
            :description="category.level.name"
            :link-prefix="`/${category.level.slug}/${category.slug}`"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { mapGetters } from "vuex";
import Category from "@/components/Category.vue";
import Loading from "@/components/Loading";
import * as FirebaseService from "@/services/firebase.service";

export default {
  components: {
    Category,
    Loading
  },
  data() {
    return {
      categories: [],
      isLoading: true,
      strKey: null,
      n: null
    };
  },
  computed: {
    ...mapGetters({
      queryLevel: "getQueryLevel"
    })
  },
  async mounted() {
    console.log(this.queryLevel);
    if (!this.queryLevel) {
      await this.$store.commit("setQueryLevel", this.$route.query.level);
    }
    console.log(this.queryLevel);
    await this.loadCat();
    this.isLoading = false;
  },
  methods: {
    async loadCat() {
      if (this.queryLevel) {
        const level = await FirebaseService.getLevelIdBySlug(this.queryLevel);
        console.log("loadCat queryLevel", level);
        if (!level.error) {
          const res = await FirebaseService.getCategoryByLevel(level);
          this.categories = res;
          console.log(res);
          return;
        }
      }
      const res = await FirebaseService.getAllCategories();
      this.categories = res;
      return;
    }
  }
};
</script>
<style scoped>
.container {
  padding-left: 0;
  padding-right: 0;
}
label {
  color: #f46500cf;
  display: flex;
  justify-content: center;
}
a {
  color: #f46500cf;
}
strong {
  padding-left: 0.3rem;
  padding-top: 5px;
}
.navbar {
  display: flex;
  justify-content: center;
}
</style>
