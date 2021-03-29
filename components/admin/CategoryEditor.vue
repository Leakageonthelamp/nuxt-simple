<template>
  <div class="container">
    <div class="mt-3 mb-3">
      <div class="mb-1">Vocab for level</div>
      <multiselect
        v-model="selectedLevel"
        deselect-label="Can't remove this value"
        label="name"
        placeholder="Select one"
        :options="allLevel"
        class="custom-multiselect"
      >
        <template slot="singleLabel" slot-scope="{ option }">
          {{ option.name }}
        </template>
      </multiselect>
    </div>
    <div class="form-group">
      <label>Category name</label>
      <input v-model="category.name" type="text" class="form-control" />
    </div>

    <div class="form-group">
      <label>Category Slug</label>
      <input v-model="category.slug" type="text" class="form-control" />
    </div>
    <button
      type="button"
      class="btn btn-primary"
      :disabled="!category.name"
      @click="addCategory"
    >
      {{ !!categoryId ? "Edit" : "Submit" }}
    </button>
    <template v-if="isCategory">
      <div>
        <vue-csv-import
          v-model="tableData"
          :map-fields="tableHeader"
        ></vue-csv-import>

        <template v-if="tableData.length">
          <div class="mb-3">
            <button class="btn btn-primary" @click="showTable = true">
              Map header
            </button>
            <button
              v-if="showTable && tableData.length"
              class="btn btn-success"
              @click="uploadVocab"
            >
              upload
            </button>
          </div>
        </template>
        <vocab-table
          v-if="showTable"
          :table-header="tableHeader"
          :table-data="tableData"
        ></vocab-table>
      </div>
    </template>
  </div>
</template>

<script>
import VocabTable from "~/components/admin/VocabTable.vue";
export default {
  components: { VocabTable },
  props: {
    allLevel: {
      type: Array,
      default: () => []
    },
    levelSlug: {
      type: String,
      default: ""
    },
    category: {
      type: Object,
      default: () => {
        return {
          name: null,
          image: null,
          slug: null
        };
      }
    },
    isCategory: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      tableData: [],
      tableHeader: ["word", "partOfSpeech", "definition", "sentence"],
      categoryId: null,
      selectedLevel: null,
      showTable: false
    };
  },
  async mounted() {
    if (this.allLevel.length) {
      if (this.levelSlug) {
        this.selectedLevel = await this.allLevel.filter(
          level => level.slug === this.levelSlug
        )[0];
      }
      if (this.isCategory) {
        this.selectedLevel = this.allLevel.filter(
          level => level.slug === this.category.level.slug
        )[0];
      }
    }
  },
  methods: {
    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 1;
      if (isLt1M) {
        return true;
      }
      // this.$message({
      //   message: "Please do not upload files larger than 1m in size.",
      //   type: "warning",
      // });
      return false;
    },
    async handleSuccess({ results, header }) {
      this.tableData = results;
      this.tableHeader = header;
    },
    uploadVocab() {
      const { tableData, tableHeader } = this;
      this.$emit("upload-vocab", { tableData, tableHeader });
    },
    async addCategory() {
      const payload = {
        name: this.category.name,
        slug: this.category.slug,
        image: this.category.image,
        level: this.selectedLevel
      };
      if (this.isCategory) {
        this.$emit("update-category", payload);
      } else {
        this.$emit("add-category", payload);
      }
    }
  }
};
</script>
