<template>
  <IconField iconPosition="left" class="block mt-2 md:mt-0">
    <InputIcon class="pi pi-search" />
    <InputText
      class="w-full sm:w-auto"
      v-model="searchQuery"
      placeholder="Search..."
      @input="handleInput"
    />
  </IconField>
</template>

<script setup>
const props = defineProps({
  initialSearch: {
    type: String,
    default: "",
  },
  debounceTime: {
    type: Number,
    default: 300,
  },
  onSearch: {
    type: Function,
    required: true,
  },
});

const searchQuery = ref(props.initialSearch);
let timeout;

const handleInput = () => {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    props.onSearch(searchQuery.value);
  }, props.debounceTime);
};

// watch(searchQuery, (newValue) => {
//   // Optional: handle searchQuery changes if needed
// });
</script>

<style scoped></style>
