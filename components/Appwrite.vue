<template>
  <div class="bg-background items-center justify-center flex">
    <form
      class="flex flex-col bg-gray-800 p-10 rounded-xl shadow-2xl items-center space-y-8 max-w-lg text-lg text-gray-700"
    >
      <div class="flex flex-col space-y-2 w-full">
        <label class="block text-md font-medium" for="phone">Phone Number</label>
        <input
          name="phone"
          type="text"
          v-model="number"
          required
          class="focus:ring-accent focus:border-accent block w-full rounded-md sm:text-sm border border-gray-300 py-3 px-3 text-white"
          placeholder="Enter your phone number with the country code"
        />
      </div>

      <div v-if="verificationSent" class="flex flex-col space-y-2 w-full">
        <label class="block text-md font-medium" for="password">Verification Code</label>
        <input
          name="verificationCode"
          type="text"
          v-model="verificationCode"
          required
          class="focus:ring-accent focus:border-accent block w-full rounded-md sm:text-sm border border-gray-300 py-3 px-3 text-white"
          placeholder="Enter the verification code"
        />
      </div>

      <button
        v-if="!verificationSent"
        @click.prevent="signUpWithPhone"
        class="flex w-full py-4 text-white font-medium items-center justify-center space-x-3 rounded-md shadow-lg bg-background filter hover:brightness-90"
      >
        <p>Get Code</p>
      </button>

      <button
        v-else
        @click.prevent="verify"
        class="flex w-full py-4 text-white font-medium items-center justify-center space-x-3 rounded-md shadow-lg bg-background filter hover:brightness-90"
      >
        <p>Verify</p>
      </button>

      <div class="flex space-x-2 w-full items-center text-gray-500">
        <div class="w-full bg-gray-300 h-0.5"></div>
        <p class="text-sm font-light">OR</p>
        <div class="w-full bg-gray-300 h-0.5"></div>
      </div>

      <div class="cursor-pointer" @click="goto('/')">Sign up with Email?</div>
    </form>
  </div>
</template>

<script>
import { userStore } from "~/store/user.js";
export default {
  setup() {
    const { account, ID } = useAppwrite();
    const toast = useToast();
    const number = ref("");
    const router = useRouter();
    const store = userStore();
    const verificationSent = ref(false);
    const verificationCode = ref("");
    const user = ref({});

    const signUpWithPhone = async () => {
      try {
        user.value = await account.createPhoneSession(ID.unique(), number.value);
        verificationSent.value = true;
      } catch (e) {
        toast.add({
          title: "note",
          description: e.message ? e.message : e,
        });
      }
    };

    const verify = async () => {
      try {
        let response = await account.updatePhoneSession(
          user.value.userId,
          verificationCode.value
        );
        console.log("Response ", response);
        router.push("/Dashboard");
      } catch (e) {
        toast.add({
          title: "note",
          description: e.message ? e.message : e,
        });
      }
    };

    const gotoPage = (path) => {
      goto(path);
    };
    const fetchAccount = async () => {
      store.isAppwriteUser = true;
      try {
        user.value = await account.get();
        console.log(user.value);
      } catch (e) {
        toast.add({
          title: "Note",
          description: e.message ? e.message : e,
        });
        // navigateTo("/Login");
      }
    };
    fetchAccount();
    return {
      number,
      verificationSent,
      verificationCode,
      user,
      signUpWithPhone,

      verify,
      goto: gotoPage,
    };
  },
};
</script>

<style scoped>
/* Add your component-specific styles here */
</style>
