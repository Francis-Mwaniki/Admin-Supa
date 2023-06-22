<template>
  <div class="items-center justify-center flex py-3">
    <form
      class="flex flex-col bg-gray-900 p-10 rounded-xl shadow-2xl items-center space-y-8 w-full max-w-lg text-lg text-gray-700"
    >
      <p class="text-center font-medium text-2xl text-white">My Profile</p>

      <div class="flex flex-col space-y-2 w-full">
        <label class="block text-md font-medium text-gray-100" for="name">Name</label>
        <input
          name="name"
          type="text"
          v-model="user.name"
          disabled
          class="focus:ring-accent focus:border-accent block w-full rounded-md sm:text-sm border border-gray-300 text-white py-3 px-3"
        />
      </div>

      <div class="flex flex-col space-y-2 w-full">
        <label class="block text-md font-medium text-gray-100" for="email">Email</label>
        <input
          name="email"
          type="text"
          v-model="user.email"
          disabled
          class="focus:ring-accent focus:border-accent block w-full rounded-md sm:text-sm border border-gray-300 text-white py-3 px-3"
          placeholder="Enter your email"
        />
      </div>

      <div class="flex flex-col space-y-2 w-full">
        <div class="flex items-center space-x-2">
          <label class="block text-md font-medium text-gray-100" for="phone"
            >Phone Number</label
          >
          <p
            v-if="user.phoneVerification"
            class="bg-green-600 text-white rounded-2xl px-3 py-1 text-xs"
          >
            Verified
          </p>
          <p v-else class="bg-red-600 text-white rounded-2xl px-3 py-1 text-xs">
            Unverified
          </p>
        </div>
        <div class="flex space-x-4">
          <input
            name="phone"
            type="phone"
            v-model="user.phone"
            required
            class="focus:ring-accent focus:border-accent block w-full rounded-md sm:text-sm border border-gray-300 text-white py-3 px-3"
            placeholder="Enter your Phone Number"
          />
          <UButton
            @click.prevent="updatePhone"
            class="text-white font-medium rounded-md shadow-lg bg-background filter hover:brightness-90 px-6"
            variant="solid"
            color="green"
          >
            Update
          </UButton>
        </div>
      </div>

      <div
        v-if="!user.phoneVerification && codeSent"
        class="flex flex-col space-y-2 w-full"
      >
        <label class="block text-md font-medium text-gray-100" for="secret"
          >Verification Code</label
        >
        <div class="flex space-x-4">
          <input
            name="secret"
            type="secret"
            v-model="secret"
            required
            class="focus:ring-accent focus:border-accent block w-full rounded-md sm:text-sm border border-gray-300 text-white py-3 px-3"
            placeholder="Enter your verification code"
          />
          <UButton
            @click.prevent="verifyPhone"
            class="text-white font-medium rounded-md shadow-lg bg-background filter hover:brightness-90 px-6"
            variant="solid"
            color="green"
          >
            Verify
          </UButton>
        </div>
      </div>

      <UButton
        v-if="!codeSent && !user.phoneVerification"
        @click.prevent="createVerification"
        class="flex w-full py-4 text-white font-medium items-center justify-center space-x-3 rounded-md shadow-lg bg-background filter hover:brightness-90"
        variant="solid"
        color="green"
      >
        Verify Phone
      </UButton>

      <UButton
        @click.prevent="logout"
        class="flex w-full py-4 text-white font-medium items-center justify-center space-x-3 rounded-md shadow-lg bg-background filter hover:brightness-90"
        variant="solid"
        color="green"
      >
        Logout
      </UButton>
      <div class="flex justify-center mt-4">
        <UButton
          color="green"
          variant="solid"
          class="text-white px-7 justify-self-center"
          @click="$router.push('/Dashboard')"
        >
          <Icon name="ic:round-arrow-back" class="mr-2" />
          Go Back
        </UButton>
      </div>
    </form>
  </div>
</template>
<script setup>
import { userStore } from "@/store/user";
let user = ref({});
const store = userStore();
const { account, ID } = useAppwrite();

let secret = ref("");
let codeSent = ref(false);
const toast = useToast();

const logout = async () => {
  try {
    user.value = await account.get();
    console.log("user", user.value.$id);
    await account.deleteSession("current");
    navigateTo("/Login");
  } catch (e) {
    toast.add({
      title: "Note",
      description: e.message ? e.message : e,
    });
  }
};

const updatePhone = async () => {
  try {
    const password = prompt("Please enter your password");
    if (!password) {
      throw new Error("Password is required");
    }
    user = await account.updatePhone(user.value.phone, password);
    toast.add({
      title: "Note",
      description: "Phone number updated!",
    });
  } catch (e) {
    toast.add({
      title: "Note",
      description: e.message ? e.message : e,
    });
  } finally {
    codeSent = false;
  }
};

const createVerification = async () => {
  try {
    if (!user.value.phone) {
      throw new Error("Phone number is required");
    }
    await account.createPhoneVerification();
    codeSent = true;
  } catch (e) {
    toast.add({
      title: "Note",
      description: e.message ? e.message : e,
    });
  }
};

const verifyPhone = async () => {
  try {
    await account.updatePhoneVerification(user.value["$id"], secret);
    user.value = await account.get();
    toast.add({
      title: "Note",
      description: "Phone number verified!",
    });
    codeSent = false;
  } catch (e) {
    toast.add({
      title: "Note",
      description: e.message ? e.message : e,
    });
  }
};

const fetchAccount = async () => {
  store.isAppwriteUser = true;
  try {
    user.value = await account.get();
    console.log(user.value);
  } catch (e) {
    store.isAppwriteUser = false;
    toast.add({
      title: "Note",
      description: e.message ? e.message : e,
    });
  }
};

onMounted(() => {
  fetchAccount();
});
</script>
<style scoped>
/* Add your component-specific styles here */
</style>
