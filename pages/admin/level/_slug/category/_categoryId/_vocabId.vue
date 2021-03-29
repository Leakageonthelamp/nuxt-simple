<template>
  <div class="container">
    <vocab-editor
      v-if="vocab"
      :vocab="vocab"
      :path-storage="`${categoryId}`"
      @update-vocab="updateVocab($event)"
    />
  </div>
</template>

<script>
import VocabEditor from "@/components/admin/VocabEditor.vue";
import * as FirebaseService from "~/services/firebase.service";

export default {
  layout: "admin",
  components: {
    VocabEditor
  },
  data() {
    return {
      vocab: null
    };
  },
  computed: {
    levelSlug() {
      return this.$route.params.slug;
    },
    categoryId() {
      return this.$route.params.categoryId;
    },
    vocabId() {
      return this.$route.params.vocabId;
    }
  },
  mounted() {
    this.loadVocab();
  },
  methods: {
    async loadVocab() {
      const data = await FirebaseService.getVocab(
        this.categoryId,
        this.vocabId
      );
      if (data.exists) {
        this.vocab = data.data();
      }
    },
    async updateVocab(updatedVocab) {
      console.log(updatedVocab);
      await FirebaseService.editVocab(
        this.categoryId,
        this.vocabId,
        updatedVocab
      );
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
