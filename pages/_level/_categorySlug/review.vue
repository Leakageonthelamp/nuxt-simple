<template>
  <div class="review-page">
    <div v-if="vocabulary.length" v-swiper="swiperOption">
      <div class="swiper-wrapper p-3">
        <div v-for="vocab in vocabulary" :key="vocab.id" class="swiper-slide">
          <vocab-card :vocab="vocab"></vocab-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VocabCard from "@/components/card/VocabCard";
import * as FirebaseService from "@/services/firebase.service";
import { mapGetters } from "vuex";
export default {
  components: { VocabCard },
  data() {
    return {
      category: {},
      vocabulary: [],
      swiperOption: {
        slidesPerView: 1.5,
        centeredSlides: true,
        spaceBetween: 20,
        keyboard: {
          enabled: true,
          onlyInViewport: false
        },
        breakpoints: {
          420: {
            slidesPerView: 1.5,
            spaceBetween: 20
          },
          576: {
            slidesPerView: 2,
            spaceBetween: 30
          },
          768: {
            slidesPerView: 3,
            spaceBetween: 20
          },
          992: {
            slidesPerView: 4,
            spaceBetween: 30
          },
          1200: {
            slidesPerView: 4,
            spaceBetween: 40
          },
          2000: {
            slidesPerView: 4,
            spaceBetween: 50
          }
        },
        pagination: {
          el: ".swiper-pagination",
          clickable: true
        },
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev"
        }
      }
    };
  },
  computed: {
    level() {
      return this.$route.params.level;
    },
    categorySlug() {
      return this.$route.params.categorySlug;
    },
    ...mapGetters({
      user: "getUser",
      classId: "getClassId"
    })
  },
  async mounted() {
    await this.getAllVocab();
    if (this.category.slug) {
      const payload = {
        email: this.user,
        type: "review",
        level: this.category.name,
        lesson: this.category.level.name,
        classId: this.classId
      };
      await this.$axios.$post("engder/start", payload);
    }
  },
  methods: {
    async getAllVocab() {
      const { data } = await FirebaseService.getVocabularyBySlug(
        this.level,
        this.categorySlug
      );
      if (data) {
        this.category = data;
        this.vocabulary = data.vocab;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.review-page {
  height: calc(100vh - 120px);
  display: flex;
  align-items: center;
}
</style>

<style lang="scss">
/deep/.swiper-container {
  cursor: pointer;
}
</style>
