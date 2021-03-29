<template>
  <div class="">
    <table class="table table-striped table-hover table-responsive-sm">
      <thead>
        <tr>
          <th scope="col">No.</th>
          <th scope="col">Level</th>
          <th scope="col">Name</th>
          <th scope="col"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(category, index) in categories" :key="index">
          <th scope="row">{{ index + 1 }}</th>
          <td>{{ category.level.name }}</td>
          <td>
            <nuxt-link :to="`${category.level.slug}/category/${category.id}`">{{
              category.name
            }}</nuxt-link>
          </td>
          <td class="td-button">
            <nuxt-link
              :to="`${category.level.slug}/category/${category.id}/edit`"
              class="btn btn-warning"
              ><i class="far fa-edit"></i> edit
            </nuxt-link>
            <nuxt-link
              :to="`${category.level.slug}/category/${category.id}/add-vocab`"
              class="btn btn-success"
            >
              <i class="fas fa-plus"></i> add
            </nuxt-link>
            <button class="btn btn-danger" @click="confirmDelete(category.id)">
              <i class="fas fa-trash"></i> delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: "TableCat",
  props: {
    categories: {
      type: Array,
      required: true
    }
  },
  methods: {
    confirmDelete(id) {
      let con = confirm("DELETE !!!");
      if (con === true) {
        this.$emit("delete-category", id);
      }
    }
  }
};
</script>

<style scoped>
.btn {
  margin: 0 10px;
  color: white;
}
a {
  color: #f46500cf;
}
.td-button {
  display: flex;
  justify-content: space-around;
}
a:not([href]):not([tabindex]) {
  color: white;
}
</style>
