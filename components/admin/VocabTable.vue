<template>
  <div>
    <table class="table table-striped table-hover">
      <thead>
        <tr>
          <th
            v-for="(header, index) in tableHeader"
            :key="`h-${index}`"
            scope="col"
          >
            {{ header }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(dRow, index) in tableData" :key="`data-${index}`">
          <th
            v-for="(value, name) in tableHeader"
            :key="`${name}-${value}`"
            scope="row"
          >
            <span v-if="dRow[value]">{{ dRow[value] }}</span>
          </th>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  props: {
    tableData: {
      type: Array,
      default: () => []
    },
    tableHeader: {
      type: Array,
      default: () => []
    }
  }
};
</script>
