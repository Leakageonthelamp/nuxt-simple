<template>
  <div class="progress-bg">
    <div
      class="progress-level"
      :class="{
        level1: levelstage === 3,
        level2: levelstage === 7,
        level3: levelstage === 12
      }"
    ></div>
    <transition-group class="level-transition" name="level-trans">
      <img
        key="level1"
        class="star level1"
        src="~/assets/images/level1-icon-match-it.png"
      />
      <img
        v-if="levelstage === 7 || levelstage === 12"
        key="level2"
        class="star level2"
        src="~/assets/images/level2-icon-match-it.png"
      />
      <img
        v-if="levelstage === 3"
        key="level2-deactivate"
        class="star level2"
        src="~/assets/images/level2-deac-icon.png"
      />
      <img
        v-if="levelstage === 12"
        key="level3"
        class="star level3"
        src="~/assets/images/level3-icon-match-it.png"
      />
      <img
        v-if="levelstage === 3 || levelstage === 7"
        key="level3-deactivate"
        class="star level3"
        src="~/assets/images/level3-deac-icon.png"
      />
    </transition-group>
  </div>
</template>

<script>
export default {
  props: {
    levelstage: {
      type: Number,
      default: 3
    }
  },
  data: () => ({})
};
</script>

<style lang="scss" scoped>
.progress-bg {
  position: relative;
  width: 100%;
  height: 18px;
  border: 2px solid #ffffff;
  box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  background-color: lightgrey;
  .progress-level {
    height: 100%;
    border-radius: 8px;
    transition: 1s;
    &.level1 {
      width: 10%;
      transition: 1s;
      background: linear-gradient(0deg, #27ae60, #27ae60);
    }
    &.level2 {
      width: 50%;
      transition: 1s;
      background: linear-gradient(
        270deg,
        #fbba00 0%,
        #fbba00 60.42%,
        #27ae60 100%
      );
    }
    &.level3 {
      width: 100%;
      transition: 1s;
      background: linear-gradient(
        270deg,
        #eb5757 0%,
        #fbba00 40.1%,
        #fbba00 60.42%,
        #27ae60 100%
      );
    }
  }

  .level-transition {
    .star {
      position: absolute;
      &.level1 {
        transition: 1s;
        top: -200%;
        left: 6%;
      }
      &.level2 {
        transition: 1s;
        top: -200%;
        left: 42%;
      }
      &.level3 {
        transition: 1s;
        top: -200%;
        left: 80%;
      }
      @media screen and (max-width: 690px) {
        &.level1 {
          left: 5%;
        }
        &.level2 {
          left: 40%;
        }
        &.level3 {
          left: 74%;
        }
      }
      @media screen and (max-width: 515px) {
        &.level1 {
          top: -150%;
          left: 5%;
          height: 60px;
          width: 60px;
        }
        &.level2 {
          top: -150%;
          left: 37%;
          height: 60px;
          width: 60px;
        }
        &.level3 {
          top: -150%;
          left: 72%;
          height: 60px;
          width: 60px;
        }
      }
      @media screen and (max-width: 465px) {
        &.level1 {
          top: -150%;
          left: -5%;
          height: 50px;
          width: 50px;
        }
        &.level2 {
          top: -150%;
          left: 31%;
          height: 50px;
          width: 50px;
        }
        &.level3 {
          left: 66%;
          height: 50px;
          width: 50px;
        }
      }
    }
  }
}

.level-trans-enter-active {
  animation: bounce;
  animation-duration: 1s;
}
.level-trans-leave-active {
  animation: zoomOut;
  animation-duration: 1s;
}
</style>
