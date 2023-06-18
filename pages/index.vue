<script setup>
const toast = useToast();
const columns = [
  { key: "name", label: "Name" },
  { key: "age", label: "Age" },
  { key: "email", label: "Email" },
  { key: "actions", label: "Actions" },
];
const page = ref(1);
const pageCount = 5;
const people = [
  { id: 1, name: "John Doe", age: 25, email: "johndoe@example.com" },
  { id: 2, name: "Jane Smith", age: 32, email: "janesmith@example.com" },
  { id: 3, name: "Bob Johnson", age: 45, email: "bobjohnson@example.com" },
  { id: 4, name: "John Doe", age: 25, email: "johndoe@example.com" },
  { id: 5, name: "Jane Smith", age: 32, email: "janesmith@example.com" },
  { id: 6, name: "Bob Johnson", age: 45, email: "bobjohnson@example.com" },
  { id: 7, name: "John Doe", age: 25, email: "johndoe@example.com" },
  { id: 8, name: "Jane Smith", age: 32, email: "janesmith@example.com" },
  { id: 9, name: "Bob Johnson", age: 45, email: "bobjohnson@example.com" },

  // Add more people data as needed
];
const rows = computed(() => {
  return people.slice((page.value - 1) * pageCount, page.value * pageCount);
});

const items = (row) => [
  [
    {
      label: "Edit",
      icon: "i-heroicons-pencil-square-20-solid",
      click: () => console.log("Edit", row.id),
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
    },
  ],
];

const selected = ref([]);
</script>

<template>
  <div class="max-w-6xl mx-auto py-4">
    <UTable v-model="selected" :rows="rows" :columns="columns">
      <template #name-data="{ row }">
        <span
          :class="[
            selected.find((person) => person.id === row.id) &&
              'text-primary-500 dark:text-primary-400',
          ]"
          >{{ row.name }}</span
        >
      </template>

      <template #actions-data="{ row }">
        <UDropdown :items="items(row)">
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-ellipsis-horizontal-20-solid"
          />
        </UDropdown>
      </template>
    </UTable>
    <UPagination v-model="page" :page-count="pageCount" :total="people.length" />
    <!-- selected show -->
    <Selected :selected="selected" :people="people" />
  </div>
</template>
