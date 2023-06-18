<template>
  <div id="dropbox" class="p-3 bg-gray-500 text-white">
    <form class="my-form">
      <div class="form_line">
        <div class="form_controls">
          <div class="upload_button_holder">
            <input
              type="file"
              ref="fileInput"
              multiple
              accept="image/*"
              class="hidden"
              @change="handleFileSelect"
            />
            <a href="#" @click="selectFiles" class="mr-2">choose file.</a>
          </div>
        </div>
      </div>
    </form>
    <div
      class="progress-bar w-48 h-2 mt-4 rounded-full"
      :class="uploadProgress > 0 ? 'bg-gray-950' : 'bg-green-200'"
    >
      <div
        :style="{ width: uploadProgress + '%' }"
        class="h-full bg-green-500 rounded-full"
      ></div>
      <!-- show percentage example 40% -->
      <div class="text-xs text-gray-500" v-if="uploadProgress > 0">
        <!-- tailwind animate -->
        <span class="animate-bounce text-gray-50 text-lg">{{ uploadProgress }}%</span>
      </div>
    </div>

    <div class="mt-4 max-w-md" v-if="fetchedUrl">
      <!-- <h4 class="mb-2">Uploaded Image</h4> -->
      <!-- <nuxt-img :src="fetchedUrl" width="300" height="200" /> -->
      <!-- <NuxtImg provider="cloudinary" :src="fetchedUrl" height="300" width="400" /> -->
      <!-- <nuxt-img :src="u_url" class="h-40 w-40" /> -->
      <!-- https://res.cloudinary.com/dzvtkbjhc/image/upload/v1681908219/bk_zfrzwa.png -->
      <NuxtImg class="h-16 rounded-lg w-full object-contain" :src="fetchedUrl" />
      <!-- file_name -->
      <p class="mt-2">File name: {{ file_name }}.png</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      cloudName: "dzvtkbjhc",
      unsignedUploadPreset: "c5gngmqw",
      uploadProgress: 0,
      fetchedUrl: "",
      file_name: "",
      toast: useToast(),
      u_url: "",
    };
  },
  methods: {
    selectFiles() {
      this.$refs.fileInput.click();
    },
    uploadUrl() {
      this.uploadFile("https://res.cloudinary.com/demo/image/upload/sample.jpg");
    },
    handleFileSelect(event) {
      const files = event.target.files;
      for (let i = 0; i < files.length; i++) {
        this.uploadFile(files[i]);
      }
    },
    uploadFile(file) {
      const url = `https://api.cloudinary.com/v1_1/${this.cloudName}/upload`;
      const fd = new FormData();

      this.uploadProgress = 0;

      fd.append("upload_preset", this.unsignedUploadPreset);
      fd.append("tags", "browser_upload");
      fd.append("file", file);

      axios
        .post(url, fd, {
          headers: {
            "Content-Type": "multipart/form-data",
            "X-Requested-With": "XMLHttpRequest",
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100.0) / progressEvent.total
            );
            this.uploadProgress = progress;
          },
        })
        .then((response) => {
          const url = response.data.secure_url;
          this.file_name = response.data.original_filename;
          console.log("file_name:", this.file_name, "the data:", response.data);
          const tokens = url.split("/");
          tokens.splice(-2, 0, "w_400,c_scale");
          this.fetchedUrl = tokens.join("/");
          console.log("Uploaded file to Cloudinary:", url);
          console.log("Fetched URL:", this.fetchedUrl);
        })
        .catch((error) => {
          console.log("Error uploading file to Cloudinary:", error);
        });
    },
  },
};
</script>

<style scoped>
#dropbox {
  border: 4px dashed #ccc;
  padding-left: 8px;
}

.my-form {
  margin-top: 10px;
}

.progress-bar {
  width: 200px;
  position: relative;
  height: 8px;
  margin-top: 4px;
}

.progress-bar .progress {
  height: 8px;
  background-color: #ff0000;
  width: 0;
}
</style>
