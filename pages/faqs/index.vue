<template>
  <div>
    <DataTable :value="faqs" v-if="!loading">
      <template #header>
        <div
          class="flex flex-column md:flex-row md:justify-content-between md:align-items-center"
        >
          <h5 class="m-0">Manage Blog Posts</h5>
          <Button label="Add FAQ" icon="pi pi-plus" @click="addFAQ" />
        </div>
      </template>
      <Column field="question" header="Question"></Column>
      <Column field="sequence" header="Sequence"></Column>
      <Column header="Actions">
        <template #body="slotProps">
          <div class="flex gap-2">
            <Button icon="pi pi-pencil" @click="editFAQ(slotProps.data)" />
            <Button
              severity="warning"
              icon="pi pi-trash"
              @click="deleteFAQ(slotProps.data.id)"
            />
          </div>
        </template>
      </Column>
    </DataTable>

    <div v-if="loading" class="loading-spinner">
      <span><i class="pi pi-spin pi-spinner text-8xl"></i></span>
    </div>
    <Dialog v-model:visible="showDialog" :style="{ width: '500px' }">
      <form @submit.prevent="submitFAQ">
        <div class="flex flew-wrap" style="flex-wrap: wrap">
          <InputNumber
            class="mb-3 w-full"
            v-model="faq.sequence"
            placeholder="Enter sequence"
            :min="1"
          />
          <InputText
            class="w-full mb-2 p-3"
            v-model="faq.question"
            placeholder="Enter question"
          />
          <InputText
            class="w-full mb-2 p-3"
            v-model="faq.answer"
            placeholder="Enter answer"
          />
          <div class="btns">
            <Button label="Submit" class="block" type="submit" />
          </div>
        </div>
      </form>
    </Dialog>
  </div>
</template>

<script setup>
const faqs = ref([]);
const showDialog = ref(false);
const faq = ref({ question: "", answer: "", sequence: 1 });
const isEditing = ref(false);
const faqId = ref(null);
const loading = ref(false);

const fetchFAQs = async () => {
  loading.value = true;
  try {
    const response = await makeCustomRequest({
      url: "api/faqs",
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
  const apiUrl = isEditing.value ? `api/faqs/${faqId.value}` : "api/faqs";
  const methodType = isEditing.value ? "PATCH" : "POST";
  if (faq.value.sequence === 0) {
    faq.value.sequence = 1;
  }
  try {
    await makeCustomRequest({
      url: apiUrl,
      method: methodType,
      body: {
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
      url: `api/faqs/${id}`,
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
