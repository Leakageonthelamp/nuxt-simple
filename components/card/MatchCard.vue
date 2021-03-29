<template>
  <div
    class="flip-container"
    :class="{ flipped: isflipped, matched: ismatched, endcard: isendcard }"
    @click="$emit('cardClicked')"
  >
    <div class="memorycard">
      <div class="front d-flex align-content-center justify-content-center">
        <div class="img-border">
          <img class="shadow" src="~/assets/images/front-card-match-it.png" />
        </div>
      </div>
      <div
        v-if="isimage"
        class="back d-flex align-content-center justify-content-center"
      >
        <div class="img-border">
          <img
            class="background"
            src="~/assets/images/back-cardimg-match-it.png"
          />
          <img class="cardimg" :src="cardimage" />
        </div>
      </div>
      <div
        v-if="!isimage"
        class="back d-flex align-content-center justify-content-center"
      >
        <div class="word-border">
          <img
            class="background"
            src="~/assets/images/back-cardword-match-it.png"
          />
          <div class="word">
            <h1>{{ cardword }}</h1>
            <span>({{ cardpart }})</span>
          </div>
        </div>
      </div>
      <div
        v-if="isimage && isendcard"
        class="back d-flex align-content-center justify-content-center"
      >
        <div class="img-border">
          <img
            class="background"
            src="~/assets/images/back-cardend-match-it.png"
          />
          <img class="cardimg end" :src="cardimage" />
          <div class="word-end">
            <h1>{{ cardword }}</h1>
            <span>({{ cardpart }})</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isflipped: {
      type: Boolean,
      default: false
    },
    ismatched: {
      type: Boolean,
      default: false
    },
    isimage: {
      type: Boolean,
      default: false
    },
    isendcard: {
      type: Boolean,
      default: false
    },
    cardimage: {
      type: String,
      default: ""
    },
    cardword: {
      type: String,
      default: ""
    },
    cardpart: {
      type: String,
      default: ""
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@/assets/scss/styles/variables";
@import "~@/assets/scss/styles/mixins";

.matched {
  transition: 0.5s;
  opacity: 0;
}

.flip-container {
  -webkit-perspective: 1000;
  -moz-perspective: 1000;
  -o-perspective: 1000;
  perspective: 1000;
  min-height: 120px;
  cursor: pointer;
  &.endcard {
    cursor: auto;
  }
}
.front,
.back {
  -webkit-backface-visibility: hidden;
  -moz-backface-visibility: hidden;
  -o-backface-visibility: hidden;
  backface-visibility: hidden;
  -webkit-transition: 0.6s;
  -webkit-transform-style: preserve-3d;
  -moz-transition: 0.6s;
  -moz-transform-style: preserve-3d;
  -o-transition: 0.6s;
  -o-transform-style: preserve-3d;
  -ms-transition: 0.6s;
  -ms-transform-style: preserve-3d;
  transition: 0.6s;
  transform-style: preserve-3d;
  top: 0;
  left: 0;
  width: 100%;
}
.back {
  -webkit-transform: rotateY(-180deg);
  -moz-transform: rotateY(-180deg);
  -o-transform: rotateY(-180deg);
  -ms-transform: rotateY(-180deg);
  transform: rotateY(-180deg);
  position: absolute;

  .img-border {
    display: flex;
    align-items: center;
    justify-content: center;
    .background {
      width: 148px;
      height: 226px;
      border: 4px solid #ffffff;
      box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.25);
      border-radius: 14px;
    }
    .cardimg {
      position: absolute;
      max-width: 80%;
      max-height: 110px;
      &.end {
        top: 20px;
      }
    }
    .word-end {
      position: absolute;
      top: 138px;
      max-width: 130px;
      text-align: center;
      h1 {
        margin: 0;
        font-size: 20px;
        line-height: 1.2;
        color: white;
      }
      span {
        font-size: 16px;
        color: black;
      }
    }
  }

  .word-border {
    display: flex;
    align-items: center;
    justify-content: center;
    .background {
      width: 148px;
      height: 226px;
      border: 4px solid #ffffff;
      box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.25);
      border-radius: 14px;
    }
    .word {
      position: absolute;
      text-align: center;
      max-width: 135px;
      h1 {
        margin: 0;
        font-size: 20px;
        line-height: 1.2;
        color: white;
      }
      span {
        font-size: 16px;
        color: black;
      }
    }
  }
}
.front .img-border {
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    border: 4px solid #ffffff;
    box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.25);
    border-radius: 14px;
    width: 148px;
    height: 226px;
  }
}

.flip-container.flipped .back {
  -webkit-transform: rotateY(0deg);
  -moz-transform: rotateY(0deg);
  -o-transform: rotateY(0deg);
  -ms-transform: rotateY(0deg);
  transform: rotateY(0deg);
  transition: 0.5s;
}
.flip-container.flipped .front {
  -webkit-transform: rotateY(180deg);
  -moz-transform: rotateY(180deg);
  -o-transform: rotateY(180deg);
  -ms-transform: rotateY(180deg);
  transform: rotateY(180deg);
}
</style>
