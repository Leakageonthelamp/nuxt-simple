<template>
  <div class="container mt-3">
    <popup ref="uploadPopup">
      <template #head>
        <div>Add new image</div>
      </template>
      <template #body>
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
      </template>
      <div slot="foot" class="d-flex justify-content-end">
        <button class="btn btn-primary" @click="addImageToLevel">Submit</button>
      </div>
    </popup>
    <popup ref="insertLevelPopup">
      <template #head>
        <div>Add new level</div>
      </template>
      <template #body>
        <div>
          <label for="">Name</label>
          <input
            v-model="newLevel.name"
            class="form-control mb-3"
            type="text"
            @keyup.enter="addNewLevel"
          />
        </div>
        <div>
          <label for="">Slug</label>
          <input
            v-model="newLevel.slug"
            class="form-control mb-3"
            type="text"
            @keyup.enter="addNewLevel"
          />
        </div>
      </template>
      <div slot="foot" class="d-flex justify-content-end">
        <button
          class="btn btn-primary"
          :disabled="!(newLevel.name && newLevel.slug)"
          @click="addNewLevel"
        >
          Submit
        </button>
      </div>
    </popup>
    <template v-if="user">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <div>
          <multiselect
            v-model="selectedType"
            placeholder="search by type"
            :options="['kids', 'adult']"
            :searchable="true"
            :clear-on-select="false"
            class="custom-multiselect ml-3"
          >
            <template slot="clear">
              <div
                v-if="selectedType"
                class="multiselect__clear"
                @click="clearSelectedType"
              >
                <i class="fas fa-times"></i>
              </div>
            </template>
          </multiselect>
        </div>
        <button class="btn btn-success" @click="$refs.insertLevelPopup.open()">
          Add level
        </button>
      </div>
      <table class="table table-striped table-hover">
        <thead>
          <tr>
            <th scope="col">No.</th>
            <th scope="col">Name</th>
            <th scope="col">Slug</th>
            <th scope="col">Edit</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(level, index) in showLevelList" :key="level.id">
            <template v-if="isEditing(level)">
              <td>{{ index + 1 }}</td>
              <td>
                <input
                  v-model="selected.name"
                  class="form-control mb-3"
                  type="text"
                  @keyup.enter="updateLevel(selected)"
                />
              </td>
              <td>
                <input
                  v-model="selected.slug"
                  class="form-control mb-3"
                  type="text"
                  @keyup.enter="updateLevel(selected)"
                />
              </td>
              <td>
                <button
                  class="btn btn-secondary"
                  @click="updateLevel(selected)"
                >
                  <vue-element-loading
                    :active="isUpdating"
                    spinner="spinner"
                    background-color="none"
                    color="#f46500"
                  />
                  update
                </button>
                <button class="btn btn-danger" @click="removeLevel">
                  remove
                </button>
              </td>
            </template>
            <template v-else>
              <td>{{ index + 1 }}</td>
              <td>{{ level.name }}</td>
              <td>{{ level.slug }}</td>
              <td>
                <nuxt-link
                  :to="`/admin/level/${level.slug}`"
                  class="btn btn-primary"
                >
                  view
                </nuxt-link>
                <button class="btn btn-secondary" @click="selectUpdate(level)">
                  edit
                </button>
                <button class="btn btn-secondary" @click="addImage(level)">
                  add image
                </button>
              </td>
            </template>
          </tr>
        </tbody>
      </table>
    </template>
    <template v-else-if="!isLoadUser">
      <div class="container">
        <div class="form-signin">
          <h1 class="h3 mb-3 font-weight-normal">Please sign in</h1>
          <label for="inputEmail" class="sr-only">Email address</label>
          <input
            v-model="email"
            type="email"
            class="form-control input-email"
            placeholder="Email address"
            required=""
            autofocus=""
          />
          <label for="inputPassword" class="sr-only">Password</label>
          <input
            v-model="password"
            type="password"
            class="form-control input-password"
            placeholder="Password"
            required=""
          />
          <button class="btn btn-lg btn-block btn-primary" @click="signin">
            sign in
          </button>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import Popup from "@/components/Popup";
