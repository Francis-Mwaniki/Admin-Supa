<script setup>
import { userStore } from "@/store/user.js";

const user = ref("");
const AppwriteUser = useAppwrite();
const currentAppwriteUser = ref("");
const router = useRouter();
const client = useSupabaseClient();
const auth = useSupabaseAuthClient();
const toast = useToast();
const store = userStore();

const EditUser = async () => {
  router.push("/admin/Settings");
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
const deleteUser = async () => {
  try {
    localStorage.removeItem("token");
    router.push("/");
  } catch (error) {
    console.log(error);
  }
};
onMounted(() => {
  user.value = localStorage.getItem("user");
  // console.log("supabase user", user.value);

  // fetchAccount();
});
const items = [
  [
    {
      label: "Profile",
      avatar: {
        src: "https://avatars.githubusercontent.com/u/739984?v=4",
      },
      click: () => {
        router.push("/admin/Settings");
      },
    },
    {
      label: user.value ? user.value.email : "No email",
      icon: "i-heroicons-user-20-solid",
      click: () => {
        router.push("/admin/Settings");
      },
    },
    {
      label: user.value ? user.value.phone : "No phone",

      icon: "i-heroicons-user-20-solid",
      click: () => {
        router.push("/admin/Settings");
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
        deleteUser();
        toast.add({
          title: "Success",
          description: "Logged out successfully",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        router.push("/");
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
