<template>
  <div class="container">
    <vocab-editor
      :is-new-word="true"
      :path-storage="`${categoryId}`"
      @add-vocab="addVocabulary($event)"
    />
  </div>
</template>

<script>
import VocabEditor from "@/components/admin/VocabEditor";
import * as FirebaseService from "~/services/firebase.service";

export default {
  layout: "admin",
  components: {
    VocabEditor
  },
  computed: {
    levelSlug() {
      return this.$route.params.slug;
    },
    categoryId() {
      return this.$route.params.categoryId;
    }
  },
  methods: {
    async addVocabulary(vocab) {
      await FirebaseService.addVocabByCategory(this.categoryId, vocab);
      this.$toast.success("success", { duration: 3000 });
      this.$router.go(-1);
    }
  }
};
</script>

<style scoped>
.container {
  padding-top: 40px;
}

/* // Medium devices (tablets, 768px and up) */
@media (min-width: 768px) and (max-width: 991.98px) {
  .container {
    padding-left: 5%;
    padding-right: 5%;
  }
}

/* // Large devices (desktops, 992px and up) */
@media (min-width: 992px) {
  .container {
    padding-left: 10%;
    padding-right: 10%;
  }
}
</style>
