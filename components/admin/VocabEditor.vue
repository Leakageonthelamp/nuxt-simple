<template>
  <form class="vocab-form">
    <div class="form-group">
      <label class="col-form-label">Vocabulary</label>
      <div class="">
        <input
          v-model="vocab.word"
          type="text"
          class="form-control"
          placeholder="Vocabulary"
          required
        />
      </div>
    </div>
    <div class="form-group">
      <label class="col-form-label">Image</label>
      <div class="">
        <input
          ref="vocabImageRef"
          type="file"
          accept="image/jpeg,image/png"
          @change="uploadImage"
        />
      </div>
    </div>
    <div class="form-group">
      <label class="">Parts of speech</label>
      <div class="">
        <multiselect
          v-model="partOfSpeech"
          deselect-label="Can't remove this value"
          track-by="value"
          label="text"
          placeholder="Select one"
          :options="listPOS"
          class="custom-multiselect"
          @input="changePartOfSpeech"
        >
          <template slot="singleLabel" slot-scope="{ option }">
            {{ option.text }}
          </template>
        </multiselect>
      </div>
    </div>
    <div class="form-group">
      <label class="col-form-label">Definition</label>
      <div class="">
        <input
          v-model="vocab.definition"
          type="text"
          class="form-control"
          placeholder="Definition"
          required
        />
      </div>
    </div>
    <div class="form-group">
      <label class="col-form-label">Sentence</label>
      <div class="">
        <input
          v-model="vocab.sentence"
          type="text"
          class="form-control"
          placeholder="Sentence"
          required
        />
      </div>
    </div>
    <button type="button" class="btn btn-primary" @click="updateVocab">
      Submit
    </button>
    <button type="button" class="btn btn-primary" @click="addImageToFirebase">
      add image
    </button>
  </form>
</template>

<script>
import listPartOfSpeech from "~/assets/list-part-of-speech";
export default {
  name: "VocabEditor",
  props: {
    vocab: {
      type: Object,
      default: () => {
        return {
          word: null,
          image: null,
          partOfSpeech: null,
          definition: null,
          sentence: null
        };
      }
    },
    isNewWord: {
      type: Boolean,
      default: false
    },
    pathStorage: {
      type: String,
      default: "image-category"
    }
  },
  data() {
    return {
      listPOS: listPartOfSpeech.data,
      partOfSpeech: null,
      vocabImage: null,
      progress: 0
    };
  },
  mounted() {
    const filter = this.listPOS.filter(
      pos => pos.value === this.vocab.partOfSpeech
    );
    if (filter.length) this.partOfSpeech = filter[0];
  },
  methods: {
    async updateVocab() {
      if (this.vocabImage) {
        await this.addImageToFirebase();
      } else {
        this.emitVocab();
      }
    },
    changePartOfSpeech() {
      this.vocab.partOfSpeech = this.partOfSpeech.value;
    },
    async addImageToFirebase() {
      const firebaseRefStorage = await this.$firebase
        .storage()
        .ref()
        .child(`${this.pathStorage}/${this.vocab.word}`);

      const uploadTask = firebaseRefStorage.putString(
        this.vocabImage,
        "data_url"
      );
      uploadTask.on(
        "state_changed",
        snapshot => {
          // Observe state change events such as progress, pause, and resume
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          this.progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + this.progress + "% done");
          switch (snapshot.state) {
            case this.$firebase.storage.TaskState.PAUSED: // or 'paused'
              console.log("Upload is paused");
              break;
            case this.$firebase.storage.TaskState.RUNNING: // or 'running'
              console.log("Upload is running");
              break;
          }
        },
        error => {
          console.log(error);
          // Handle unsuccessful uploads
        },
        async () => {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          const imageUrl = await uploadTask.snapshot.ref.getDownloadURL();
          this.vocab.image = imageUrl;
          this.emitVocab();
        }
      );
    },
    emitVocab() {
      if (this.isNewWord) {
        this.$emit("add-vocab", this.vocab);
      } else {
        this.$emit("update-vocab", this.vocab);
      }
    },
    async uploadImage() {
      const refFile = this.$refs.vocabImageRef.files[0];
      if (refFile) {
        const self = this;
        const reader = new FileReader();
        reader.addEventListener("load", function() {
          self.vocabImage = this.result;
        });
        await reader.readAsDataURL(refFile);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  max-width: 360px;
}
</style>
