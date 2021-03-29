<template>
  <div class="card-vocab">
    <div ref="cardEl" class="card">
      <div class="card-head">
        <!-- <img :style="showImage(vocab.picture)" class="image-vocab" :src="vocab.picture" alt="" /> -->
        <!-- <img class="image-default" src="../assets/images/loading-placeholder-image.png"> -->
      </div>
      <div class="card-body">
        <h1 class="word">{{ vocab.word }}</h1>
        <!-- <strong class="text-center">Parts of speech</strong> -->
        <p class="text-pos text-center">{{ vocab.partOfSpeech }}</p>
        <strong>Definition</strong>
        <p class="text-def">{{ vocab.definition }}</p>
        <strong>Example</strong>
        <p class="text-sentence">{{ vocab.sentence }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "VocabCard",
  props: ["vocab", "nextVocab"],
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
            if (posX < -100) {
              // console.log(ev);
              this.$emit("onSwipe", "back");
            } else if (posX > 100) {
              // console.log(ev);
              this.$emit("onSwipe", "next");
            }
          }
        });
      }
    },
    showImage(img) {
      var str = "display: relative;";
      if (img == "") {
        str = "display: absolute;";
      }
      return str;
    }
  }
};
</script>

<style scoped>
.card-vocab {
  display: flex;
  position: fixed;
  width: 100%;
  height: 50%;
  padding-top: 10%;
  justify-content: center;
  overflow: hidden;
}
.card {
  display: flex;
  justify-content: center;
  margin: 5%;
  width: 100%;
  border-radius: 1.25rem;
  border: none;
  background: #303030;
  color: white;
  box-shadow: 0 3px 4px rgba(0, 0, 0, 0.15);
}
.card .card-head {
  display: flex;
  width: 100%;
  height: 10%;
  overflow: hidden;
  justify-content: center;
  align-items: center;
  background-color: #ffb820;
  border-radius: 1.25rem 1.25rem 0 0;
}
.image-default {
  position: absolute;
  z-index: 0;
}
.image-vocab {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-top-left-radius: 1.25rem;
  border-top-right-radius: 1.25rem;
  z-index: 1;
}
.card-body {
  padding-top: 3%;
  display: flex;
  flex-direction: column;
  border-radius: 0 0 1.25rem 1.25rem;
}
p {
  margin-bottom: 0.5rem;
}
.word {
  text-align: center;
  text-transform: capitalize;
}
.text-pos {
  margin-top: 5%;
}
.text-pos,
.text-def,
.text-sentence {
  text-align: left;
  margin-bottom: 5%;
}

@media (max-width: 499.98px) {
  .card-vocab {
    padding-left: 5%;
    padding-right: 5%;
  }
}

/* // Extra small devices (portrait phones, less than 576px) */
@media (min-width: 500px) and (max-width: 575.98px) {
  .card-vocab {
    padding-left: 15%;
    padding-right: 15%;
  }
}

/* // Small devices (landscape phones, 576px and up) */
@media (min-width: 576px) and (max-width: 767.98px) {
  .card-vocab {
    padding-left: 20%;
    padding-right: 20%;
  }
}

/* // Medium devices (tablets, 768px and up) */
@media (min-width: 768px) and (max-width: 991.98px) {
  .card-vocab {
    padding-left: 28%;
    padding-right: 28%;
  }
}

/* // Large devices (desktops, 992px and up) */
@media (min-width: 992px) and (max-width: 1199.98px) {
  .card-vocab {
    padding-left: 30%;
    padding-right: 30%;
  }
}

/* // Extra large devices (large desktops, 1200px and up) */
@media (min-width: 1200px) and (max-width: 1139.98px) {
  .card-vocab {
    padding-left: 30%;
    padding-right: 30%;
  }
}
@media (min-width: 1200px) {
  .card-vocab {
    padding-left: 35%;
    padding-right: 35%;
  }
}

@media (min-height: 400px) and (max-height: 600px) {
  .card {
    margin-top: 0%;
  }
  .card-vocab {
    padding-top: 5%;
    height: 90%;
  }
  .text-pos {
    margin-top: 0%;
    margin-bottom: 0%;
  }
  .word {
    font-size: 2rem;
  }
}
@media (min-height: 600px) {
  .card {
    margin-top: 10%;
    margin-bottom: 10%;
  }
  .card-vocab {
    padding-top: 5%;
    height: 80%;
  }
}
</style>
