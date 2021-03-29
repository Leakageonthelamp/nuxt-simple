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
    </div>

    <div class="body-detail">
      <strong class="h5">{{ category.name }}</strong>
      <div v-if="description" class="h6 font-weight-light">
        {{ description }}
      </div>
    </div>
    <div v-if="showButton" class="btn-group-row">
      <nuxt-link
        class="btn btn-circle"
        :to="linkPrefix === '#' ? linkPrefix : `${linkPrefix}/review`"
      >
        <i class="fas fa-search"></i><span class="icon">Review</span>
      </nuxt-link>
      <nuxt-link
        :to="linkPrefix === '#' ? linkPrefix : `${linkPrefix}/game`"
        class="btn btn-circle"
      >
        <i class="fas fa-play"></i><span class="icon">Play</span>
      </nuxt-link>
    </div>
  </div>
</template>

<script>
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
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@/assets/scss/styles/variables";
@import "~@/assets/scss/styles/mixins";
.card-category {
  position: relative;
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
    width: 100%;
    height: 200px;
    overflow: hidden;
  }
  .body-detail {
    padding: 1.2rem;
  }
  .btn-group-row {
    position: absolute;
    bottom: 44px;
    right: 10px;
    .btn-circle {
      margin: 0 5px;
    }
    i {
      margin-top: 4px;
      font-size: 1.3rem;
    }
    .icon {
      font-size: 0.8rem;
      height: 100%;
      display: flex;
      justify-content: center;
      margin-top: 1px;
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
