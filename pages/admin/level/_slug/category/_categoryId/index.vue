<template>
  <section>
    <div class="container">
      <vue-element-loading
        :active="isLoading"
        spinner="spinner"
        background-color="none"
        color="#f46500"
      />
      <div
        v-if="categoryData.name"
        class="d-flex justify-content-between mb-3 align-items-end"
      >
        <div class="d-flex flex-column">
          <strong class="h4">Category name: {{ categoryData.name }}</strong>
          <strong class="h4">Level: {{ categoryData.level.name }}</strong>
          <strong class="h4">
            <span>link:</span>
            <a :href="linkCategory" target="_blank">{{ linkCategory }}</a>
          </strong>
        </div>
        <div>
          <nuxt-link :to="`${categoryId}/edit`" class="btn btn-primary"
            >Add word excel</nuxt-link
          >
          <nuxt-link :to="`${categoryId}/add-vocab`" class="btn btn-primary"
            >Add new word</nuxt-link
          >
        </div>
      </div>
      <view-vocab
        v-if="categoryData.name"
        :vocabs="categoryData.vocab"
        @delete-vocab="deleteVocab($event)"
      />
    </div>
  </section>
</template>

<script>
import ViewVocab from "~/components/ViewVocab.vue";
import * as FirebaseService from "~/services/firebase.service";

export default {
  layout: "admin",
  components: {
    ViewVocab
  },
  data() {
    return {
      isLoading: true,
      categoryData: {}
    };
  },
  computed: {
    categoryId() {
      return this.$route.params.categoryId;
    },
    isKids() {
      const regex = /kids/gm;
      return (
        !!this.categoryData.name &&
        RegExp(regex).test(this.categoryData.level.slug)
      );
    },
    linkCategory() {
      if (this.isKids)
        return `https://engder.globish.co.th/kids/${this.categoryData.level.slug}`;
      else return `https://engder.globishco.th/${this.categoryData.level.slug}`;
    }
  },
  async mounted() {
    await this.loadVocab();
  },
  methods: {
    async loadVocab() {
      this.isLoading = true;
      const { data, error } = await FirebaseService.getVocabularyById(
        this.categoryId
      );
      if (error) return;
      else this.categoryData = data;
      this.isLoading = false;
    },
    async deleteVocab(vocabId) {
      await FirebaseService.deleteVocab(this.categoryId, vocabId);
      await this.loadVocab();
      this.$toast.success("Delete success", { duration: 3000 });
    }
  }
};
</script>

<style scoped></style>
