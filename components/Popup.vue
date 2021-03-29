<template>
  <transition name="fade-pop">
    <section v-show="active" class="bg" :class="isCenter ? 'popup-center' : ''">
      <div class="overlay" @click="clickOutSide"></div>
      <div class="popup-box" :style="{ maxWidth: `${width}px` }">
        <div v-if="this.$slots.head" class="popup-head">
          <div class="d-flex justify-content-between align-items-center">
            <slot name="head">
              <h3 class="m-0">
                <img v-if="icon" :src="icon" class="pr-1" alt="" />
                {{ title }}
              </h3>
            </slot>
            <button
              v-if="isCloseButton"
              class="btn close-btn btn-link p-0 d-flex align-items-center justify-content-center"
              @click="close"
            >
              <!-- <img src="~@/assets/img/svg/close-icon.svg" width="12" /> -->
            </button>
          </div>
        </div>
        <div v-if="body" ref="body" class="popup-body">
          <slot name="body"></slot>
        </div>
        <div v-if="this.$slots.foot" class="popup-foot">
          <slot name="foot"></slot>
        </div>
      </div>
    </section>
  </transition>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: "Title"
    },
    icon: {
      type: String,
      default: null
    },
    head: {
      type: Boolean,
      default: true
    },
    body: {
      type: Boolean,
      default: true
    },
    foot: {
      type: Boolean,
      default: true
    },
    width: {
      type: Number,
      default: 410
    },
    isCenter: {
      type: Boolean,
      default: false
    },
    isCloseButton: {
      type: Boolean,
      default: true
    },
    canClose: {
      type: Boolean,
      default: true
    },
    resetScrollOnClose: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    active: false
  }),
  methods: {
    clickOutSide() {
      if (this.canClose) {
        this.close();
      }
    },
    close() {
      if (this.active) {
        if (this.resetScrollOnClose) {
          this.scrollToTop();
        }
        this.active = false;
        this.$unfreezeScrollPosition();
        this.$emit("on-close");
      }
    },
    open() {
      if (!this.active) {
        this.active = true;
        this.$freezeScrollPosition();
      }
    },
    scrollToTop() {
      this.$refs.body.scrollTop = 0;
    }
  }
};
</script>

<style lang="scss" scoped>
.bg {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: $z-index-popup;
  background: rgba(0, 0, 0, 0.65);
  @include media-breakpoint-up(md) {
    align-items: center;
    background: rgba(0, 0, 0, 0.65);
  }
  .popup-box {
    width: 100%;
    bottom: 0;
    z-index: 9;
    max-height: 90%;
    font-size: 10px;
    border-radius: $popup-br $popup-br 0 0;
    overflow: hidden;
    position: relative;
    display: flex;
    flex-direction: column;
    margin: 10px;
    margin-bottom: 0;
    @include primary-box-shadow;
    max-width: 410px;
    @include media-breakpoint-up(md) {
      border-radius: $popup-br;
      // max-width: 410px;
    }
    color: #343434;
    .popup-head {
      position: relative;
      background: #fcfcfc;
      // border-radius: 1.4rem 1.4rem 0 0;
      // padding: 1rem;
      padding: 17px 15px 13px 15px;
      border-bottom: 1px solid #f4f4f4;
      @include font-weight(regular);
      @include font-size(1.18rem);
      img {
        vertical-align: text-top;
        height: 1.3rem;
      }
    }
    .popup-body {
      background: $pure-white;
      padding: 1rem;
      overflow: hidden;
      overflow-y: auto;
      position: relative;
      display: flex;
      flex-direction: column;
      max-height: 90vh;
      @include media-breakpoint-up(md) {
        border-top: 1px solid #f4f4f4;
        margin-top: -1px;
      }
    }
    .popup-foot {
      // padding: 0.6rem 1rem;
      padding: 15px;
      background: #fcfcfc;
      border-top: 1px solid #f3f3f3;
      @include media-breakpoint-up(md) {
        // border-radius: 0 0 1.4rem 1.4rem;
      }
      .btn {
        @include font-weight(regular);
      }
      .btn-link {
        color: #6b6b6b;
      }
    }
  }

  &.popup-center {
    align-items: center !important;
    .popup-box {
      border-radius: $popup-br;
    }
  }
}
.close-btn {
  width: 30px;
  height: 30px;
}
.overlay {
  position: absolute;
  width: 100%;
  height: 100%;
}

.fade-pop-enter-active,
.fade-pop-leave-active {
  transition: opacity $primary-tc 0.35s;
  .popup-box {
    transition: transform $primary-tc 0.35s;
  }
}
.fade-pop-enter,
.fade-pop-leave-to {
  opacity: 0;

  .popup-box {
    transform: translate3d(0, 300px, 0) scale3d(1.1, 1.1, 1);
  }
}

@include media-breakpoint-up(md) {
  .fade-pop-enter-active,
  .fade-pop-leave-active {
    transition: all $primary-tc 0.2s;
    .popup-box {
      transition: all $primary-tc 0.2s;
    }
  }
  .fade-pop-enter,
  .fade-pop-leave-to {
    opacity: 0;

    .popup-box {
      transform: scale3d(1.15, 1.15, 1);
    }
  }
}
</style>
