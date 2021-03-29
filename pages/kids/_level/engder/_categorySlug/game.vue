<template>
  <div class="game-background">
    <div class="container game-page">
      <loading v-if="isLoading" />
      <template v-if="randomVocab.length">
        <div class="game-box">
          <div class="star-header">
            <div class="star-box">
              <div
                v-for="vocab in randomVocab"
                :key="`star-${vocab.id}`"
                class="empty-star fas fa-star"
                :class="{
                  starcolor: vocab.isCorrect
                }"
              ></div>
            </div>
          </div>

          <template>
            <transition name="card-transition" mode="out-in">
              <div v-if="!isFinal" key="playcard">
                <game-card
                  v-if="!isEnd && !isCorrect && !isWrong"
                  id="drag-1"
                  class="draggable"
                  :class="{
                    isAnimating: isInteractAnimating,
                    isOut: !isInteractAnimating
                  }"
                  :style="{ transform: transformString }"
                  :keyid="randomVocab[current].id"
                  :word="randomVocab[current].word"
                  :part-of-speech="randomVocab[current].partOfSpeech"
                  :image="randomVocab[current].image"
                  :status="isStart ? 'next' : ''"
                  :isshownum="!isNextVocab"
                  :currentnum="current + 1"
                />
                <game-card
                  v-if="isWrong || isCorrect"
                  :word="randomVocab[current - 1].word"
                  :part-of-speech="randomVocab[current - 1].partOfSpeech"
                  :image="randomVocab[current - 1].image"
                  :status="isCorrect ? 'correct' : 'wrong'"
                  :isstar="isCorrect"
                />
                <game-card
                  v-if="!isInteractAnimating"
                  :word="!isEmpty ? randomVocab[current + 1].word : ''"
                  :part-of-speech="
                    !isEmpty
                      ? randomVocab[current + 1].partOfSpeech
                      : 'End Game!!'
                  "
                ></game-card>
              </div>

              <div v-if="isFinal" key="endcard">
                <game-card
                  :islast="isFinal"
                  :status="endcard"
                  :score="result"
                />
              </div>
            </transition>
          </template>

          <!--
           Button template section
          -->

          <template>
            <transition name="btn-transition" mode="out-in">
              <div v-if="!isEnd && !isCorrect && !isWrong" key="playbtn">
                <BtnGamecard
                  @btnno="checkResult('no')"
                  @btnyes="checkResult('yes')"
                />
              </div>

              <div v-if="isFinal" key="endbtn">
                <div class="button-select-score">
                  <nuxt-link
                    :to="linkBack ? `/kids/${linkBack}` : `/kids`"
                    class="btn btn-backhome"
                    @click="restartGame"
                  >
                    <img src="~/assets/images/home2-game-icon.png" />
                    <span>Back to home</span>
                  </nuxt-link>
                  <button
                    class="btn btn-restart"
                    type="button"
                    @click="restartGame"
                  >
                    <img src="~/assets/images/restart2-game-icon.png" />
                    <span>Play again</span>
                  </button>
                </div>
              </div>
            </transition>
          </template>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import Loading from "@/components/Loading";
