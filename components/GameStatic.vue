<template>
  <div class="score-page">
    <div class="thophy-box">
      <div class="img-box" :class="type">
        <img :src="require(`@/assets/images/${image}.png`)" height="125px" />
        <div v-if="!type" class="title">Best Score</div>
        <div v-if="type" class="title" :class="type">Recent Score</div>
      </div>
    </div>
    <div class="score-box">
      <div v-if="date" class="card-box">
        <div v-if="game == 'engder'" class="lit score">
          <div class="title">Score</div>
          {{ animatedCountScore }}
        </div>
        <div v-if="game != 'engder'" class="lit flip">
          <div class="title">Flip</div>
          {{ animatedCountScore }}
        </div>
        <div class="lit time">
          <div class="title">Time</div>
          {{ totalTime }} m
        </div>
      </div>
      <div v-if="!date" class="card-box">
        <div v-if="game == 'engder'" class="lit score">
          <div class="title">Score</div>
          N/A
        </div>
        <div v-if="game != 'engder'" class="lit flip">
          <div class="title">Flip</div>
          N/A
        </div>
        <div class="lit time">
          <div class="title">Time</div>
          N/A
        </div>
      </div>
      <div v-if="date" class="date">
        <img
          src="@/assets/images/calendar-icon.png"
          class="mr-1"
          height="24px"
        />
        {{ dateFormat }}
      </div>
      <div v-if="!date" class="date">
        <img
          src="@/assets/images/calendar-icon.png"
          class="mr-1"
          height="24px"
        />
        No Data
      </div>
    </div>
  </div>
</template>

<script>
import { gsap } from "gsap";
import moment from "moment";
export default {
  props: {
    game: {
      type: String,
      default: ""
    },
    type: {
      type: String,
      default: ""
    },
    image: {
      type: String,
      default: ""
    },
    score: {
      type: Number,
      default: 0
    },
    totalTime: {
      type: String,
      default: ""
    },
    date: {
      type: String,
      default: ""
    }
  },
  data: () => ({
    initFlipNumber: 0,
    initTime1: "00:00"
  }),
  computed: {
    dateFormat() {
      return moment(this.date).format("LLLL");
    },
    animatedCountScore() {
      return this.initFlipNumber.toFixed(0);
    }
  },
  created() {
    setTimeout(() => this.animateNumber(), 100);
  },
  methods: {
    animateNumber() {
      gsap.to(this.$data, { duration: 2, initFlipNumber: this.score });
      // gsap.to(this.$data, { duration: 2, initTime1: this.totalTime });
    }
  }
};
</script>

<style lang="scss" scoped>
.score-page {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
  padding: 2.5rem 0;
  border-radius: 12px;
  box-shadow: 4px 4px 6px rgba(0, 0, 0, 0.1);
  background: #f8f8f8;

  .thophy-box {
    display: flex;
    justify-content: center;
    margin-bottom: 3rem;
    .img-box {
      //   width: 50%;
      position: relative;
      display: flex;
      justify-content: center;
      padding: 2rem;
      border-radius: 50%;
      border: 4px solid white;
      box-shadow: 0px 5px 6px rgba(0, 0, 0, 0.25);
      background: #7feca0;
      &.recent {
        background: #91b4dd;
      }
      img {
        max-height: 100%;
        max-width: 100%;
      }

      .title {
        position: absolute;
        bottom: -20%;
        font-size: 24px;
        padding: 5px 20px;
        border-radius: 28px;
        background-color: #7feca0;
        color: white;
        border: 4px solid white;
        // box-shadow: 0px 5px 6px rgba(0, 0, 0, 0.25);
        &.recent {
          right: -7%;
          left: -3%;
          background-color: #91b4dd;
        }
      }
    }
  }

  .score-box {
    padding: 0 2rem;
    position: relative;
    display: flex;
    justify-content: center;
    .card-box {
      display: flex;
      align-items: center;
      justify-content: space-around;
      width: 100%;
      border-radius: 24px;
      box-shadow: 4px 4px 6px rgba(0, 0, 0, 0.25);
      background: #e7e7e7;
      padding: 8px 24px;
      padding-bottom: 18px;
      .lit {
        font-size: 28px;
        width: 120px;
        // padding: 0 2rem;
        .title {
          font-size: 20px;
          color: #525252;
        }
        &.score {
          color: #3dc7a8;
          text-align: center;
        }
        &.flip {
          color: #06d0df;
          text-align: center;
        }
        &.time {
          color: #ee950f;
        }
        @include media-breakpoint-down(xs) {
          font-size: 26px;
        }
      }
    }
    .date {
      display: flex;
      align-items: center;
      bottom: -15%;
      left: auto;
      position: absolute;
      padding: 5px 10px;
      border-radius: 12px;
      box-shadow: 4px 4px 6px rgba(0, 0, 0, 0.25);
      background: #d1d0d0;
    }
  }
}
</style>
