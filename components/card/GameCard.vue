<template>
  <div v-if="!islast" :key="keyid" class="card-vocab" :class="status">
    <div v-if="image" class="card-img">
      <transition-group class="img-transition" name="number-list" mode="out-in">
        <div v-if="!isshownum" key="currentnum" class="number-img">
          <span>{{ currentnum }}</span>
        </div>
      </transition-group>
      <img
        v-if="isstar"
        class="img-star"
        src="~@/assets/images/star-score.svg"
      />
      <img key="img" :src="image" />
    </div>
    <div class="card-outer">
      {{ word }}
      <span>({{ partOfSpeech }})</span>
    </div>
  </div>

  <div v-else-if="!isInteractAnimating" class="card-vocab">
    <div class="card-mes">
      <span>Awesome! You earned stars</span>
    </div>
    <div class="card-img-star">
      <img src="~/assets/images/star-score.svg" />
      <span>{{ score }}</span>
    </div>
  </div>

  <div v-else class="card-vocab">
    <div class="card-mes">
      <span>Awesome! You earned stars</span>
    </div>
    <div class="card-img-star">
      <img src="~/assets/images/star-score.svg" />
      <span>{{ score }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    keyid: {
      type: String,
      default: ""
    },
    word: {
      type: String,
      default: ""
    },
    partOfSpeech: {
      type: String,
      default: ""
    },
    image: {
      type: String,
      default: ""
    },
    status: {
      type: String,
      default: ""
    },
    score: {
      type: Number,
      default: null
    },
    islast: {
      type: Boolean,
      default: false
    },
    isshownum: {
      type: Boolean,
      default: false
    },
    currentnum: {
      type: Number,
      default: null
    },
    isstar: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style lang="scss" scoped>
.card-vocab {
  font-size: 10px;
  height: 53vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 15px 15px 0 15px;
  border: 3px solid #ffffff;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.25);
  border-radius: 12px;
  background: linear-gradient(168.16deg, #ffda7d 17.01%, #ffa05c 85.96%);
  &.next {
    animation: zoomIn;
    animation-duration: 1s;
  }
  &.correct {
    background: linear-gradient(178.95deg, #ffda7d 5.47%, #6fcf97 94.87%);

    .card-outer {
      animation: bounce;
      animation-duration: 1s;
    }
  }
  &.wrong {
    background: linear-gradient(178.95deg, #f46500 34.8%, #ffcf88 94.87%);
    .card-outer {
      color: #eb5757;
      animation: wobble;
      animation-duration: 1s;
    }
  }
  .card-outer {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    margin: 5px;
    font-weight: normal;
    color: white;
    // @include font-size(4.5em);
    font-size: 5.5vh;

    span {
      margin-bottom: -10px;
      margin-left: 10px;
      color: black;
      font-weight: normal;
      @include font-size(0.6em);
    }
  }

  .card-img {
    display: flex;
    justify-content: center;
    align-items: center;
    background: white;
    box-shadow: inset 0px 0px 8px rgba(0, 0, 0, 0.25);
    border-radius: 12px;
    height: 40vh;

    img {
      padding: 8px;
      max-width: 100%;
      height: auto;
      max-height: 100%;
    }

    .img-star {
      position: absolute;
      height: 36vh;
      animation: zoomIn;
      animation-duration: 1s;
    }

    .img-transition {
      position: absolute;
      .number-img {
        color: #ffa05c;
        text-shadow: 4px 4px white;
        span {
          font-size: 30vh;
        }
      }
    }
  }

  .card-img-star {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 40vh;

    img {
      margin-left: 25px;
      max-width: 100%;
      max-height: 100%;
      height: auto;
    }

    span {
      position: absolute;
      margin-left: 10px;
      font-size: 8vh;
      color: white;
    }
  }

  .card-mes {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    font-size: 1.6vh;
    span {
      @include font-size(2em);
      color: white;
    }
  }
}

.number-list-leave-active {
  animation: zoomOut;
  animation-duration: 2s;
}
</style>
