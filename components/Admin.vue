<script setup>
import { userStore } from "~/store/user";
const user = useSupabaseUser();
const router = useRouter();
const client = useSupabaseClient();
const auth = useSupabaseAuthClient();
const toast = useToast();
const store = userStore();
const EditUser = async () => {
  store.showResetModal = true;
  // const { data, error } = await client
  //   .from("users")
  //   .select("*")
  //   .eq("id", user.value.id);
  // if (error) {
  //   console.log(error);
  // } else {
  //   console.log(data);
  // }
};
const handleUser = async () => {
  const currentUser = user.value.email;
  return currentUser;
};
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
      label: user.value?.email ? user.value?.email : "Not Logged in",
      icon: "i-heroicons-user-20-solid",
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
