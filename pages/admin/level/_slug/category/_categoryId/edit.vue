<template>
  <section>
    <div class="container">
      <vue-element-loading
        :active="loading"
        spinner="spinner"
        background-color="none"
        color="#f46500"
      />
      <category-editor
        v-if="category"
        :category="category"
        :all-level="allLevel"
        :is-category="!!categoryId"
        @update-category="updateCategory($event)"
        @upload-vocab="addVocabulary"
      ></category-editor>
    </div>
  </section>
</template>

<script>
import CategoryEditor from "@/components/admin/CategoryEditor";
import * as FirebaseService from "@/services/firebase.service";

export default {
  layout: "admin",
  components: {
    CategoryEditor
  },
  data() {
    return {
      category: null,
      loading: false
    };
  },
  computed: {
    levelSlug() {
      return this.$route.params.slug;
    },
    categoryId() {
      return this.$route.params.categoryId;
    }
  },
  async mounted() {
    await this.getListOfLevel();
    await this.loadCategory();
  },
  methods: {
    async getListOfLevel() {
      this.allLevel = await FirebaseService.getListLevel();
    },
    async loadCategory() {
      const data = await FirebaseService.getCategoryById(this.categoryId);
      if (data.exists) {
        this.category = data.data();
      }
    },
    async updateCategory(payload) {
      this.loading = true;
      await FirebaseService.updateCategory(this.categoryId, payload);
      this.loading = false;
      this.$toast.success("update success", { duration: 3000 });
      this.$router.push(`${this.categoryId}`);
    },
    async addVocabulary({ tableData }) {
      this.loading = true;
      await Promise.all(
        tableData.map(async vocab => {
          await FirebaseService.addVocabByCategory(this.categoryId, vocab);
          return "success";
        })
      );
      this.loading = false;
      this.$toast.success("add vocab success", { duration: 3000 });
      this.$router.push(`${this.categoryId}`);
    }
  }
};
</script>

<style scoped></style>
