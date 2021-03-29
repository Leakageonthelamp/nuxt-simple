<template>
  <div v-click-outside="hide" class="dropdown">
    <div
      class="dropdown-lable-container"
      :class="{ extended: isOpen }"
      @click="isOpen = !isOpen"
    >
      <div class="dropdown-lable">
        {{ lableName }}
      </div>
      <img
        class="dropdown-icon"
        :class="{ flip: isOpen }"
        src="~@/assets/images/dropdown-icon.png"
        height="18px"
      />
    </div>

    <transition-expand name="fade">
      <div v-show="isOpen" class="dropdown-extended">
        <div
          v-for="option in options"
          :key="`key-${option}`"
          class="option"
          :class="{ selected: selected === option || lableName === option }"
          @click="set(option)"
        >
          <span>{{ option }}</span>
        </div>
      </div>
    </transition-expand>
  </div>
</template>

<script>
import { TransitionExpand } from "vue-transition-expand";
import "vue-transition-expand/dist/vue-transition-expand.css";
export default {
  components: { TransitionExpand },
  props: {
    lableName: {
      type: String,
      default: ""
    },
    options: {
      type: [Array, Object],
      required: true
    }
  },
  data: () => ({
    isOpen: false,
    selected: ""
  }),
  methods: {
    hide() {
      this.isOpen = false;
    },
    set(option) {
      this.selected = option;
      this.$emit("selected", this.selected);
      this.hide();
    }
  }
};
</script>

<style lang="scss" scoped>
.dropdown {
  background: white;
  cursor: pointer;

  .dropdown-lable-container {
    padding: 0.5rem 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border: 1px solid #e0e0e0;
    box-shadow: 0px 5px 5px rgba(131, 131, 131, 0.1);
    border-radius: 18.5px;
    overflow: hidden;
    transition: all 1s ease-out;
    &.extended {
      border-radius: 18.5px 18.5px 0 0;
      transition: all 0.1s ease-out;
    }

    .dropdown-lable {
      font-size: 18px;
      color: #f2c94c;
    }
    .dropdown-icon {
      transition: 0.5s;
      &.flip {
        transition: 0.5s;
        transform: rotate(180deg) translateY(1px);
      }
    }
  }

  .dropdown-extended {
    z-index: 2;
    position: absolute;
    border: 1px solid #e0e0e0;
    box-shadow: 0px 5px 5px rgba(131, 131, 131, 0.1);
    border-radius: 0 0 18.5px 18.5px;
    background: white;
    overflow: hidden;
    transition: 1s;
    border-top: none;
    width: 100%;
    .option {
      font-size: 18px;
      padding: 0.5rem 1rem;
      // background-color: lightsalmon;
      &:hover {
        background-color: #ececec;
        color: #f2c94c;
      }
      &.selected {
        background-color: #ececec;
        color: #f2c94c;
      }
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.1s ease-out;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
  transform: translateY(-30px);
}
</style>
