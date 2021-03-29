<template>
  <div class="container mt-3">
    <loading v-if="isLoading" />
    <div class="kids-page">
      <div class="course-box">
        <category
          v-if="course.id"
          :category="course"
          :description="course.name"
          :show-button="false"
        />
      </div>
      <div class="lesson-box">
        <div v-for="category in categories" :key="category.id" class="lesson">
          <strong class="h4">{{ category.name }}</strong>

          <div class="btn-group-row">
            <nuxt-link
              class="btn btn-circle mr-3"
              :to="`/kids/${queryLevel}/engder/${category.slug}/review`"
            >
              <i class="fas fa-search"></i><span class="icon">Review</span>
            </nuxt-link>
            <nuxt-link
              :to="`/kids/${queryLevel}/engder/${category.slug}/game`"
              class="btn btn-circle"
            >
              <i class="fas fa-play"></i><span class="icon">Play</span>
            </nuxt-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Category from "@/components/Category.vue";
import Loading from "@/components/Loading";
import * as FirebaseService from "@/services/firebase.service";

export default {
  layout: "kids",
  components: {
    Category,
    Loading
  },
  data() {
    return {
      categories: [],
      isLoading: true,
      course: {}
    };
  },
  computed: {
    ...mapGetters({
      queryLevel: "getQueryLevel"
    })
  },
  async mounted() {
    console.log(this.queryLevel);
    if (!this.queryLevel) {
      await this.$store.commit("setQueryLevel", this.$route.params.level);
    }
    console.log(this.queryLevel);
    await this.loadCat();
    this.isLoading = false;
  },
  methods: {
    async loadCat() {
      if (this.queryLevel) {
        const level = await FirebaseService.getLevelIdBySlug(this.queryLevel);
        console.log("level", level);
        this.course = level;
        if (!level.error) {
          const res = await FirebaseService.getCategoryByLevel(level);
          this.categories = res;
          console.log(res);
          return;
        }
      }
      const res = await FirebaseService.getAllCategories();
      this.categories = res;
      return;
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~@/assets/scss/styles/variables";
@import "~@/assets/scss/styles/mixins";
.container {
  padding-left: 0;
  padding-right: 0;
}
label {
  color: #f46500cf;
  display: flex;
  justify-content: center;
}
a {
  color: #f46500cf;
}
strong {
  padding-left: 0.3rem;
  padding-top: 5px;
}
.navbar {
  display: flex;
  justify-content: center;
}
.lesson {
  width: 100%;
  padding: 1rem;
  border-radius: 1rem;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  @include primary-box-shadow;
  @include themed {
    background: tget("card-background");
    color: tget("body-color");
  }

  span {
    font-size: 12px;
  }
}
.kids-page {
  display: flex;
  flex-direction: column;
  @include media-breakpoint-up(md) {
    flex-direction: row;
    justify-content: center;
  }
}
.card-category {
  /deep/.header {
    height: 250px;
  }
}
.course-box {
  width: 100%;
  @include media-breakpoint-up(md) {
    width: 50%;
  }
}

.lesson-box {
  width: 100%;
  padding: 1rem;
  @include media-breakpoint-up(md) {
    width: 50%;
  }
}
</style>
