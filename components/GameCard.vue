<template>
  <div class="card-game">
    <p>
      <strong>{{ vocab.word }}</strong>
    </p>
    <p class="text-sub">({{ vocab.partOfSpeech }})</p>
    <div ref="cardEl" class="card">
      <img
        ref="cardEl"
        class="img-vocab"
        :style="`display: ${showImage(choice.picture)};`"
        :src="vocab.picture"
        alt=""
      />
      <p>{{ choice.definition }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "GameCard",
  props: ["vocab", "choice"],
  mounted() {
    this.initHammer();
  },
  methods: {
    initHammer() {
      if (process.browser) {
        const Hammer = require("hammerjs");
        const card = this.$refs.cardEl;
        const mc = new Hammer(card);
        mc.add(
          new Hammer.Pan({ direction: Hammer.DIRECTION_ALL, threshold: 0 })
        );
        var lastPosX = 0;
        var lastPosY = 0;
        var isDragging = false;

        mc.on("pan", ev => {
          if (isDragging) {
            isDragging = true;
            lastPosX = card.offsetLeft;
            lastPosY = card.offsetTop;
          }
          var posX = ev.deltaX + lastPosX;
          var posY = ev.deltaY + lastPosY;

          card.style.left = posX + "px";
          card.style.top = posY + "px";

          if (ev.isFinal) {
            isDragging = false;
            card.style.left = 0;
            card.style.top = 0;
            if (posX > 100) {
              this.$emit("onSwipe", "yes");
            } else if (posX < -100) {
              this.$emit("onSwipe", "no");
            }
          }
        });
      }
    },
    showImage(img) {
      if (img) {
        return "flex";
      } else {
        return "none";
      }
    }
  }
};
</script>

<style scoped>
.text-sub {
  text-transform: lowercase;
  margin-bottom: 1rem;
  color: #ffb820;
}
.card {
  height: 60%;
  text-align: center;
  margin: 1rem;
  box-shadow: 0 3px 4px rgba(0, 0, 0, 0.15);
  border-radius: 1.25rem;
  display: flex;
  justify-content: center;
}
.img-vocab {
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 1.25rem;
  z-index: 1;
}
.card p {
  margin-left: 5%;
  margin-right: 5%;
  margin-bottom: 0;
}
.card-game {
  font-size: 20px;
  display: flex;
  flex-direction: column;
  position: fixed;
  width: 100%;
  height: 70%;
  justify-content: center;
  overflow: hidden;
  text-align: center;
}
.card-game strong {
  color: #ffb820;
  font-size: 28px;
}

/* // Extra small devices (portrait phones, less than 576px) */
@media (max-width: 575.98px) {
  .card-game {
    font-size: 16px;
    padding-left: 10%;
    padding-right: 10%;
  }
}

/* // Small devices (landscape phones, 576px and up) */
@media (min-width: 576px) and (max-width: 767.98px) {
  .card-game {
    padding-left: 20%;
    padding-right: 20%;
  }
}

/* // Medium devices (tablets, 768px and up) */
@media (min-width: 768px) and (max-width: 991.98px) {
  .card-game {
    padding-left: 25%;
    padding-right: 25%;
  }
}

/* // Large devices (desktops, 992px and up) */
@media (min-width: 992px) and (max-width: 1199.98px) {
  .card-game {
    padding-left: 30%;
    padding-right: 30%;
  }
}

/* // Extra large devices (large desktops, 1200px and up) */
@media (min-width: 1200px) and (max-width: 1199.98px) {
  .card-game {
    padding-left: 30%;
    padding-right: 30%;
  }
}
@media (min-width: 1200px) {
  .card-game {
    padding-left: 30%;
    padding-right: 30%;
  }
}
</style>
