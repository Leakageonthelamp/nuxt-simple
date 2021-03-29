<template>
  <div class="stat-layout container">
    <loading v-if="isLoading" />
    <div v-if="!options.length" class="no-data">
      <div class="info-text mb-3">
        Have not yet recorded !! Play some game and comeback later.
      </div>
      <a href="https://app.globish.co.th/" target="_parent">
        <button
          class="btn btn-primary btn-lg d-flex align-items-center"
          style="border-radius: 12px;"
        >
          <img
            class="mr-2"
            src="@/assets/images/back-icon-globish.png"
            height="24px"
          />
          Back to home
        </button>
      </a>
    </div>
    <div v-if="options.length" class="stat-page">
      <div class="header">
        Game Statistics
        <div class="current-show">
          <div class="border">
            <div class="current-stat email">{{ studentEmail }}</div>
          </div>
        </div>
        <transition name="fade">
          <div
            v-if="selectGame == 'engder' || selectGame == 'match-it'"
            class="current-show"
          >
            <div class="border">
              <div class="current-stat">{{ currentStat }}</div>
            </div>
          </div>
        </transition>
      </div>
      <div class="main-body">
        <div class="game-select">
          <div class="dropdown-level">
            <select-kids
              :options="options"
              :lable-name="selectedLevel"
              @selected="dropdownHandle"
            ></select-kids>
          </div>
          <div class="game-selection">
            <div
              class="game engder"
              :class="{
                select: selectGame == 'engder' || isUnitSelect
              }"
              @click="closeModal"
            >
              <img src="~@/assets/images/engder-logo.png" />
            </div>
            <div
              class="game match-it"
              :class="{ select: selectGame == 'match-it' }"
              @click="postToGetMatchIt"
            >
              <img src="~@/assets/images/match-it-logo.png" />
            </div>
          </div>
        </div>
        <div class="info">
          <transition name="fade-slide">
            <div v-if="isUnitSelect" v-click-outside="close" class="selection">
              <select-unit
                @onClick="handleSelectUnit"
                @close="close"
              ></select-unit>
            </div>
          </transition>
          <div class="info-main-page">
            <transition name="fade" mode="out-in">
              <div v-if="!selectGame" key="first" class="no-select-page">
                <div class="img-box">
                  <img src="~@/assets/images/game-stat-logo.png" />
                </div>
              </div>
              <loading v-if="loadingData" key="load" />
              <div
                v-if="selectGame && !loadingData"
                key="second"
                class="select-page"
              >
                <transition name="fade-slide-back" mode="out-in">
                  <div
                    v-if="selectGame == 'match-it'"
                    key="match"
                    class="select-match-it"
                  >
                    <game-static
                      v-if="matchitData.bestScore"
                      :score="matchitData.bestScore.score"
                      :total-time="matchitData.bestScore.time"
                      :date="matchitData.bestScore.datePlay"
                      image="trophy-icon"
                    ></game-static>
                    <game-static
                      v-if="matchitData.recentScore"
                      :score="matchitData.recentScore.score"
                      :total-time="matchitData.recentScore.time"
                      :date="matchitData.recentScore.datePlay"
                      image="recent-play-icon"
                      type="recent"
                    ></game-static>
                    <game-static
                      v-if="!matchitData.bestScore"
                      image="trophy-icon"
                    ></game-static>
                    <game-static
                      v-if="!matchitData.recentScore"
                      image="recent-play-icon"
                      type="recent"
                    ></game-static>
                  </div>
                  <div
                    v-if="selectGame == 'engder'"
                    key="eng"
                    class="select-engder"
                  >
                    <game-static
                      v-if="engderData.bestScore"
                      :score="engderData.bestScore.score"
                      :total-time="engderData.bestScore.time"
                      :date="engderData.bestScore.datePlay"
                      game="engder"
                      image="trophy-icon"
                    ></game-static>
                    <game-static
                      v-if="engderData.recentScore"
                      :score="engderData.recentScore.score"
                      :total-time="engderData.recentScore.time"
                      :date="engderData.recentScore.datePlay"
                      game="engder"
                      image="recent-play-icon"
                      type="recent"
                    ></game-static>
                    <game-static
                      v-if="!engderData.bestScore"
                      game="engder"
                      image="trophy-icon"
                    ></game-static>
                    <game-static
                      v-if="!engderData.recentScore"
                      game="engder"
                      image="recent-play-icon"
                      type="recent"
                    ></game-static>
                  </div>
                </transition>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Loading from "@/components/Loading";
