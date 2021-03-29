<template>
  <div id="page" class="game-page" @scroll="pageScroll">
    <loading v-if="isLoading" />
    <template v-if="vocabData.length">
      <div class="container-fluid">
        <div class="row justify-content-center">
          <div class="col-sm-12 info-area">
            <div
              v-if="isBottom"
              class="btn auto-scroll-btn up"
              @click="scrollToTop()"
            >
              <img src="~/assets/images/arrow-down.svg" />
            </div>
            <div
              v-if="isTop && !isDone"
              class="btn auto-scroll-btn down"
              @click="scrollToBottom()"
            >
              <img src="~/assets/images/arrow-down.svg" />
            </div>
            <div class="col-sm-12 game-info">
              <div class="flip">
                <span>Flip : {{ flipNumber }} times</span>
              </div>
              <div class="timer">
                <span>{{ min }} : {{ sec }}</span>
              </div>
              <div class="match">
                <span>Match : {{ result }} / {{ vocabLevel }}</span>
              </div>
            </div>
            <div class="col-sm-12 level">
              <span class="start">Start</span>
              <div class="progress-level">
                <progress-bar :levelstage="vocabLevel" />
              </div>
              <span class="start goal">Goal</span>
            </div>
          </div>

          <div class="col-sm-12">
            <transition-group
              class="card-transition"
              name="card-trans"
              mode="out-in"
            >
              <div
                v-if="!isEndCard"
                key="playcard"
                class="row justify-content-center card-area"
              >
                <memo-card
                  v-for="(card, index) in memoryCards"
                  :key="index"
                  class="col-auto px-2 my-2"
                  :isflipped="card.isFlipped"
                  :ismatched="card.isMatched"
                  :isimage="card.isImage"
                  :cardimage="card.image"
                  :cardword="card.word"
                  :cardpart="card.partOfSpeech"
                  @cardClicked="flipCard(card)"
                />
              </div>
              <div
                v-if="isEndCard && !isDone"
                key="endcard"
                class="row justify-content-center card-area"
              >
                <memo-card
                  v-for="(card, index) in sliceVocabData"
                  :key="index"
                  class="col-auto px-2 my-2"
                  :isflipped="true"
                  :ismatched="false"
                  :isendcard="true"
                  :isimage="true"
                  :cardimage="card.image"
                  :cardword="card.word"
                  :cardpart="card.partOfSpeech"
                />
              </div>
              <div v-if="isDone" key="summary" class="text-area">
                <div class="header1">Awesome!!</div>
                <div class="header2">Perfect match!</div>
                <div class="flip mt-4">Flip : {{ stackFlip }} times</div>
                <div class="time">
                  Total time : {{ stackMin }} Minutes {{ stackSec }} Seconds
                </div>
              </div>
            </transition-group>
          </div>

          <transition-group
            class="btn-transition"
            name="btn-trans"
            mode="out-in"
          >
            <div
              v-if="isEndCard && !isDone"
              key="btn-next"
              class="col-sm-12 btn-next-area"
            >
              <span>Level Complete!!</span>
              <button class="btn next-level-btn" @click="nextLevel()">
                <img src="~/assets/images/play-btn.png" />
                <span>{{ buttonText }}</span>
              </button>
            </div>
            <div v-if="isDone" key="btn-end" class="col-sm-12 btn-end-area">
              <nuxt-link
                :to="linkBack ? `/kids/${linkBack}` : `/kids`"
                class="btn btn-backhome"
              >
                <img class="mr-2" src="~/assets/images/home2-game-icon.png" />
                <span>Back to home</span>
              </nuxt-link>
              <button class="btn btn-playagain" @click="reset()">
                <img
                  class="mr-2"
                  src="~/assets/images/restart2-game-icon.png"
                />
                <span>Play again</span>
              </button>
            </div>
          </transition-group>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import Loading from "@/components/Loading";
