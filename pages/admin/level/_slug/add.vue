<template>
  <div class="container">
    <vue-element-loading
      :active="loading"
      spinner="spinner"
      background-color="none"
      color="#f46500"
    />
    <category-editor
      v-if="allLevel.length > 0"
      :all-level="allLevel"
      :level-slug="levelSlug"
      :category="category"
      :is-category="!!categoryId"
      @add-category="addCategory($event)"
      @upload-vocab="addVocabulary"
    ></category-editor>
  </div>
</template>

<script>
import CategoryEditor from "~/components/admin/CategoryEditor.vue";
import * as FirebaseService from "~/services/firebase.service";
export default {
  layout: "admin",
  components: { CategoryEditor },
  data() {
    return {
      loading: false,
      categoryId: null,
      category: {
        name: null,
        image: null
      },
      allLevel: []
    };
  },
  computed: {
    levelSlug() {
      return this.$route.params.slug;
    }
  },
  mounted() {
    this.getListOfLevel();
  },
  methods: {
    async getListOfLevel() {
      this.allLevel = await FirebaseService.getListLevel();
    },
    async addCategory(payload) {
      this.loading = true;
      const res = await FirebaseService.addCategory(payload);
      this.categoryId = res.id;
      this.loading = false;
    },
    async addVocabulary({ tableData }) {
      this.loading = true;
      await Promise.all(
        tableData.map(async vocab => {
          await FirebaseService.addVocabByCategory(this.categoryId, vocab);
          return "success";
        })
      );
      this.$toast.success("add vocab success", { duration: 3000 });
      this.$router.push(`category/${this.categoryId}`);
      this.loading = false;
    }
  }
};
</script>
