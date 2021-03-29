<template>
  <div class="button-select">
    <button class="btn btn-notmatch" type="button" @click="$emit('btnno')">
      <img src="~/assets/images/Wrong_icon@X1.png" />
      <span>Incorrect</span>
    </button>
    <button class="btn btn-match" type="button" @click="$emit('btnyes')">
      <img src="~/assets/images/Correct_icon@X1.png" />
      <span>Correct</span>
    </button>
  </div>
</template>

<script>
export default {
  props: {}
};
</script>

<style lang="scss" scoped>
.btn-check {
  width: 140px;
  height: 65px;
  span {
    visibility: hidden;
  }
  img {
    position: absolute;
  }

  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid #ffffff;
  box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.1);
  border-radius: 12px;

  &:hover {
    box-shadow: inset 0px 0px 10px rgba(0, 0, 0, 0.25);
  }

  span {
    margin-left: 8px;
    color: white;
    @include font-size(2em);
  }
  @include media-breakpoint-up(sm) {
    min-width: 234px;
    max-width: 234px;
    span {
      visibility: visible;
    }
    img {
      position: relative;
    }
  }
}

.button-select {
  display: flex;
  justify-content: space-between;
  margin-top: 2.5vh;
  .btn-notmatch {
    @extend .btn-check;
    background: #f46500;
    &:hover {
      background: #db5a00;
    }
  }

  .btn-match {
    @extend .btn-check;
    background: #6fcf97;
    &:hover {
      background: #63ba87;
    }

    span {
      margin-left: 8px;
      color: white;
      @include font-size(2em);
    }
  }
  @media screen and (max-width: 575px) {
    .btn-notmatch,
    .btn-match {
      width: 130px;

      span {
        visibility: hidden;
      }
      img {
        position: absolute;
      }
    }
  }
}
</style>
