<template>
  <div>
    <DataTable :value="faqs" v-if="!loading">
      <Column field="question" header="Question"></Column>
      <Column field="answer" header="Answer"></Column>
      <Column field="sequence" header="Sequence"></Column>
      <Column header="Actions">
        <template #body="slotProps">
          <Button icon="pi pi-pencil" @click="editFAQ(slotProps.data)" />
          <Button icon="pi pi-trash" @click="deleteFAQ(slotProps.data.id)" />
        </template>
      </Column>
    </DataTable>
    <Button label="Add FAQ" icon="pi pi-plus" @click="addFAQ" />

    <!-- Display loader if data is still being fetched -->
    <div v-if="loading" class="loading-spinner">Loading...</div>

    <Dialog :visible="showDialog" @hide="closeDialog">
      <form @submit.prevent="submitFAQ">
        <InputText v-model="faq.question" placeholder="Enter question" />
        <InputTextarea v-model="faq.answer" placeholder="Enter answer" />
        <InputNumber v-model="faq.sequence" placeholder="Enter sequence" />
        <Button label="Submit" type="submit" />
      </form>
    </Dialog>
  </div>
</template>

<script setup>
const faqs = ref([]);
const showDialog = ref(false);
const faq = ref({ question: "", answer: "", sequence: 0 });
const isEditing = ref(false);
const faqId = ref(null);
const loading = ref(false);

const fetchFAQs = async () => {
  loading.value = true;
  try {
    const response = await makeCustomRequest({
      url: "/api/faqs",
      method: "GET",
    });
    faqs.value = response.data;
  } catch (error) {
    console.error("Error fetching FAQs:", error);
  } finally {
    loading.value = false;
  }
};

const addFAQ = () => {
  faq.value = { question: "", answer: "", sequence: 0 };
  showDialog.value = true;
  isEditing.value = false;
};

const editFAQ = (data) => {
  faq.value = { ...data };
  faqId.value = data.id;
  showDialog.value = true;
  isEditing.value = true;
};

const submitFAQ = async () => {
  const apiUrl = isEditing.value ? `/api/faqs/${faqId.value}` : "/api/faqs";
  const methodType = isEditing.value ? "PUT" : "POST";
  try {
    await makeCustomRequest({
      url: apiUrl,
      method: methodType,
      data: {
        question: faq.value.question,
        answer: faq.value.answer,
        sequence: faq.value.sequence,
      },
    });
    await fetchFAQs();
    closeDialog();
  } catch (error) {
    console.error("Error submitting FAQ:", error);
  }
};

const deleteFAQ = async (id) => {
  try {
    await makeCustomRequest({
      url: `/api/faqs/${id}`,
      method: "DELETE",
    });
    await fetchFAQs();
  } catch (error) {
    console.error("Error deleting FAQ:", error);
  }
};

const closeDialog = () => {
  showDialog.value = false;
};

onMounted(async () => {
  await fetchFAQs();
});
</script>

<style scoped>
/* Loader style */
.loading-spinner {
  text-align: center;
  padding: 20px;
  font-size: 18px;
  font-weight: bold;
}
</style>
