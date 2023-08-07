<template>
  <div id="dropbox" class="p-3 bg-gray-500 text-white">
    <form class="my-form">
      <div class="form_line">
        <div class="form_controls">
          <div class="upload_button_holder" >
            <input
              type="file"
              ref="fileInput"
              multiple
              accept="image/*"
              class=" hidden"
              @change="handleFileSelect"
            />
            <a href="#"  class="mr-2 w-full py-2 my-3 px-5  m-2 text-white rounded-md" @click="selectFiles" v-if="!isUploading">Upload multiple or 1 file</a>
            <Icon name="line-md:loading-loop" class="mr-2 h-7 w-7" v-if="isUploading" />
            
          </div>
        </div>
      </div>
    </form>
    <div
      class="progress-bar w-48 h-2 my-4 rounded-full"
      :class="uploadProgress > 0 ? 'bg-gray-950' : 'bg-green-200'"
    >
      <div
        :style="{ width: uploadProgress + '%' }"
        class="h-full bg-green-500 rounded-full"
      ></div>
      <!-- show percentage example 40% -->
      <div class="text-xs text-green-500" v-if="uploadProgress > 0">
        <!-- tailwind animate -->
        <span class="text-white text-lg">{{ uploadProgress }}%</span>
      </div>
    </div>
    <div class="preview">
      <h2>Image Preview:</h2>
      <div class="gap-x-1 grid grid-cols-3  grid-rows-1">
    <div class="mt-4 max-w-md  justify-center " v-if="fetchedUrl" v-for="image in images">
      <!-- <h4 class="mb-2">Uploaded Image</h4> -->
      <!-- <nuxt-img :src="fetchedUrl" width="300" height="200" /> -->
      <!-- <NuxtImg provider="cloudinary" :src="fetchedUrl" height="300" width="400" /> -->
      <!-- <nuxt-img :src="u_url" class="h-40 w-40" /> -->
      <!-- https://res.cloudinary.com/dzvtkbjhc/image/upload/v1681908219/bk_zfrzwa.png -->
   
      <NuxtImg class="h-20 w-20" :src="image" />
      <!-- file_name -->
      
    </div>
    </div>
    </div>

  </div>
</template>

<script>
import axios from "axios";
import { userStore } from "~/store/user";
export default {
  data() {
    return {
      cloudName: "dzvtkbjhc",
      unsignedUploadPreset: "c5gngmqw",
      uploadProgress: 0,
      isUploading: false,
      fetchedUrl: "",
      imagePreviews: [],
      imagePreviewsUrls: [],
      file_name: "",
      images:[],
      toast: useToast(),
      u_url: "",
      store: userStore(),
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
      // const files = event.target.files;
      // for (let i = 0; i < files.length; i++) {
      //   this.uploadFile(files[i]);
      // }
      const files = event.target.files;
      this.imagePreviews = [];
      this.imagePreviewsUrls = [];

      for (let i = 0; i < files.length; i++) {
        this.uploadFile(files[i]);
        const reader = new FileReader();
        reader.onload = (e) => {
          let image = e.target.result;
          let splitImage = image.split(",");
          let firstPart = splitImage[0];
          let secondPart = splitImage[1];
          // console.log("firstPart:", firstPart, "secondPart:", secondPart);
          this.imagePreviewsUrls.push(secondPart);
          // this.imagePreviewsUrls.push(e.target.result);

          // this.imagePreviews = [...this.imagePreviewsUrls]; // Corrected line
        };
        reader.readAsDataURL(files[i]);
      }
    
  },
    uploadFile(file) {
      this.isUploading = true;
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
          // console.log("file_name:", this.file_name, "the data:", response.data);
          // const fileNames = Array.from(this.filesToUpload).map(file => file.name);
          const tokens = url.split("/");
          tokens.splice(-2, 0, "w_400,c_scale");
          this.fetchedUrl = tokens.join("/");
          this.images.push(this.fetchedUrl);
          // console.log("Uploaded file to Cloudinary:", url);
          this.$emit("uploaded", this.images);
          // console.log("Fetched URL:", this.fetchedUrl);
          console.log("Fetched URL:", this.images);
          this.isUploading = false;
        })
        .catch((error) => {
          this.isUploading = false;
        alert("Upload failed");
        });
    },
  },
};
</script>

<style scoped>
.preview {
  margin-top: 20px;
}
 .img {
  max-width: 100px;
  max-height: 100px;
  margin: 5px;
  border: 1px solid #ddd;
  border-radius: 5px;
}
#dropbox {
  padding-left: 8px;
  padding-right: 8px;
  border-radius: 8px;
  border: 1px solid #ccc;
  background-color: #3d3d3d;
  color: #ffffff;
}

.my-form {
  margin-top: 10px;
}

.progress-bar {
  width: 200px;
  position: relative;
  height: 8px;
  margin-top: 4px;
  margin-bottom: 4px;
}

.progress-bar .progress {
  height: 8px;
  background-color: #ff0000;
  width: 0;
}
</style>