import MemoCard from "@/components/card/MatchCard";
import ProgressBar from "@/components/ProgressBar";
import * as FirebaseService from "@/services/firebase.service";
import _ from "lodash";
import { mapGetters } from "vuex";
export default {
  components: { Loading, MemoCard, ProgressBar },
  layout: "kids",
  data: () => ({
    vocabStartArray: 0,
    vocabLevel: 3,
    vocabLevelLimit: 5,
    result: 0,
    flipNumber: 0,
    start: false,
    isDone: false,
    isEndCard: false,
    isTop: true,
    isBottom: false,
    totalTime: {
      minutes: 0,
      seconds: 0
    },
    isLoading: false,
    engGame: false,
    allLevelVocab: [],
    vocabData: [],
    sliceVocabData: [],
    memoryCards: [],
    flippedCards: [],

    buttonText: "Next Level",
    stackTime: {
      minutes: 0,
      seconds: 0
    },
    stackFlip: 0,
    catData: {}
  }),
  computed: {
    level() {
      return this.$route.params.level;
    },
    ...mapGetters({
      user: "getUser",
      linkBack: "getQueryLevel",
      classId: "getClassId"
    }),
    sec() {
      if (this.totalTime.seconds < 10) {
        return "0" + this.totalTime.seconds;
      }
      return this.totalTime.seconds;
    },
    min() {
      if (this.totalTime.minutes < 10) {
        return "0" + this.totalTime.minutes;
      }
      return this.totalTime.minutes;
    },
    stackSec() {
      if (this.stackTime.seconds < 10) {
        return "0" + this.stackTime.seconds;
      }
      return this.stackTime.seconds;
    },
    stackMin() {
      if (this.stackTime.minutes < 10) {
        return "0" + this.stackTime.minutes;
      }
      return this.stackTime.minutes;
    }
  },
  destroyed() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  async mounted() {
    await this.initialize();
    window.addEventListener("scroll", this.handleScroll);

    this.selectAudio = new Audio(
      "https://firebasestorage.googleapis.com/v0/b/engder-globish.appspot.com/o/sounds%2Fselect-card-sfx.mp3?alt=media&token=2eb95498-0bb9-4733-bc46-4774a9692153"
    );
    this.wrongAudio = new Audio(
      "https://firebasestorage.googleapis.com/v0/b/engder-globish.appspot.com/o/sounds%2Fmatch-wrong-sfx.mp3?alt=media&token=5a3ca5a0-ec32-477b-9007-187b0c3cfe10"
    );
    this.correctAudio = new Audio(
      "https://firebasestorage.googleapis.com/v0/b/engder-globish.appspot.com/o/sounds%2Fmatch-correct-sfx.mp3?alt=media&token=f57b5a65-890e-4e39-a66d-5749b9e721e0"
    );
    this.levelAudio = new Audio(
      "https://firebasestorage.googleapis.com/v0/b/engder-globish.appspot.com/o/sounds%2Flevel-complete-sfx.mp3?alt=media&token=d34cb265-03fc-4c1e-9066-6071dcf26139"
    );
    this.nextAudio = new Audio(
      "https://firebasestorage.googleapis.com/v0/b/engder-globish.appspot.com/o/sounds%2Fnext-game-sfx.mp3?alt=media&token=2f7310f8-e257-4c17-bbbc-0cfbb6cf10c5"
    );
    this.endAudio = new Audio(
      "https://firebasestorage.googleapis.com/v0/b/engder-globish.appspot.com/o/sounds%2Fendgame.mp3?alt=media&token=c908ef30-6329-4435-afa4-7e28aa17e254"
    );
  },
  methods: {
    async trackStartGame() {
      if (this.catData.slug) {
        const payload = {
          email: this.user,
          type: "match-it",
          lesson: this.catData.name,
          classId: this.classId
        };
        const { data } = await this.$axios.$post("engder/start", payload);
        if (data) {
          this.trackId = data.id | null;
        }
      }
    },
    async initialize() {
      this.isLoading = true;
      await this.getAllVocab();
      await this.shuffleVocab();
      this.isLoading = false;
    },
    async getAllVocab() {
      const catdata = await FirebaseService.getLevelIdBySlug(this.level);
      const rawData = await FirebaseService.getVocabularyByLevel(this.level);
      if (rawData) {
        const data = await this.filterVocab(rawData);
        this.allLevelVocab = data;
        this.catData = catdata;
      }
    },
    async filterVocab(data) {
      const filterdData = await data.filter(data => {
        const array = data.partOfSpeech;
        return (
          (array === "N.") +
          (array === "V.") +
          (array === "Pron.") +
          (array === "Adj.")
        );
      });
      return filterdData;
    },
    async shuffleVocab() {
      const shuffledvocab = await _.shuffle(this.allLevelVocab);
      console.log(shuffledvocab);
      this.vocabData = shuffledvocab;
      this.sliceShuffledVocab(shuffledvocab);
    },
    async sliceShuffledVocab(array) {
      const sliceVocabData = await _.slice(
        array,
        this.vocabStartArray,
        this.vocabLevel
      );
      this.sliceVocabData = sliceVocabData;
      console.log(this.sliceVocabData);
      const vocabImageShuffle = await _.shuffle(sliceVocabData);
      const vocabWordShuffle = await _.shuffle(sliceVocabData);
      const set1 = await vocabImageShuffle.map(vocab => {
        const obj = {
          ...vocab,
          isImage: true,
          isFlipped: false,
          isMatched: false
        };
        return obj;
      });
      const set2 = await vocabWordShuffle.map(vocab => {
        const obj = {
          ...vocab,
          isImage: false,
          isFlipped: false,
          isMatched: false
        };
        return obj;
      });
      this.memoryCards = _.shuffle(this.memoryCards.concat(set1, set2));
      this.nextAudio.play();
    },
    flipCard(card) {
      if (card.isMatched || card.isFlipped || this.flippedCards.length === 2) {
        return;
      }

      if (!this.start) {
        this.trackStartGame();
        this.startGame();
      }

      card.isFlipped = true;
      this.selectAudio.play();
      this.flipNumber = this.flipNumber + 1;

      if (this.flippedCards.length < 2) {
        this.flippedCards.push(card);
      }
      if (this.flippedCards.length === 2) {
        this.isMatchCheck();
      }
    },
    startGame() {
      this.tick();
      this.interval = setInterval(this.tick, 1000);
      this.start = true;
    },

    tick() {
      if (this.totalTime.seconds !== 59) {
        this.totalTime.seconds++;
        return;
      }

      this.totalTime.minutes++;
      this.totalTime.seconds = 0;
    },
    isMatchCheck() {
      if (this.flippedCards[0].id === this.flippedCards[1].id) {
        setTimeout(() => {
          this.flippedCards.forEach(card => (card.isMatched = true));
          this.flippedCards = [];
          this.result = this.result + 1;
          this.correctAudio.play();
          if (this.memoryCards.every(card => card.isMatched === true)) {
            clearInterval(this.interval);
            if (this.vocabLevel == 12) {
              this.buttonText = "Summary";
            }
            setTimeout(() => {
              this.levelAudio.play();
              this.isEndCard = true;
            }, 1000);
          }
        }, 400);
      } else {
        setTimeout(() => {
          this.wrongAudio.play();
          this.flippedCards.forEach(card => (card.isFlipped = false));
          this.flippedCards = [];
        }, 800);
      }
    },
    async nextLevel() {
      var newVocabStartArray =
        this.vocabStartArray + this.sliceVocabData.length;
      var newVocabLevel = this.vocabLevel + this.sliceVocabData.length + 1;

      if (this.sliceVocabData.length == this.vocabLevelLimit) {
        this.summaryKeep(this.totalTime);
        this.isDone = true;

        const payload = {
          email: this.user,
          lesson: this.catData.name,
          score: this.stackFlip,
          classId: this.classId,
          trackId: this.trackId
        };
        await this.$axios.$post("engder/score", payload);
      } else {
        this.summaryKeep(this.totalTime);
        this.nextAudio.play();
        this.totalTime.minutes = 0;
        this.totalTime.seconds = 0;
        this.flipNumber = 0;
        this.start = false;
        this.isEndCard = false;

        this.vocabStartArray = newVocabStartArray;
        this.vocabLevel = newVocabLevel;
        this.flippedCards = [];
        this.memoryCards = [];
        this.sliceShuffledVocab(this.vocabData);
      }
    },
    async reset() {
      clearInterval(this.interval);
      this.totalTime.minutes = 0;
      this.totalTime.seconds = 0;
      this.start = false;
      this.isDone = false;
      this.isEndCard = false;
      this.flipNumber = 0;
      this.result = 0;
      this.vocabStartArray = 0;
      this.vocabLevel = 3;
      this.stackTime.minutes = 0;
      this.stackTime.seconds = 0;
      this.stackFlip = 0;
      this.flippedCards = [];
      this.memoryCards = [];
      await this.trackStartGame();
      await this.shuffleVocab();
    },
    summaryKeep(time) {
      this.stackTime.minutes = this.stackTime.minutes + time.minutes;
      this.stackTime.seconds = this.stackTime.seconds + time.seconds;
      if (this.stackTime.seconds > 60) {
        this.stackTime.seconds = this.stackTime.seconds - 60;
        this.stackTime.minutes = this.stackTime.minutes + 1;
      }
      this.stackFlip = this.stackFlip + this.flipNumber;
    },
    scrollToTop() {
      var myDiv = document.getElementById("page");
      myDiv.scroll({
        top: 0,
        left: 0,
        behavior: "smooth"
      });
    },
    scrollToBottom() {
      var myDiv = document.getElementById("page");
      myDiv.scroll({
        top: document.body.scrollHeight,
        left: 0,
        behavior: "smooth"
      });
    },
    pageScroll() {
      var myDiv = document.getElementById("page");
      const toppage = myDiv.scrollTop;
      if (toppage < 10) {
        this.isTop = true;
      } else {
        this.isTop = false;
      }
      if (toppage > 10) {
        this.isBottom = true;
      } else {
        this.isBottom = false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@/assets/scss/styles/variables";
@import "~@/assets/scss/styles/mixins";
.game-page {
  height: calc(100vh - 60px);
  // max-height: auto;
  overflow: overlay;
  // display: contents;
  padding: 10px 15px 10px;
  .info-area {
    position: relative;
    margin-bottom: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .auto-scroll-btn {
      position: fixed;
      z-index: 99;
      left: auto;
      bottom: 2%;
      transition: 0.5s;
      &.up {
        img {
          width: 60px;
          height: 60px;
          transform: rotate(180deg);
          border-radius: 50%;
          background-color: white;
          border: 4px solid #ffffff;
        }
      }
      &.down {
        img {
          width: 60px;
          height: 60px;
          transition: 0.5s;
          border-radius: 50%;
          background-color: white;
          border: 4px solid #ffffff;
        }
      }
      &:hover {
        transform: scale(1.2);
        transition: 0.5s;
      }
    }

    .game-info {
      display: flex;
      align-items: flex-end;
      justify-content: center;
      .timer {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 140px;
        height: 60px;
        background: #ffcd4d;
        border: 4px solid #ffffff;
        box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.1);
        border-radius: 12px;
        span {
          color: white;
          font-size: 34px;
        }
      }
      .flip {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 20px;
        width: 220px;
        height: 40px;
        background: #ffcd4d;
        border: 4px solid #ffffff;
        box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.1);
        border-radius: 12px;
        span {
          color: white;
          font-size: 24px;
        }
      }
      .match {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-left: 20px;
        width: 220px;
        height: 40px;
        background: #ffcd4d;
        border: 4px solid #ffffff;
        box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.1);
        border-radius: 12px;
        span {
          color: white;
          font-size: 24px;
        }
      }
      @media screen and (max-width: 690px) {
        .timer span {
          font-size: 4.5vw;
        }
        .match span,
        .flip span {
          font-size: 3vw;
        }
      }
      @media screen and (max-width: 515px) {
        .flip {
          margin-right: 10px;
        }
        .match {
          margin-left: 10px;
        }
        .timer {
          height: 40px;
        }
      }
    }

    .level {
      margin: 25px 0 10px;
      display: flex;
      justify-content: center;
      align-items: center;
      .progress-level {
        width: 500px;
      }
      .start {
        margin: 0 5px 0;
        color: #30af5d;
        font-size: 30px;
        text-shadow: -2px 0 white, 0 2px white, 2px 0 white, 0 -2px white;
        &.goal {
          color: #eb5757;
        }
      }
    }

    .stat {
      color: #ffb821;
      margin-top: 10px;
      font-size: 24px;
      text-shadow: -2px 0 white, 0 2px white, 2px 0 white, 0 -2px white;
    }
  }

  .text-area {
    margin-top: 30px;
    text-align: center;
    font-size: 42px;
    text-shadow: -2px 0 white, 0 2px white, 2px 0 white, 0 -2px white;
    .header1 {
      color: #91b4dd;
    }
    .header2 {
      color: #f2994a;
    }

    .flip,
    .time {
      color: #ffb821;
      font-size: 28px;
    }
  }

  .btn-next-area {
    margin-top: 10px;
    margin-bottom: 100px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    span {
      font-size: 36px;
      color: #f2994a;
      text-shadow: -2px 0 white, 0 2px white, 2px 0 white, 0 -2px white;
    }
    .next-level-btn {
      margin-top: 8px;
      display: flex;
      justify-content: center;
      align-items: center;
      background: #fba600;
      border: 4px solid #ffffff;
      box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.1);
      border-radius: 12px;
      transition: 0.5s;
      span {
        font-size: 24px;
        color: white;
        text-shadow: none;
      }
      &:hover {
        transition: 0.5s;
        transform: scale(1.2);
      }
    }
  }

  .btn-end-area {
    display: flex;
    justify-content: center;
    .btn-playagain,
    .btn-backhome {
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 50px 20px 10px;
      height: 60px;
      width: 240px;
      background: #fba600;
      border: 4px solid #ffffff;
      box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.1);
      border-radius: 12px;
      transition: 0.5s;
      span {
        font-size: 24px;
        color: white;
        text-shadow: none;
      }
      &:hover {
        transform: scale(1.2);
        transition: 0.5s;
      }
    }
    .btn-backhome {
      background: #ffcd4d;
    }
    @media screen and (max-width: 560px) {
      .btn-playagain,
      .btn-backhome {
        width: 150px;
        span {
          display: none;
        }
        img {
          margin-left: 10px;
        }
      }
    }
  }
}

// .card-trans-enter-active {
//   animation: zoomIn;
//   animation-duration: 1s;
// }
.card-trans-enter-active {
  animation: fadeIn;
  animation-duration: 1s;
}
// .card-trans-leave-active {
//   animation: fadeOut;
//   animation-duration: 0.1s;
// }
// .card-trans-enter {
//   animation: fadeOut;
//   animation-duration: 0.5s;
// }
.btn-trans-enter-active {
  animation: zoomIn;
  animation-duration: 1.5s;
}
// .card-trans-leave-active {
//   animation: fadeOut;
//   animation-duration: 0.5s;
// }
</style>
