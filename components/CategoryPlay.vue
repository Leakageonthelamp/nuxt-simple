<template>
  <div class="card-category">
    <div class="header">
      <nuxt-link :to="linkPrefix" class="w-100">
        <img
          v-if="category.image"
          class="image-catcard-img-top"
          :src="category.image"
        />
        <div v-else class="image-text">
          <h1>{{ category.name }}</h1>
        </div>
      </nuxt-link>
      <div class="body-header">
        <div class="content h5">
          {{ category.name }}
          <div v-if="description" class="h6 font-weight-light">
            {{ description }}
          </div>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="body-space">
        <b-card no-body class="card engder overflow-hidden">
          <b-row no-gutters>
            <b-col
              cols="5"
              class="img-container"
              @click="engderModal = !engderModal"
            >
              <div class="img-box">
                <b-card-img
                  src="~/assets/images/engder-logo.png"
                  class="rounded-0"
                ></b-card-img>
              </div>
              <div class="gif-box">
                <b-card-img
                  src="~/assets/images/Gif/engder-clip.gif"
                  class="rounded-0"
                ></b-card-img>
              </div>
            </b-col>
            <b-col cols="7">
              <b-card-body class="p-3">
                <h1>Engder <b-icon icon="back"></b-icon></h1>
                <b-card-text class="mb-2 content-text">
                  Let's review the vocabulary from this lesson with Engder!
                  Select or swipe left or right to answer each question.
                </b-card-text>
                <div class="text-right play-btn">
                  <b-button
                    class="btn-select"
                    pill
                    @click="engderSelectModal = !engderSelectModal"
                  >
                    <b-icon icon="play-fill"></b-icon>
                    Play Engder</b-button
                  >
                </div>
              </b-card-body>
            </b-col>
          </b-row>
        </b-card>

        <b-card no-body class="card engder overflow-hidden">
          <b-row no-gutters>
            <b-col
              cols="5"
              class="img-container"
              @click="reviewModal = !reviewModal"
            >
              <div class="img-box">
                <b-card-img
                  src="~/assets/images/review-logo.png"
                  class="rounded-0"
                ></b-card-img>
              </div>
              <div class="gif-box">
                <b-card-img
                  src="~/assets/images/Gif/review-clip.gif"
                  class="rounded-0"
                ></b-card-img>
              </div>
            </b-col>
            <b-col cols="7">
              <b-card-body class="p-3">
                <h1>Review <b-icon icon="aspect-ratio-fill"></b-icon></h1>
                <b-card-text class="mb-2 content-text">
                  Let's review the vocabulary from this lesson with Review!
                  Listen and try to speak up!
                </b-card-text>
                <div class="text-right play-btn">
                  <b-button
                    class="btn-select"
                    pill
                    @click="reviewSelectModal = !reviewSelectModal"
                  >
                    <b-icon icon="play-fill"></b-icon>
                    Play Review</b-button
                  >
                </div>
              </b-card-body>
            </b-col>
          </b-row>
        </b-card>

        <b-card no-body class="card match-it overflow-hidden">
          <b-row no-gutters>
            <b-col
              cols="5"
              class="img-container"
              @click="matchitModal = !matchitModal"
            >
              <div class="img-box">
                <b-card-img
                  src="~/assets/images/match-it-logo.png"
                  class="rounded-0"
                ></b-card-img>
              </div>
              <div class="gif-box">
                <b-card-img
                  src="~/assets/images/Gif/match-it-clip.gif"
                  class="rounded-0"
                ></b-card-img>
              </div>
            </b-col>
            <b-col cols="7">
              <b-card-body class="p-3">
                <h1>Match-it <b-icon icon="file-check-fill"></b-icon></h1>
                <b-card-text class="mb-2 content-text">
                  Let's match the pictures with the vocabulary from this lesson!
                  The faster you can match, the better!
                </b-card-text>
                <div class="text-right play-btn">
                  <b-button
                    pill
                    class="btn-select"
                    :to="`/kids/${level}/match-it/`"
                  >
                    <b-icon icon="play-fill"></b-icon>
                    Play Match-It</b-button
                  >
                </div>
              </b-card-body>
            </b-col>
          </b-row>
        </b-card>
      </div>
    </div>

    <div class="exp-container">
      <b-modal v-model="engderModal" scrollable size="lg" title="Engder">
        <div class="clip-container">
          <img class="clip" src="~/assets/images/Gif/engder-clip.gif" />
        </div>
        <template v-slot:modal-footer="{}">
          <b-button
            class="btn-engder"
            pill
            @click="engderSelectModal = !engderSelectModal"
          >
            <b-icon icon="view-stacked"></b-icon>
            Select unit</b-button
          >
        </template>
      </b-modal>
      <b-modal v-model="matchitModal" scrollable size="lg" title="Match-it">
        <div class="clip-container">
          <img class="clip" src="~/assets/images/Gif/match-it-clip.gif" />
        </div>
        <template v-slot:modal-footer="{}">
          <b-button class="btn-engder" pill :to="`/kids/${level}/match-it/`">
            <b-icon icon="play-fill"></b-icon>
            Play Match-it</b-button
          >
        </template>
      </b-modal>
      <b-modal v-model="reviewModal" scrollable size="lg" title="Review">
        <div class="clip-container">
          <img class="clip" src="~/assets/images/Gif/review-clip.gif" />
        </div>
        <template v-slot:modal-footer="{}">
          <b-button
            class="btn-engder"
            pill
            @click="reviewSelectModal = !reviewSelectModal"
          >
            <b-icon icon="view-stacked"></b-icon>
            Select Unit</b-button
          >
        </template>
      </b-modal>
      <b-modal
        v-model="reviewSelectModal"
        scrollable
        hide-footer
        size="md"
        title="Review | Select Unit"
      >
        <div v-for="cate in categories" :key="cate.id" class="unit-warpper">
          <div class="unit-select">
            <div class="unit-text">{{ cate.name }}</div>
            <b-button
              class="unit-btn"
              :to="`/kids/${level}/engder/${cate.slug}/review`"
            >
              <b-icon font-scale="2" icon="play-fill"></b-icon>
            </b-button>
          </div>
        </div>
      </b-modal>
      <b-modal
        v-model="engderSelectModal"
        scrollable
        hide-footer
        size="md"
        title="Engder | Select Unit"
      >
        <div v-for="cate in categories" :key="cate.id" class="unit-warpper">
          <div class="unit-select">
            <div class="unit-text">{{ cate.name }}</div>
            <b-button
              class="unit-btn"
              :to="`/kids/${level}/engder/${cate.slug}/game`"
            >
              <b-icon font-scale="2" icon="play-fill"></b-icon>
            </b-button>
          </div>
        </div>
      </b-modal>
    </div>
  </div>
