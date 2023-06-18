<template>
  <div class="container mx-auto py-8 bg-gray-950 text-white">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="(person, index) in selected"
        :key="person.id"
        class="bg-gray-800 shadow-lg rounded-lg p-6"
      >
        <div class="mb-4">
          <span class="text-primary-500 dark:text-primary-400">{{ person.name }}</span>
        </div>
        <div class="flex justify-end">
          <UDropdown :items="items(person)">
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-ellipsis-horizontal-20-solid"
            />
          </UDropdown>
          <UButton
            @click="deletePerson(index)"
            color="red"
            variant="solid"
            icon="i-heroicons-trash-20-solid"
            class="ml-2"
          />
          <UButton
            @click="editPerson(index)"
            color="blue"
            variant="solid"
            icon="i-heroicons-pencil-square-20-solid"
            class="ml-2"
          />
        </div>
      </div>
    </div>
    <!-- Add/Edit Person Popup -->
    <div
      v-if="showPopup"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div class="bg-gray-800 rounded-lg p-8">
        <h2 class="text-2xl font-bold mb-4">
          {{ isLoading ? "Edit Person" : "Add Person" }}
        </h2>
        <form @submit.prevent="savePerson">
          <div class="mb-4">
            <label for="name" class="block text-white">Name:</label>
            <input
              v-model="personData.name"
              type="text"
              id="name"
              class="bg-gray-200 text-black border border-gray-300 rounded px-3 py-2 w-full"
              required
            />
          </div>
          <div class="mb-4">
            <label for="age" class="block text-white">Age:</label>
            <input
              v-model="personData.age"
              type="number"
              id="age"
              class="bg-gray-200 text-black border border-gray-300 rounded px-3 py-2 w-full"
              required
            />
          </div>
          <CloudUpload />

          <div class="mb-4 mt-2">
            <label for="email" class="block text-white">Email:</label>
            <input
              v-model="personData.email"
              type="email"
              id="email"
              class="bg-gray-200 text-black border border-gray-300 rounded px-3 py-2 w-full"
              required
            />
          </div>
          <div class="flex justify-end">
            <UButton
              type="submit"
              class="text-white"
              color="green"
              variant="solid"
              :disabled="isSaving"
              :loading="isSaving"
            >
              {{ isLoading ? "Save Changes" : "Add" }}
            </UButton>
            <UButton @click="cancelEdit" color="gray" variant="solid" class="ml-2"
              >Cancel</UButton
            >
          </div>
        </form>
      </div>
    </div>
    <!-- <LoadingComp :isLoading="isLoading" /> -->
  </div>
</template>

<script>
import LoadingComp from "~/components/LoadingComp.vue";
import CloudUpload from "~/components/CloudUpload.vue";
import axios from "axios";
export default {
  props: {
    selected: {
      type: Array,
      required: true,
    },
    people: {
      type: Array,
      required: true,
    },
  },
  components: {
    LoadingComp,
    CloudUpload,
  },
  data() {
    return {
      columns: [
        { key: "name", label: "Name" },
        { key: "age", label: "Age" },
        { key: "email", label: "Email" },
        { key: "actions", label: "Actions" },
      ],
      isLoading: false,
      showPopup: false,
      selectedFile: null,
      isLoading: false,
      toast: useToast(),
      isSaving: false,
      personData: { id: null, name: "", age: "", email: "" },
    };
  },
  methods: {
    handleFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
        if (allowedTypes.includes(file.type)) {
          this.selectedFile = file;
          console.log("Selected file:", file.name);
        } else {
          console.log("Invalid file type. Please select an image (JPEG, PNG, GIF).");
          this.selectedFile = null;
          // Optionally, you can reset the file input field:
          event.target.value = "";
        }
      }
    },

    items(person) {
      return [
        [
          {
            label: "Edit",
            icon: "i-heroicons-pencil-square-20-solid",
            click: () => this.editPerson(person.id),
          },
          {
            label: "Duplicate",
            icon: "i-heroicons-document-duplicate-20-solid",
          },
        ],
        [
          {
            label: "Archive",
            icon: "i-heroicons-archive-box-20-solid",
          },
          {
            label: "Move",
            icon: "i-heroicons-arrow-right-circle-20-solid",
          },
        ],
        [
          {
            label: "Delete",
            icon: "i-heroicons-trash-20-solid",
            click: () => this.deletePerson(person.id),
          },
        ],
      ];
    },
    deletePerson(index) {
      this.selected.splice(index, 1);
    },

    editPerson(person) {
      this.isLoading = true;
      this.personData = { ...person };
      this.showPopup = true;
    },
    // savePerson() {
    //   this.isSaving = true;
    //   if (this.isEditing) {
    //     // Update existing person
    //     const index = this.people.findIndex((p) => p.id === this.personData.id);
    //     if (index !== -1) {
    //       this.people.splice(index, 1, this.personData);
    //     }
    //   } else {
    //     // Add new person
    //     const newId = this.people.length + 1;
    //     this.personData.id = newId;
    //     this.people.push(this.personData);
    //   }
    //   this.cancelEdit();
    // },
    async savePerson() {
      // Cloudinary configuration
      const cloudinaryCloudName = "dzvtkbjhc";
      const cloudinaryUploadPreset = "ml_default";

      const cloudinaryUrl = "https://api.cloudinary.com/v1_1/dzvtkbjhc/";
      // `https://res.cloudinary.com/${cloudinaryCloudName}/image/upload/v1684651576/`;

      // `https://res.cloudinary.com/${cloudinaryCloudName}/image/upload/v1684651576/`

      this.isSaving = true;

      // Upload the file to Cloudinary
      let imageURL = null;
      if (this.selectedFile) {
        const formData = new FormData();
        formData.append("file", this.selectedFile);
        formData.append("upload_preset", cloudinaryUploadPreset);

        try {
          const response = await axios.post(cloudinaryUrl, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

          imageURL = response.data.secure_url;
          console.log("File uploaded to Cloudinary. URL:", imageURL);
        } catch (error) {
          console.error("Error uploading file to Cloudinary:", error.message);
        }
      }

      // Prepare the person data
      const person = {
        id: this.personData.id,
        name: this.personData.name,
        age: this.personData.age,
        email: this.personData.email,
        image: imageURL,
      };

      if (this.isEditing) {
        // Update existing person
        const index = this.people.findIndex((p) => p.id === this.personData.id);
        if (index !== -1) {
          this.people.splice(index, 1, person);
        }
      } else {
        // Add new person
        const newId = this.people.length + 1;
        person.id = newId;
        this.people.push(person);
      }

      this.cancelEdit();
    },
    cancelEdit() {
      this.showPopup = false;
      this.isLoading = false;
      this.personData = { id: null, name: "", age: "", email: "" };
      this.isSaving = false;
    },
  },
};
</script>
