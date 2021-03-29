<template>
  <div class="container game-page">
    <loading v-if="isLoading" />
    <template v-if="randomVocab.length">
      <div class="game-box">
        <div class="row circle-header">
          <div class="col-sm circle-blox animated zoomIn">
            <div
              v-for="(vocab, index) in randomVocab"
              :key="`bullet-${vocab.id}`"
              class="circle-color"
              :class="{
                current: current === index && currentBullet,
                currentC:
                  current - 1 === index && vocab.isCorrect && !currentBullet,
                currentW:
                  current - 1 === index &&
                  vocab.isCorrect === false &&
                  !currentBullet,
                correct: vocab.isCorrect,
                wrong: vocab.isCorrect === false
              }"
            >
              {{ index + 1 }}
            </div>
          </div>
        </div>

        <div v-if="isEnd && !isCorrect && !isWrong">
          <div class="card-vocab ani-bounce">
            <div class="card-header-score">
              Finish !
            </div>
            <div class="card-body-score">
              Your Score :
              <div class="card-score" :class="scoreColor()">
                {{ result }} / {{ limitVocab }}
              </div>
            </div>
          </div>
          <div class="button-select-score animated zoomIn">
            <nuxt-link
              :to="linkBack ? `/?level=${linkBack}` : '/'"
              class="btn-backhome mr-4"
            >
              <img src="~/assets/images/home-game-icon@1.5x.png" class="mr-1" />
              Back to home
            </nuxt-link>
            <button
              class="btn-playagian ml-4"
              type="button"
              @click="restartGame"
            >
              <img
                src="~/assets/images/restart-game-icon@1.5x.png"
                class="mr-2"
              />
              Play Again
            </button>
          </div>
        </div>

        <div v-if="!isEnd">
          <div
            v-if="!isCorrect && !isWrong"
            id="drag-1"
            class="card-vocab draggable"
            :class="{
              isAnimating: isInteractAnimating,
              isOut: !isInteractAnimating
            }"
            :style="{ transform: transformString }"
          >
            <div class="card-header">
              {{ randomVocab[current].word }}
              <span>({{ randomVocab[current].partOfSpeech }})</span>
            </div>
            <div class="card-body">
              {{ randomVocab[current].definition }}
            </div>
          </div>
        </div>

        <div v-if="!isEnd">
          <div v-if="!isInteractAnimating" class="card-selected">
            <div class="card-body-next">
              <span v-if="!isEmpty">{{ randomVocab[current + 1].word }}</span>
            </div>
          </div>
        </div>

        <div v-if="isCorrect" class="card-vocab">
          <div class="card-header-correct animated fadeIn">
            {{ randomVocab[current - 1].word }}
            <span>({{ randomVocab[current - 1].partOfSpeech }})</span>
          </div>
          <div class="card-body-check animated fadeIn">
            <div class="button-select-check">
              <div class="btn-check btn-yes">
                <img src="~/assets/images/Correct_icon@X1.png" />
              </div>
            </div>
            <!-- In decision for show or hide definition when
            answer is correct

               {{ randomVocab[current - 1].definition }}
                -->
          </div>
        </div>

        <div v-if="isWrong" class="card-vocab">
          <div class="card-header-wrong animated fadeIn">
            {{ randomVocab[current - 1].word }}
            <span>({{ randomVocab[current - 1].partOfSpeech }})</span>
          </div>
          <div class="card-body-check animated fadeIn">
            <div class="button-select-check">
              <div class="btn-check btn-no">
                <img src="~/assets/images/Wrong_icon@X1.png" />
              </div>
            </div>
            {{ randomVocab[current - 1].definition }}
          </div>
        </div>

        <div v-if="!isEnd">
          <div
            v-if="!isCorrect && !isWrong"
            class="button-select animated fadeIn"
          >
            <button
              class="btn btn-check btn-no"
              type="button"
              @click="checkResult('no')"
            >
              <img src="~/assets/images/Wrong_icon@X1.png" />
            </button>
            <button
              class="btn btn-check btn-yes"
              type="button"
              @click="checkResult('yes')"
            >
              <img src="~/assets/images/Correct_icon@X1.png" />
            </button>
          </div>
        </div>
        <div
          v-if="isCorrect || isWrong"
          class="button-select-empty animated fadeIn"
        >
          <div class="btn-check btn-no disabled"></div>
          <div class="btn-check btn-yes disabled"></div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import Loading from "@/components/Loading";
