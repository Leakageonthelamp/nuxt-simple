<template>
  <table class="table table-striped table-hover">
    <thead>
      <tr>
        <th scope="col">No.</th>
        <th scope="col">Vocab</th>
        <th scope="col">Image</th>
        <th scope="col">Definition</th>
        <th scope="col">Sentence</th>
        <th scope="col">Delete</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(vocab, index) in vocabs" :key="index">
        <td scope="row">{{ index + 1 }}</td>
        <td style="text-transform: capitalize;">
          <div class="word">
            <nuxt-link :to="`${categoryId}/${vocab.id}`" class="btn btn-link"
              >{{ vocab.word }}
            </nuxt-link>
            <span v-if="vocab.partOfSpeech">({{ vocab.partOfSpeech }})</span>
          </div>
        </td>
        <th scope="col">
          <div class="d-flex justify-content-center align-items-center">
            <i
              v-if="vocab.image"
              class="fas fa-check"
              style="color: #6fcf97;"
            ></i>
            <i v-else class="fas fa-times" style="color: #ef7171;"></i>
          </div>
        </th>
        <td>{{ vocab.definition }}</td>
        <td>{{ vocab.sentence }}</td>
        <td>
          <div class="d-flex justify-content-center align-items-center">
            <i class="far fa-trash-alt" @click="confirmDelete(vocab.id)"></i>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  name: "ViewVocab",
  props: {
    vocabs: {
      type: Array,
      required: true
    }
  },
  computed: {
    categoryId() {
      return this.$route.params.categoryId;
    }
  },
  methods: {
    confirmDelete(id) {
      let con = confirm("DELETE !!!");
      if (con === true) {
        this.$emit("delete-vocab", id);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
th {
  text-align: center;
}

i {
  font-size: 1.5em;
  margin: 0.5rem;
}
.fa-edit {
  color: #7ed321;
}
.fa-trash-alt {
  color: #f35156;
}
.word {
  white-space: nowrap;
}
</style>
