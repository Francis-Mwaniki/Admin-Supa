<script setup>
import { userStore } from "~/store/user";

const user = useSupabaseUser();
const AppwriteUser = useAppwrite();
const currentAppwriteUser = ref("");
const router = useRouter();
const client = useSupabaseClient();
const auth = useSupabaseAuthClient();
const toast = useToast();
const store = userStore();

const EditUser = async () => {
  store.showResetModal = true;
};
const fetchAccount = async () => {
  store.isAppwriteUser = true;
  try {
    store.currentAdmin = (await AppwriteUser.account.get()).phone;
    return store.currentAdmin;
  } catch (e) {
    store.isAppwriteUser = false;
    toast.add({
      title: "Note",
      description: e.message ? e.message : e,
    });
  }
};
onMounted(() => {
  console.log("supabase user", user.value);

  fetchAccount();
});
const items = [
  [
    {
      label: "Profile",
      avatar: {
        src: "https://avatars.githubusercontent.com/u/739984?v=4",
      },
      click: () => {
        router.push("/profile");
      },
    },
    {
      label: user.value ? user.value.email : "No email",
      icon: "i-heroicons-user-20-solid",
      click: () => {
        router.push("/profile");
      },
    },
    {
      label: store.currentAdmin ? store.currentAdmin : "No phone",

      icon: "i-heroicons-user-20-solid",
      click: () => {
        router.push("/profile");
      },
    },
  ],
  [
    {
      label: "Edit",
      icon: "i-heroicons-pencil-square-20-solid",
      shortcuts: ["E"],
      click: () => {
        /* emit toggle */
        EditUser();
      },
    },
  ],

  [
    {
      label: "Logout",
      icon: "i-heroicons-arrow-right-20-solid",
      shortcuts: ["⌘", "D"],
      click: () => {
        /* emit toggle */
        auth.auth.signOut();
        toast.add({
          title: "Success",
          description: "Logged out successfully",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        router.push("/Login");
      },
    },
  ],
];
</script>

<template>
  <UDropdown :items="items" :popper="{ placement: 'bottom-start' }">
    <UButton
      color="white"
      label="Admin"
      trailing-icon="i-heroicons-chevron-down-20-solid"
    />
  </UDropdown>
</template>