import SelectKids from "@/components/SelectOptionKids";
import GameStatic from "@/components/GameStatic";
import SelectUnit from "@/components/SelectUnit";
// import * as ApiService from "@/services/api.service";
import "vue-transition-expand/dist/vue-transition-expand.css";
export default {
  layout: "kids-none-navbar",
  components: { Loading, SelectKids, GameStatic, SelectUnit },
  data() {
    return {
      isLoading: false,
      loadingData: false,
      studentEmail: "",
      selectGame: "",
      isUnitSelect: false,
      selectedUnit: "",
      selectedLevel: "",
      openState: 0,
      options: [],
      matchitData: {},
      engderData: {}
    };
  },
  computed: {
    currentStat() {
      if (this.selectGame == "match-it") {
        return this.selectGame;
      }
      return this.selectGame + "/" + this.selectedUnit;
    }
  },
  async mounted() {
    await this.init();
  },
  methods: {
    async init() {
      this.isLoading = true;
      this.studentEmail = this.$route.query.email;
      await this.getCourses();
      this.isLoading = false;
    },
    async getCourses() {
      // const res = await ApiService.getStudentCourses(this.studentEmail);
      const payload = {
        email: this.studentEmail
      };
      const { data } = await this.$axios.$get("engder/courses", {
        params: payload
      });
      if (data) {
        console.log(data);
        this.options = data;
        this.selectedLevel = data[0];
      }
    },
    async postToGetMatchIt() {
      this.loadingData = true;
      this.selectGame = "match-it";
      const payload = {
        email: this.studentEmail,
        type: "match-it",
        lesson: this.selectedLevel
      };
      const data = await this.$axios.$get(`engder/score-history`, {
        params: payload
      });
      console.log("postToGetMatchIt", data);
      if (data) {
        this.matchitData = data;
      } else {
        this.matchitData = {};
      }
      this.loadingData = false;
    },
    async postToGetEngder() {
      this.loadingData = true;
      this.selectGame = "engder";
      const payload = {
        email: this.studentEmail,
        type: "game",
        lesson: this.selectedLevel,
        level: this.selectedUnit
      };
      const data = await this.$axios.$get(`engder/score-history`, {
        params: payload
      });
      this.loadingData = false;
      console.log("postToGetEngder", data);
      if (data) {
        this.engderData = data;
      } else {
        this.engderData = {};
      }
    },
    dropdownHandle(value) {
      this.selectedLevel = value;
      this.selectGame = "";
      this.isUnitSelect = false;
    },
    handleSelectUnit(data) {
      this.selectedUnit = data.value;
      this.isUnitSelect = false;
      this.openState = 0;
      this.postToGetEngder();
    },
    closeModal() {
      if (this.isUnitSelect == false && this.openState == 0) {
        this.isUnitSelect = true;
      } else if (this.isUnitSelect == false && this.openState == 1) {
        this.isUnitSelect = true;
      }
    },
    close() {
      if (this.isUnitSelect == true && this.openState == 0) {
        this.openState = 1;
      } else {
        this.isUnitSelect = false;
        this.openState = 0;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.stat-layout {
  max-width: 960px;
  height: 100vh;
  max-height: 150vh;
  overflow: overlay;
  @include media-breakpoint-down(md) {
    max-width: 100%;
    padding: 0;
    margin: 0;
  }

  .no-data {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    .info-text {
      font-size: 20px;
      font-weight: 500;
      padding: 1rem;
      color: white;
      box-shadow: 4px 4px 6px rgba(131, 131, 131, 0.2);
      border-radius: 8px;
      background-color: #ffb821;
    }
    @include media-breakpoint-down(md) {
      margin: 0 1rem;
    }
  }

  .stat-page {
    // height: calc(100vh - 120px);
    margin: 2rem;
    background-color: white;
    box-shadow: 4px 4px 6px rgba(131, 131, 131, 0.2);
    border-radius: 12px;
    @include media-breakpoint-down(md) {
      margin: 2rem 1rem;
    }

    .header {
      padding: 1rem 1.25rem;
      font-size: 24px;
      color: #ffb821;
      border-bottom: 1px solid rgba(131, 131, 131, 0.2);
      display: flex;
      @include media-breakpoint-down(sm) {
        display: block;
      }
      .current-show {
        display: flex;
        margin-left: 0.5rem;
        .border {
          border-radius: 24px;
          color: white;
          background-color: #ffb821;
          .current-stat {
            padding: 0.25rem 1rem;
            font-size: 18px;
            text-transform: capitalize;
            transition: 1s;
            &.email {
              text-transform: initial;
            }
          }
        }
        @include media-breakpoint-down(sm) {
          margin: 0;
          margin-bottom: 0.5rem;
          display: block;
          text-align: center;
        }
      }
    }

    .main-body {
      display: flex;
      @include media-breakpoint-down(sm) {
        display: block;
      }
      .game-select {
        padding: 1.5rem;
        flex: 0 0 38%;
        .game-selection {
          margin-top: 1rem;
          .game {
            height: 130px;
            // width: 270px;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 1rem;
            background: linear-gradient(
              161.23deg,
              #ffda7d 17.01%,
              #ffba35 85.96%
            );
            border: 4px solid #ffffff;
            box-shadow: 0px 5px 5px rgba(131, 131, 131, 0.1);
            border-radius: 12px;
            cursor: pointer;

            img {
              max-width: 100%;
              max-height: 100%;
            }
            &.select {
              background: #e0e0e0;
              border: 4px solid #f2c94c;
            }
            &:hover {
              background: #e0e0e0;
              border: 4px solid #f2c94c;
            }
            &.match-it {
              margin-top: 0.5rem;
            }
          }
        }
      }

      .info {
        display: flex;
        position: relative;
        display: flex;
        justify-content: center;
        width: 100%;
        .selection {
          position: absolute;
          z-index: 1;
          margin: 2rem 0;
          padding-right: 2rem;
          top: 0;
          right: auto;
          @include media-breakpoint-down(sm) {
            margin: 1rem 0;
            padding: 0 2rem;
          }
        }
        .info-main-page {
          width: 100%;
          .no-select-page {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 620px;
            @include media-breakpoint-down(sm) {
              display: none;
            }
            .img-box {
              width: 50%;
              img {
                max-width: 100%;
                max-height: 100%;
              }
            }
            .text {
              padding-left: 15px;
              font-size: 30px;
              color: #ffb821;
            }
          }
        }
        .select-match-it {
          padding-right: 2rem;
          margin-top: 2rem;
          @include media-breakpoint-down(sm) {
            padding: 0 2rem;
          }
        }
        .select-engder {
          padding-right: 2rem;
          margin-top: 2rem;
          @include media-breakpoint-down(sm) {
            padding: 0 2rem;
          }
        }
      }
    }
  }
}

.fade-slide-enter-active {
  transition: all 0.5s ease;
}
.fade-slide-leave-active {
  transition: all 0.5s ease;
}
.fade-slide-enter,
.fade-slide-leave-to {
  transform: translateY(-30px);
  opacity: 0;
}

.fade-enter-active {
  animation: fadeIn;
  animation-duration: 0.5s;
}
.fade-leave-active {
  animation: fadeOut;
  animation-duration: 0.5s;
}

.fade-slide-back-enter-active {
  transition: all 1s ease;
}
.fade-slide-back-leave-active {
  transition: all 1s ease;
}
.fade-slide-back-enter,
.fade-slide-back-leave-to {
  transform: translateX(-30px);
  opacity: 0;
}
</style>