import GameCard from "@/components/card/GameCard";
import BtnGamecard from "@/components/BtnGamecard";
import interact from "interactjs";
import * as FirebaseService from "@/services/firebase.service";
import _ from "lodash";
import { mapGetters } from "vuex";
export default {
  static: {
    interactMaxRotation: 15,
    interactOutOfSightXCoordinate: 500,
    interactOutOfSightYCoordinate: 600,
    interactYThreshold: 800,
    interactXThreshold: 200
  },
  layout: "kids",
  components: { Loading, GameCard, BtnGamecard },
  data() {
    return {
      catData: {},
      vocabData: [],
      limitVocab: 10,
      groupVocab: [],
      randomVocab: [],
      percentMatch: 0.5,
      current: 0,
      result: 0,
      isLoading: true,
      isCorrect: false,
      isWrong: false,
      isFinal: false,
      isNextVocab: false,
      currentAnswer: null,
      correctAudio: null,
      wrongAudio: null,
      endAudio: null,
      starAudio: null,
      trackId: null,

      isInteractAnimating: true,
      isInteractDragged: null,
      interactPosition: {
        x: 0,
        y: 0,
        rotation: 0
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
    isEnd() {
      return !(this.current < this.limitVocab);
    },
    ...mapGetters({
      user: "getUser",
      linkBack: "getQueryLevel",
      classId: "getClassId"
    }),
    isStart() {
      return !(this.current === 0 && this.isRestart);
    },
    isEmpty() {
      return !(this.current + 1 < this.limitVocab);
    },
    transformString() {
      if (!this.isInteractAnimating || this.isInteractDragged) {
        const { x, y, rotation } = this.interactPosition;
        return `translate3D(${x}px, ${y}px, 0) rotate(${rotation}deg)`;
      }
      return null;
    }
  },
  async mounted() {
    await this.initGame();
    if (process.client) {
      this.initAnimating();
    }
    this.correctAudio = new Audio(
      "https://firebasestorage.googleapis.com/v0/b/engder-nuxt.appspot.com/o/sounds%2FcorrectNewer.mp3?alt=media&token=9ac069d1-1cac-4aa2-9285-e412729edc3b"
    );
    this.wrongAudio = new Audio(
      "https://firebasestorage.googleapis.com/v0/b/engder-nuxt.appspot.com/o/sounds%2Fwrong.mp3?alt=media&token=3549e474-0b4f-425b-b1df-51b662b05e23"
    );
    this.endAudio = new Audio(
      "https://firebasestorage.googleapis.com/v0/b/engder-nuxt.appspot.com/o/sounds%2Fsuccess.mp3?alt=media&token=9cbf535a-8614-4d12-ac8a-ce82f292a8ff"
    );
    this.starAudio = new Audio(
      "https://firebasestorage.googleapis.com/v0/b/engder-nuxt.appspot.com/o/sounds%2FdingNew.mp3?alt=media&token=1618c49e-db4a-45fd-818c-57afaca70da3"
    );
  },
  methods: {
    initAnimating() {
      interact(".draggable").draggable({
        onstart: () => {
          this.isInteractAnimating = false;
        },

        onmove: event => {
          const {
            interactMaxRotation,
            interactXThreshold
          } = this.$options.static;
          const x = this.interactPosition.x + event.dx;
          const y = this.interactPosition.y + event.dy;

          let rotation = interactMaxRotation * (x / interactXThreshold);

          if (rotation > interactMaxRotation) rotation = interactMaxRotation;
          else if (rotation < -interactMaxRotation)
            rotation = -interactMaxRotation;

          this.interactSetPosition({ x, y, rotation });
        },

        onend: () => {
          const { x, y } = this.interactPosition;
          const {
            interactXThreshold,
            interactYThreshold
          } = this.$options.static;
          this.isInteractAnimating = true;

          if (x > interactXThreshold) this.playCard("Accpet");
          else if (x < -interactXThreshold) this.playCard("Reject");
          else if (y > interactYThreshold) this.playCard("Skip");
          else this.resetCardPosition();
        }
      });
    },

    playCard(interaction) {
      const {
        interactOutOfSightXCoordinate,
        interactMaxRotation
      } = this.$options.static;

      switch (interaction) {
        case "Accpet":
          this.interactSetPosition({
            x: interactOutOfSightXCoordinate,
            rotation: interactMaxRotation
          });
          this.checkResult("yes");
          break;
        case "Reject":
          this.interactSetPosition({
            x: -interactOutOfSightXCoordinate,
            rotation: -interactMaxRotation
          });
          this.checkResult("no");
          break;
      }
      this.resetCardPosition();
    },

    interactSetPosition(coordinates) {
      const { x = 0, y = 0, rotation = 0 } = coordinates;
      this.interactPosition = { x, y, rotation };
    },

    resetCardPosition() {
      this.interactSetPosition({ x: 0, y: 0, rotation: 0 });
    },

    async trackStartGame() {
      if (this.catData.slug) {
        const payload = {
          email: this.user,
          type: "game",
          level: this.catData.name,
          lesson: this.catData.level.name,
          classId: this.classId
        };
        const { data } = await this.$axios.$post("engder/start", payload);
        if (data) {
          this.trackId = data.id | null;
        }
      }
    },
    async initGame() {
      this.isLoading = true;
      await this.getAllVocab();
      await this.shuffleVocab();
      this.getAllVocab();
      this.trackStartGame();
      this.isLoading = false;
      this.isNextVocab = true;
      setTimeout(() => (this.isNextVocab = false), 2000);
    },
    async getAllVocab() {
      const { data } = await FirebaseService.getVocabularyBySlug(
        this.level,
        this.categorySlug
      );
      if (data) {
        if (data.vocab.length < this.limitVocab) {
          this.limitVocab = data.vocab.length;
        }
        this.vocabData = data.vocab;
        this.catData = data;
      }
    },
    async shuffleVocab() {
      const shuffled = await _.shuffle(this.vocabData);
      this.groupVocab = shuffled.slice(0, this.limitVocab);
      console.log("groupVocab", this.groupVocab);
      const nMatch = Math.round(this.percentMatch * this.limitVocab);
      const test = await _.chunk(this.groupVocab, nMatch);
      const notMatchShuffled = _.shuffle(test[1]);
      const notMatch = await test[1].map((vocab, index) => {
        const obj = {
          ...vocab,
          image: notMatchShuffled[index].image
        };
        return obj;
      });
      this.randomVocab = await _.shuffle(test[0].concat(notMatch));
    },
    async checkResult(answer) {
      const correct = this.groupVocab.find(
        ({ id }) => id === this.randomVocab[this.current].id
      );
      if (
        answer === "yes" &&
        this.randomVocab[this.current].image === correct.image
      ) {
        this.result += 1;
        this.isCorrect = true;
        this.currentAnswer = true;
        this.correctAudio.play();
        setTimeout(
          () => (
            this.starAudio.play(),
            (this.isCorrect = false),
            (this.randomVocab[this.result - 1].isCorrect = true)
          ),
          2000
        );
      } else if (
        answer === "no" &&
        this.randomVocab[this.current].image !== correct.image
      ) {
        this.result += 1;
        this.isCorrect = true;
        this.currentAnswer = true;
        this.correctAudio.play();
        setTimeout(
          () => (
            this.starAudio.play(),
            (this.isCorrect = false),
            (this.randomVocab[this.result - 1].isCorrect = true)
          ),
          2000
        );
      } else {
        this.isWrong = true;
        this.currentAnswer = false;
        this.wrongAudio.play();
        setTimeout(() => (this.isWrong = false), 2000);
      }

      this.current += 1;

      this.isNextVocab = true;
      setTimeout(() => (this.isNextVocab = false), 3000);

      if (this.current === this.limitVocab) {
        if (this.currentAnswer == true) {
          this.endAudio.play(),
            setTimeout(
              () => (
                (this.randomVocab[this.result - 1].isCorrect = true),
                (this.isFinal = true)
              ),
              1000
            );
        } else {
          this.endAudio.play(), setTimeout(() => (this.isFinal = true), 1000);
        }

        const payload = {
          email: this.user,
          level: this.catData.name,
          lesson: this.catData.level.name,
          score: this.result,
          classId: this.classId,
          trackId: this.trackId
        };
        await this.$axios.$post("engder/score", payload);
      }
      this.resetCardPosition();
    },
    async restartGame() {
      this.getAllVocab();
      this.shuffleVocab();
      this.trackStartGame();
      this.current = 0;
      this.result = 0;
      this.isRestart = true;
      this.isNextVocab = true;
      this.isFinal = false;
      setTimeout(() => (this.isNextVocab = false), 2000);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@/assets/scss/styles/variables";
@import "~@/assets/scss/styles/mixins";
#drag-1 {
  touch-action: none;
  user-select: none;
  cursor: pointer !important;
  -webkit-transform: translate(0px, 0px);
  transform: translate(0px, 0px);
}

.isAnimating {
  transition: transform 1s $ease-out-back;
}
.isOut {
  opacity: 0.5;
  transition-property: opacity;
  transition-duration: 1s;
  position: fixed;
  width: 630px;
}
@media screen and (max-width: 575px) {
  .isOut {
    width: 95%;
  }
}

.game-background {
  background-image: url("~@/assets/images/kids-game-bg-end.svg");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  height: calc(100vh - 60px);
}

.game-page {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  height: 100%;
}

.game-box {
  width: 630px;
}
@media screen and (max-height: 600px) {
  .game-box {
    width: 530px;
  }
  .isOut {
    width: 530px;
  }
}

.star-header {
  margin: 2rem 0;
  padding: 0 2rem;
  justify-content: center;

  .star-box {
    display: flex;
    align-items: center;
    justify-content: center;

    .empty-star {
      font-size: 6vw;
      margin: 0 3px;
      color: lightgray;
      -webkit-text-stroke: 2px #ffffff;
      filter: drop-shadow(2px 2px 6px rgba(0, 0, 0, 0.1));
      animation: swing;
      animation-duration: 2s;

      &.starcolor {
        background: -webkit-linear-gradient(
          120deg,
          #f46500 50%,
          rgba(255, 205, 77, 0.8) 55%
        );
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        animation: bounceIn;
        animation-duration: 2s;
      }
    }

    @include media-breakpoint-up(md) {
      .empty-star {
        font-size: 30px;
        margin: 0 5px;
      }
      .empty-star,
      .starcolor {
        -webkit-text-stroke: 3px #ffffff;
      }
    }
    @include media-breakpoint-up(sm) {
      .empty-star {
        font-size: 5vh;
      }
    }
  }
}

.btn-check {
  width: 140px;
  height: 65px;
  span {
    visibility: hidden;
  }
  img {
    position: absolute;
  }

  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid #ffffff;
  box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.1);
  border-radius: 12px;

  &:hover {
    box-shadow: inset 0px 0px 10px rgba(0, 0, 0, 0.25);
  }

  span {
    margin-left: 8px;
    color: white;
    @include font-size(2em);
  }
  @include media-breakpoint-up(sm) {
    min-width: 234px;
    max-width: 234px;
    span {
      visibility: visible;
    }
    img {
      position: relative;
    }
  }
}

.button-select-score {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  margin-top: 2.5vh;

  .btn-backhome {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 234px;
    height: 66px;
    background: #ffcd4d;
    border: 3px solid #ffffff;
    box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.1);
    border-radius: 12px;

    &:hover {
      box-shadow: inset 0px 0px 8px rgba(0, 0, 0, 0.25);
      background: #e5b845;
    }

    span {
      margin-left: 8px;
      color: white;
      @include font-size(1.5em);
    }
    @media screen and (max-height: 520px) {
      margin-top: 10px;
      .btn-notmatch,
      .btn-match {
        span {
          @include font-size(1.5em);
        }
        img {
          transform: scale(0.8);
        }
      }
    }
  }

  .btn-restart {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 234px;
    height: 66px;
    background: #fba600;
    border: 3px solid #ffffff;
    box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.1);
    border-radius: 12px;

    &:hover {
      box-shadow: inset 0px 0px 8px rgba(0, 0, 0, 0.25);
      background: #e19500;
    }

    span {
      margin-left: 8px;
      color: white;
      @include font-size(1.5em);
    }
  }
}
@media screen and (max-width: 575px) {
  .button-select-score {
    .btn-restart,
    .btn-backhome {
      width: 130px;

      span {
        visibility: hidden;
      }
      img {
        position: absolute;
      }
    }
  }
}

//Vue Transition customize

.card-transition-enter-active {
  animation: bounceIn;
  animation-duration: 1s;
}
.card-transition-leave-active {
  animation: bounceOut;
  animation-duration: 1s;
}
.btn-transition-enter-active {
  animation: zoomIn;
  animation-duration: 1s;
}
.btn-transition-leave-active {
  animation: fadeOut;
  animation-duration: 0.5s;
}
</style>