import * as FirebaseService from "@/services/firebase.service";
import _ from "lodash";
import interact from "interactjs";
import { mapGetters } from "vuex";
export default {
  static: {
    interactMaxRotation: 20,
    interactOutOfSightXCoordinate: 500,
    interactOutOfSightYCoordinate: 600,
    interactYThreshold: 800,
    interactXThreshold: 200
  },
  components: { Loading },
  data() {
    return {
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
      currentBullet: true,

      isInteractAnimating: true,
      isInteractDragged: null,
      interactPosition: {
        x: 0,
        y: 0,
        rotation: 0
      },
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
    isEnd() {
      return !(this.current < this.limitVocab);
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
    },
    // movecardXRigth() {
    //   // eslint-disable-next-line
    //   const { x, y } = this.interactPosition;
    //   if (x >= 0) return true;
    //   else return false;
    // },
    // movecardXLeft() {
    //   // eslint-disable-next-line
    //   const { x, y } = this.interactPosition;
    //   if (x < 0) return true;
    //   else return false;
    // }
    ...mapGetters({
      user: "getUser",
      linkBack: "getQueryLevel",
      classId: "getClassId"
    })
  },
  async mounted() {
    await this.initGame();
    if (process.client) {
      this.initAnimating();
    }

    if (this.category.slug) {
      const payload = {
        email: this.user,
        type: "game",
        level: this.category.name,
        lesson: this.category.level.name,
        classId: this.classId
      };
      console.log(payload);
      await this.$axios.$post("engder/start", payload);
    }
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
    },

    interactSetPosition(coordinates) {
      const { x = 0, y = 0, rotation = 0 } = coordinates;
      this.interactPosition = { x, y, rotation };
    },

    resetCardPosition() {
      this.interactSetPosition({ x: 0, y: 0, rotation: 0 });
    },

    async initGame() {
      this.isLoading = true;
      await this.getAllVocab();
      await this.shuffleVocab();
      this.getAllVocab();
      this.isLoading = false;
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
        this.category = data;
        this.vocabData = data.vocab;
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
          definition: notMatchShuffled[index].definition
        };
        return obj;
      });
      this.randomVocab = await _.shuffle(test[0].concat(notMatch));
      this.randomVocab.map(vocab => {
        console.log(vocab.isCorrect);
      });
    },
    async checkResult(answer) {
      const correct = this.groupVocab.find(
        ({ id }) => id === this.randomVocab[this.current].id
      );
      if (
        answer === "yes" &&
        this.randomVocab[this.current].definition === correct.definition
      ) {
        this.result += 1;
        this.randomVocab[this.current].isCorrect = true;
        this.isCorrect = true;
        this.currentBullet = false;
        setTimeout(
          () => ((this.isCorrect = false), (this.currentBullet = true)),
          1500
        );
      } else if (
        answer === "no" &&
        this.randomVocab[this.current].definition !== correct.definition
      ) {
        this.result += 1;
        this.randomVocab[this.current].isCorrect = true;
        this.isCorrect = true;
        this.currentBullet = false;
        setTimeout(
          () => ((this.isCorrect = false), (this.currentBullet = true)),
          1500
        );
      } else {
        this.randomVocab[this.current].isCorrect = false;
        this.isWrong = true;
        this.currentBullet = false;
        setTimeout(
          () => ((this.isWrong = false), (this.currentBullet = true)),
          3000
        );
      }
      this.current += 1;
      if (this.current === this.limitVocab) {
        const payload = {
          email: this.user,
          lesson: this.category.name,
          level: this.category.level.name,
          score: this.result,
          classId: this.classId
        };
        await this.$axios.$post("engder/score", payload);
      }
      this.resetCardPosition();
    },
    showAnswer() {
      this.isCorrect = false;
    },
    async restartGame() {
      this.getAllVocab();
      this.shuffleVocab();
      this.current = 0;
      this.result = 0;
    },
    scoreColor() {
      if (this.result <= this.limitVocab / 3) {
        return { scoreLow: true };
      }
      if (this.result <= (this.limitVocab / 3) * 2) {
        return { scoreMid: true };
      }
      if (this.result <= (this.limitVocab / 3) * 3) {
        return { scoreHigh: true };
      }
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
  width: 100%;
  max-width: 640px;
}
@media screen and (max-width: 575px) {
  .isOut {
    width: 95%;
    max-width: 100%;
  }
}
@media screen and (max-width: 767px) {
  .isOut {
    max-width: 510px;
  }
}