</template>

<script>
import "../plugins/vue-bootvueicon";
export default {
  name: "Category",
  props: {
    category: {
      type: Object,
      required: true
    },
    description: {
      type: String,
      default: ""
    },
    showButton: {
      type: Boolean,
      default: true
    },
    linkPrefix: {
      type: String,
      default: "#"
    },
    level: {
      type: String,
      default: "#"
    },
    categories: {
      type: Array,
      required: true
    }
  },
  data: () => ({
    engderModal: false,
    matchitModal: false,
    reviewModal: false,
    reviewSelectModal: false,
    engderSelectModal: false
  })
};
</script>

<style lang="scss" scoped>
@import "~@/assets/scss/styles/variables";
@import "~@/assets/scss/styles/mixins";
.modal-body {
  .unit-warpper {
    .unit-select {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 1rem;
      border-radius: 12px;
      border: 1px solid rgba(0, 0, 0, 0.1);
      box-shadow: 4px 4px 6px rgba(0, 0, 0, 0.1);
      .unit-text {
        font-size: 24px;
        padding: 1rem;
      }
      .unit-btn {
        color: white;
        padding: 1.15rem 2rem;
        border-radius: 0 12px 12px 0;
        background-image: linear-gradient(
          99deg,
          rgba(255, 166, 0, 1) 14.7%,
          rgba(255, 99, 97, 1) 73%
        );
        &:hover {
          color: black;
          box-shadow: inset 0 0 8px #4f4f4f;
        }
      }
    }
  }
}

.modal-footer {
  transition: 0.5s;
  .btn-engder {
    font-size: 18px;
    padding: 10px 20px;
    color: white;
    background-image: linear-gradient(
      99deg,
      rgba(255, 166, 0, 1) 14.7%,
      rgba(255, 99, 97, 1) 73%
    );
    &:hover {
      color: black;
      transition: 0.5s;
      box-shadow: inset 0 0 8px #4f4f4f;
    }
  }
}

.card-category {
  margin: 0.75rem;
  border-radius: 1rem;
  border: none;
  @include primary-box-shadow;
  @include themed {
    background: tget("card-background");
    color: tget("body-color");
  }
  .header {
    display: flex;
    position: relative;
    width: 100%;
    height: 200px;
    // overflow: hidden;
    .body-header {
      position: absolute;
      bottom: -54px;
      left: 3%;
      width: 94%;
      .content {
        background-image: linear-gradient(
          99deg,
          rgba(255, 166, 0, 1) 14.7%,
          rgba(255, 99, 97, 1) 73%
        );
        color: white;
        border-radius: 12px;
        padding: 10px;
        box-shadow: 4px 4px 6px rgba(0, 0, 0, 0.1);
      }
    }
  }

  .container {
    padding: 3rem 1rem 1rem 1rem;
    .body-space {
      .card {
        margin-top: 1.2rem;
        border-radius: 12px;
        box-shadow: 4px 4px 6px rgba(0, 0, 0, 0.1);
        .img-container {
          display: flex;
          align-items: center;
          background-image: linear-gradient(
            99deg,
            rgba(255, 166, 0, 1) 14.7%,
            rgba(255, 99, 97, 1) 73%
          );
          cursor: pointer;
          .img-box {
            padding: 20px;
            z-index: 1;
            transition: 0.5s;
            img {
              max-width: 100%;
              max-height: 100%;
            }
          }
          .gif-box {
            height: 100%;
            position: absolute;
            transition: 0.5s;
            opacity: 0;
            img {
              max-width: 100%;
              max-height: 100%;
            }
          }
          &:hover {
            .gif-box {
              transition: 0.5s;
              opacity: 100;
            }
            .img-box {
              transition: 0.5s;
              opacity: 0;
            }
          }
        }
        h1 {
          color: rgb(255, 151, 32);
        }
        .content-text {
          letter-spacing: 0.4px;
          font-size: 14px;
        }
        .play-btn {
          transition: 0.5s;
          .btn-select {
            padding: 8px 12px;
            color: white;
            border: 2px solid #ffffff;
            box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.1);
            transition: 0.5s;
            background-image: linear-gradient(
              135deg,
              #fccf31 10%,
              #f55555 100%
            );
            &:hover {
              color: black;
              transition: 0.5s;
              box-shadow: inset 0 0 8px #4f4f4f;
            }
          }
        }
      }
    }
  }
}

img {
  position: relative;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-top-left-radius: 1rem;
  border-top-right-radius: 1rem;
}
.image-text {
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 1rem;
  background: rgb(255, 151, 32);
  border-radius: 1rem 1rem 0 0;
  h1 {
    color: white;
    font-weight: 700;
    text-transform: uppercase;
  }
}
</style>
