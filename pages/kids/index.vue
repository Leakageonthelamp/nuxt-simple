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
            :show-button="false"
            :link-prefix="`/kids/${category.slug}`"
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
  layout: "kids",
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
    await this.loadCat();
    this.isLoading = false;
  },
  methods: {
    async loadCat() {
      const allLevel = await FirebaseService.getListLevel();
      const regex = /kids/gm;
      const filter = await allLevel.filter(level => level.slug.match(regex));
      console.log(filter);
      this.categories = filter;
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