.card-selected {
  font-size: 10px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  border-radius: 12px;
  @include primary-box-shadow;

  .card-body-next {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    background: white;
    height: 370px;
    border-radius: 12px;
    padding: 2rem;
    z-index: -1;
    @include font-size(2em);
    @include themed {
      background: tget("card-background");
    }

    span {
      font-weight: bold;
      font-size: 42px;
      @include themed {
        color: tget("font-color");
      }
    }
  }

  @media screen and (max-width: 420px) {
    .card-body-next {
      height: 420px;
    }
  }
}

.game-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 140px);
}
.game-box {
  width: 100%;
  max-width: 640px;
}
.card-vocab {
  font-size: 10px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  border-radius: 12px;
  animation: zoomIn;
  animation-duration: 1s;
  @include primary-box-shadow;
  .card-header {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 120px;
    background: #ffb820;
    // border: 4px solid;
    // border-color: linear-gradient(#743ad5, #d53a9d);
    box-sizing: border-box;
    border-radius: 12px 12px 0 0;
    @include font-weight(bold);
    @include font-size(3.5em);
    @include themed {
      // border: 8px solid tget("card-background");
      background: tget("primary-color");
    }
    span {
      margin-left: 5px;
      color: white;
      font-size: 28px;
    }
  }

  .card-header-score {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 120px;
    color: white;
    background: #ffb820;
    border: 4px solid #ffffff;
    box-sizing: border-box;
    border-radius: 12px 12px 0 0;
    @include font-weight(bold);
    @include font-size(3.5em);
    @include themed {
      border: 4px solid tget("card-background");
      background: tget("primary-color");
    }

    span {
      margin-left: 5px;
      color: white;
      font-size: 28px;
    }
  }

  .card-header-correct {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 120px;
    background: #6fcf97;
    border: 4px solid #ffffff;
    box-sizing: border-box;
    border-radius: 12px 12px 0 0;
    animation-duration: 2s;
    @include font-weight(bold);
    @include font-size(3.5em);
    @include themed {
      border: 4px solid tget("card-background");
      background: tget("correct-color");
    }

    span {
      margin-left: 5px;
      color: white;
      font-size: 28px;
    }
  }

  .card-header-wrong {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 120px;
    background: #ef7171;
    border: 4px solid #ffffff;
    box-sizing: border-box;
    border-radius: 12px 12px 0 0;
    animation-duration: 1s;
    @include font-weight(bold);
    @include font-size(3.5em);
    @include themed {
      border: 4px solid tget("card-background");
      background: tget("wrong-color");
    }

    span {
      margin-left: 5px;
      color: white;
      font-size: 28px;
    }
  }

  .card-body {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    background: white;
    height: 250px;
    border-radius: 0 0 12px 12px;
    padding: 2rem;
    @include font-size(2em);
    @include themed {
      background: tget("card-background");
    }
  }

  .card-body-score {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    background: white;
    height: 250px;
    border-radius: 0 0 12px 12px;
    padding: 2rem;
    font-weight: bold;
    @include font-size(3em);
    @include themed {
      background: tget("card-background");
    }
  }

  .card-body-check {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    flex-direction: column;
    background: white;
    height: 250px;
    border-radius: 0 0 12px 12px;
    padding: 2rem;
    @include font-size(2em);
    @include themed {
      background: tget("card-background");
    }
  }
  @media screen and (max-width: 420px) {
    .card-body {
      height: 300px;
    }
    .card-body-score {
      height: 300px;
    }
    .card-body-check {
      height: 300px;
    }
  }
}

.button-select {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  margin-top: 25px;
  .btn-check {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: #6fcf97;
    border: 2px solid #ffffff;
    box-sizing: border-box;
    box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.1);
    @include themed {
      border: 2px solid tget("card-background");
    }

    &:hover {
      transform: scale(1.5);
    }
    &.btn-yes {
      transition: 0.5s;
      background: #6fcf97;
      @include themed {
        background-color: tget("correct-color");
      }
    }
    &.btn-no {
      transition: 0.5s;
      background: #ef7171;
      @include themed {
        background-color: tget("wrong-color");
      }
    }
  }
  @media screen and (max-width: 420px) {
    .btn-check:hover {
      transform: none;
    }
  }
}

