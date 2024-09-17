<template>
  <div class="grid">
    <div class="col-12">
      <div class="card">
        <div v-if="!loading && TableData" class="CutomResponsiveTable table-container">
          <DataTable v-if="TableData" ref="table" :value="TableData" dataKey="id">
            <template #header>
              <div
                class="flex flex-column md:flex-row md:justify-content-between md:align-items-center"
              >
                <h5 class="m-0">Manage Meta Tags</h5>
              </div>
            </template>
            <Column field="id" header="No" headerStyle="width:auto; min-width:10rem;">
              <template #body="slotProps">
                <span class="p-column-title">No</span>
                {{ slotProps.data.id }}
              </template>
            </Column>

            <Column
              field="title"
              header="Page Name"
              headerStyle="width:auto; min-width:10rem;"
            >
              <template #body="slotProps">
                <span class="p-column-title">Page Name</span>
                {{ slotProps.data.page_title }}
              </template>
            </Column>

            <Column header="Action" headerStyle="min-width:10rem;">
              <template #body="slotProps">
                <div class="flex items-center">
                  <Button
                    icon="pi pi-pencil"
                    class="mr-2"
                    severity="success"
                    rounded
                    @click="editEntryOpen(slotProps.data)"
                  />
                </div>
              </template>
            </Column>
          </DataTable>
        </div>

        <div
          v-else
          class="flex items-center justify-center text-primary"
          style="justify-content: center"
        >
          <span><i class="pi pi-spin pi-spinner text-8xl"></i></span>
        </div>
        <Dialog
          v-model:visible="editDialog"
          :style="{ width: '450px' }"
          header="Update Plan"
          :modal="true"
          class="p-fluid"
        >
          <div class="field">
            <label for="price">Page Title<span class="text-red-400"> *</span></label>
            <InputText
              v-model.trim="makeEntry.page_title"
              required
              autofocus
              :invalid="submitted && !makeEntry.page_title"
            />
          </div>
          <div class="field">
            <label for="title"
              >Meta Keywords (comma seprated keywords)<span class="text-red-400">
                *</span
              ></label
            >
            <InputText
              v-model.trim="makeEntry.page_meta_tags"
              required
              autofocus
              :invalid="submitted && !makeEntry.page_meta_tags"
            />
          </div>
          <div class="field">
            <label for="title"
              >Meta Description <span class="text-red-400"> *</span></label
            >
            <InputText
              v-model.trim="makeEntry.page_description"
              required
              autofocus
              :invalid="submitted && !makeEntry.page_description"
            />
          </div>
          <template #footer>
            <Button
              label="Cancel"
              icon="pi pi-times"
              class="mr-2"
              severity="danger"
              @click="hideDialog"
            />
            <Button
              label="Save"
              icon="pi pi-check"
              class="mr-2"
              severity="success"
              @click="updatePlan"
            />
          </template>
        </Dialog>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useToast } from "primevue/usetoast";
const toast = useToast();
const TableData = ref(null);
const loading = ref(false);
const editDialog = ref(false);
const submitted = ref(false);

const makeEntry = reactive({
  page_id: "",
  page_title: "",
  page_meta_tags: null,
  page_description: "",
});

const getTableData = async () => {
  loading.value = true;
  try {
    const response = await fetch("https://fashtsaly.com/API/public/api/getMetaTags", {
      method: "GET",
    });
    if (response.ok) {
      const jsonResponse = await response.json();
      TableData.value = jsonResponse;
      loading.value = false;
    } else {
      toast.add({ severity: "error", summary: "Server Error", life: 3000 });
    }
  } catch (error) {
    toast.add({ severity: "error", summary: "Something went wrong", life: 3000 });
  } finally {
    loading.value = false;
  }
};

const editEntryOpen = (pageData) => {
  makeEntry.page_id = pageData.id;
  makeEntry.page_title = pageData.page_title;
  makeEntry.page_meta_tags = pageData.meta_tags;
  makeEntry.page_description = pageData.description;
  editDialog.value = true;
};

const hideDialog = () => {
  editDialog.value = false;
};

const updatePlan = async () => {
  submitted.value = true;
  if (makeEntry.page_title && makeEntry.page_meta_tags) {
    const url = "api/updateMetaTags";

    try {
      const response = await makeCustomRequest({
        url: url,
        method: "POST",
        body: {
          page_id: makeEntry.page_id,
          title: makeEntry.page_title,
          meta_tags: makeEntry.page_meta_tags,
          description: makeEntry.page_description,
        },
      });
      if (response) {
        toast.add({
          severity: "success",
          summary: "Updated successfully",
          life: 3000,
        });
        hideDialog();
        await getTableData();
      } else {
        toast.add({ severity: "error", summary: "Update failed", life: 3000 });
      }
    } catch (error) {
      toast.add({ severity: "error", summary: "Something went wrong", life: 3000 });
    } finally {
      submitted.value = false;
    }
  }
};

onMounted(() => {
  getTableData();
});
</script>

<style lang="scss">
@media (max-width: 768px) {
}
</style>