import * as FirebaseService from "@/services/firebase.service";
import isEqual from "lodash/isEqual";
import moment from "moment";
export default {
  layout: "admin",
  components: { Popup },
  data() {
    return {
      allLevel: [],
      selected: {},
      newLevel: {
        name: null,
        slug: null,
        image: null
      },
      isUpdating: false,
      vocabImage: null,
      imageForLevel: {},
      progress: 0,
      isLoadUser: true,
      user: null,
      email: "",
      password: "",
      loading: true,
      selectedType: ""
    };
  },
  computed: {
    isEditing() {
      return level => {
        return level.id === this.selected.id;
      };
    },
    showLevelList() {
      const list =
        this.selectedType === "kids"
          ? this.allLevel.filter(level => level.slug.match(/kids/gm))
          : this.allLevel;
      return list;
    }
  },
  async mounted() {
    this.loading = true;
    await this.$firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.user = user;
      }
      this.isLoadUser = false;
    });
    await this.getListLevel();
    this.loading = false;
  },
  methods: {
    async getListLevel() {
      this.allLevel = await FirebaseService.getListLevel();
      console.log(this.allLevel);
    },
    selectUpdate(level) {
      this.selected = { ...level };
    },
    async clearSelectedType() {
      this.selectedType = "";
    },
    async updateLevel(currentLevel) {
      const current = this.allLevel.find(({ id }) => id === currentLevel.id);
      console.log(currentLevel, isEqual(currentLevel, current));
      if (!isEqual(currentLevel, current)) {
        this.isUpdating = true;
        const categories = await FirebaseService.getCategoryByLevel(current);
        await Promise.all(
          categories.map(async category => {
            const payload = { ...category, level: currentLevel };
            console.log(payload);
            await FirebaseService.updateCategory(category.id, payload);
          })
        );
        await FirebaseService.updateLevel(currentLevel.id, currentLevel);
        this.$toast.success("updated success", { duration: 3000 });
        this.resetAndGetList();
        this.isUpdating = false;
        return;
      }
      this.selected = {};
    },
    async addNewLevel() {
      const payload = { ...this.newLevel };
      await FirebaseService.addLevel(payload);
      this.newLevel = {
        name: null,
        slug: null,
        image: null
      };
      this.$refs.insertLevelPopup.close();
      this.resetAndGetList();
    },
    async removeLevel() {
      const categories = await FirebaseService.getCategoryByLevel(
        this.selected
      );
      if (!categories.length) {
        await FirebaseService.deleteLevel(this.selected.id);
        this.resetAndGetList();
        this.$toast.success("Deleted success", { duration: 3000 });
        return;
      }

      this.$toast.error("cannot delete because level have category", {
        duration: 3000
      });
      this.selected = {};
    },
    resetAndGetList() {
      this.newLevel = {
        name: null,
        slug: null,
        image: null
      };
      this.selected = {};
      this.getListLevel();
    },
    addImage(level) {
      this.imageForLevel = { ...level };
      console.log("addImage", level, this.imageForLevel);
      this.$refs.uploadPopup.open();
    },
    async uploadImage() {
      const refFile = this.$refs.vocabImageRef.files[0];
      console.log(refFile);
      if (refFile) {
        const self = this;
        const reader = new FileReader();
        reader.addEventListener("load", function() {
          self.vocabImage = this.result;
        });
        await reader.readAsDataURL(refFile);
      }
    },
    async addImageToLevel() {
      const timestamp = moment().format("x");
      const firebaseRefStorage = await this.$firebase
        .storage()
        .ref()
        .child(`level/${this.imageForLevel.slug}-${timestamp}`);

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
          this.imageForLevel.image = imageUrl;
          this.$refs.uploadPopup.close();
          this.updateLevel(this.imageForLevel);
        }
      );
    }
  }
};
</script>

<style lang="scss" scoped>
label {
  @include font-size(1.5em);
}
table tr {
  th {
    &:nth-child(1) {
      width: 5%;
    }
    &:nth-child(2),
    &:nth-child(3) {
      width: 35%;
    }
    &:nth-child(4) {
      width: 25%;
    }
  }
}
</style>