.button-select-score {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 25px;

  .btn-playagian {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 50px;
    width: 180px;
    margin-bottom: 30px;
    font-weight: 500;
    font-size: 20px;
    color: white;
    background: #ffb820;
    border: none;
    border-radius: 4px;
    transition: 0.3s;
    @include themed {
      background-color: tget("primary-color");
    }

    &:hover {
      background: #f4761e;
      @include themed {
        background-color: tget("primary-color-hover");
      }
    }
  }
  .btn-backhome {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 50px;
    width: 180px;
    margin-bottom: 30px;
    font-weight: 500;
    font-size: 20px;
    color: #f46500;
    background: #f8ede5;
    border: none;
    border-radius: 4px;
    transition: 0.3s;
    @include themed {
      background: tget("bullet-game-color");
    }

    &:hover {
      background: #e8cbb7;
      @include themed {
        background: tget("bullet-game-color-hover");
      }
    }
  }
  @media screen and (max-width: 420px) {
    .btn-backhome {
      font-size: 18px;
      margin-right: -0.5rem !important;
    }
    .btn-playagian {
      font-size: 18px;
    }
  }
}

.button-select-check-correct {
  display: flex;
  align-items: center;
  justify-content: center;
  .btn-check {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: #6fcf97;
    border: 2px solid #ffffff;
    box-sizing: border-box;
    box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.1);
    @include themed {
      border: 2px solid tget("card-background");
    }

    &.btn-yes {
      transition: 0.5s;
      background: #6fcf97;
      @include themed {
        background-color: tget("correct-color");
      }
    }
  }
}

.button-select-check {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 25px;
  margin-top: -35px;
  .btn-check {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: #6fcf97;
    border: 2px solid #ffffff;
    box-sizing: border-box;
    box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.1);
    @include themed {
      border: 2px solid tget("card-background");
    }

    &.btn-yes {
      transition: 0.5s;
      background: #6fcf97;
      @include themed {
        background-color: tget("correct-color");
      }
    }
    &.btn-no {
      transition: 0.5s;
      background: #ef7171;
      @include themed {
        background-color: tget("wrong-color");
      }
    }
  }
  @media screen and (max-width: 420px) {
    &:hover {
      transform: none;
    }
  }
}

.button-select-empty {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  margin-top: 25px;
  color: transparent;
  .btn-check {
    width: 80px;
    height: 80px;
    background: transparent;
    box-sizing: border-box;
  }
}

.circle-header {
  margin-top: 10px;
  margin-bottom: 20px;
  justify-content: center;
  transition: 1s;
}

.circle-blox {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 1s;
}

.circle-color {
  height: 16px;
  width: 16px;
  border-radius: 50%;
  font-size: 10px;
  font-weight: 500;
  display: inline-block;
  color: lightgray;
  background-color: lightgray;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 10px;
  margin-right: 10px;
  animation-duration: 2s;
  @include themed {
    background-color: tget("bullet-game-color");
    color: tget("bullet-game-color");
  }

  &.correct {
    color: #6fcf97;
    background-color: #6fcf97;
    transition: 0.5s;
    @include themed {
      color: tget("correct-color");
      background-color: tget("correct-color");
    }
  }
  &.wrong {
    color: #ef7171;
    background-color: #ef7171;
    transition: 0.5s;
    @include themed {
      color: tget("wrong-color");
      background-color: tget("wrong-color");
    }
  }

  &.current {
    margin-left: 10px;
    margin-right: 10px;
    color: white;
    background: #ffb820;
    font-weight: bold;
    transform: scale(2);
    transition: 0.5s;
    @include themed {
      background: tget("primary-color");
    }
  }

  &.currentC {
    margin-left: 10px;
    margin-right: 10px;
    color: white;
    background: #6fcf97;
    font-weight: bold;
    transform: scale(2);
    transition: 1s;
    @include themed {
      background-color: tget("correct-color");
      color: white;
    }
  }

  &.currentW {
    margin-left: 10px;
    margin-right: 10px;
    color: white;
    background: #ef7171;
    font-weight: bold;
    transform: scale(2);
    transition: 1s;
    @include themed {
      background-color: tget("wrong-color");
      color: white;
    }
  }
}

@media screen and (max-width: 420px) {
  .circle-color {
    margin-left: 8px;
    margin-right: 8px;
  }
}

.card-score {
  margin-left: 10px;
  @include font-size(1.3em);
  font-weight: bold;
}
.scoreLow {
  color: #ef7171;
  @include themed {
    color: tget("wrong-color");
  }
}
.scoreMid {
  color: #ffb082;
  @include themed {
    color: tget("primary-color");
  }
}
.scoreHigh {
  color: #6fcf97;
  @include themed {
    color: tget("correct-color");
  }
}

.ani-bounce {
  animation: bounceIn;
  animation-duration: 1s;
}
</style>
