<template>
  <div class="review-page">
    <div v-if="vocabulary.length" class="vocab-flashcard container-fluid">
      <card-kids
        :key="currentVocab.id"
        :vocab="currentVocab"
        :current="current"
        :vocab-length="vocabulary.length"
        @nextClick="changeVocab('next')"
        @prevClick="changeVocab('prev')"
      ></card-kids>
    </div>

    <div
      class="container"
      :class="
        current == vocabulary.length - 1
          ? 'btn-flashcard'
          : 'btn-flashcard-empty'
      "
    >
      <div class="d-flex w-100 justify-content-center empty">
        <nuxt-link
          v-show="current == vocabulary.length - 1"
          :to="`/kids/${level}/engder/${categorySlug}/game`"
          class="btn btn-play"
        >
          <img src="~/assets/images/play-btn.png" />
          เล่นเกม
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>
import speech from "speech-js";
import CardKids from "@/components/card/VocabCardKids";
import * as FirebaseService from "@/services/firebase.service";
import { mapGetters } from "vuex";
export default {
  layout: "kids",
  components: { CardKids },
  data() {
    return {
      current: 0,
      vocabulary: [],
      currentVocab: {},
      category: {}
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
        console.log(this.vocabulary);
        this.currentVocab = this.vocabulary[0];
      }
    },
    async changeVocab(stage) {
      if (stage === "next") {
        this.current += 1;
      } else {
        this.current -= 1;
      }
      this.currentVocab = this.vocabulary[this.current];

      speech.synthesis(this.currentVocab.word, "en-US", 1, 0.5, 1);
    }
  }
};
</script>

<style lang="scss" scoped>
.review-page {
  height: calc(100vh - 60px);
  display: flex;
  align-items: center;
  flex-direction: column;

  @include media-breakpoint-down(sm) {
    padding: 0;
    padding-top: 1rem;
  }
}
.vocab-flashcard {
  padding-top: 2rem;
  padding-left: 2.5rem;
  padding-right: 2.5rem;
  // display: flex;
  // flex-direction: row;
  // align-items: center;
  // justify-content: space-between;
  max-width: 680px;
  @include media-breakpoint-down(sm) {
    padding-top: 1rem;
  }
}
.btn-flashcard {
  margin-top: 14px;
  align-items: center;
  max-width: 640px;
  animation: fadeIn 1s;
}
.btn-arrow {
  background: none;
  border: none;
  height: 90px;
  transition: 0.2s;
  animation: fadeIn;
  animation-duration: 1s;
  img {
    width: 100%;
    height: 100%;
  }
  &.next-arrow {
    margin-left: 5px;
  }
  &:hover {
    transform: scale(1.5);
    transition: 0.3s;
  }
}
.btn-play {
  display: flex;
  align-items: center;
  font-size: 24px;
  padding: 5px 15px 5px 15px;
  color: white;
  background: #fba600;
  border: 4px solid #ffffff;
  box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  animation: bounce 2s infinite;
  animation-delay: 1s;

  &:hover {
    background: #ffcd4d;
    animation-play-state: paused;
  }
}
.btn-flashcard-empty {
  align-items: center;
  max-width: 640px;
}
</style>
