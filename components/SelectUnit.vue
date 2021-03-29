<template>
  <div class="select-unit">
    <div class="select-unit-warpper">
      <div class="unit-header">
        Select Unit
      </div>
      <div class="unit-body">
        <div
          v-for="unit in units"
          :key="unit.length"
          class="unit-box"
          @click="$emit('onClick', unit)"
        >
          <div class="text">
            Unit
            <div class="number">{{ unit.text }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    units: [
      {
        text: 1,
        value: "Unit 1"
      },
      {
        text: 2,
        value: "Unit 2"
      },
      {
        text: 3,
        value: "Unit 3"
      },
      {
        text: 4,
        value: "Unit 4"
      },
      {
        text: 5,
        value: "Unit 5"
      },
      {
        text: 6,
        value: "Unit 6"
      },
      {
        text: 7,
        value: "Unit 7"
      },
      {
        text: 8,
        value: "Unit 8"
      }
    ]
  }),
  methods: {
    close() {
      this.$emit("close");
      console.log("click outside");
    }
  }
};
</script>

<style lang="scss" scoped>
.select-unit {
  z-index: 1;
  .select-unit-warpper {
    background-color: white;
    box-shadow: 4px 4px 6px rgba(131, 131, 131, 0.25);
    border: 1px solid $gs-5;
    border-radius: 12px;
    .unit-header {
      padding: 0.5rem 1rem;
      font-size: 18px;
      border-bottom: 1px solid $gs-5;
      color: #ffb821;
    }

    .unit-body {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      padding: 1rem;
      .unit-box {
        margin: 0.5rem;
        background: #ffffff;
        border: 4px solid #ffffff;
        box-shadow: 0px 5px 5px rgba(131, 131, 131, 0.3);
        border-radius: 12px;
        cursor: pointer;
        transition: 0.3s;
        .text {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 0.5rem 1rem;
          font-size: 18px;
          color: #ffb821;
          .number {
            font-size: 28px;
            color: #f2c94c;
          }
        }
        &:hover {
          transition: 0.3s;
          background: #e0e0e0;
          border: 4px solid #ffffff;
        }
      }
    }
  }
}
</style>
