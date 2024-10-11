<template>
  <div class="grid">
    <div class="col-12">
      <div class="card">
        <div v-if="!loading && TableData" class="CustomResponsiveTable table-container">
          <DataTable v-if="TableData" ref="table" :value="TableData" dataKey="id">
            <template #header>
              <div
                class="flex flex-column md:flex-row md:justify-content-between md:align-items-center"
              >
                <h5 class="m-0">Manage Blog Posts</h5>
                <Button
                  @click="navigateToAdd"
                  severity="Edit"
                  icon="pi pi-plus"
                  label="Add New Blog"
                />
              </div>
            </template>
            <Column field="id" header="ID" headerStyle="width:auto; min-width:2rem;">
              <template #body="slotProps">
                <span class="p-column-title">ID</span>
                {{ slotProps.data.id }}
              </template>
            </Column>
            <Column
              field="title"
              header="Title"
              headerStyle="width:auto; min-width:15rem;"
            >
              <template #body="slotProps">
                <span class="p-column-title">Title</span>
                {{ slotProps.data.title }}
              </template>
            </Column>
            <Column
              field="created date"
              header="created date"
              headerStyle="width:auto; min-width:15rem;"
            >
              <template #body="slotProps">
                <span class="p-column-title">Title</span>
                {{ slotProps.data.created_at }}
              </template>
            </Column>
            <Column header="Actions" headerStyle="width:auto; min-width:8rem;">
              <template #body="slotProps">
                <span class="p-column-title">Actions</span>
                <div class="flex gap-2">
                  <Button
                    @click="editBlog(slotProps.data.id)"
                    severity="Edit"
                    icon="pi pi-pencil"
                  />
                  <Button
                    @click="deleteBlog(slotProps.data.id)"
                    severity="warning"
                    icon="pi pi-trash"
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
      </div>
    </div>
  </div>
</template>

<script setup>
import { useToast } from "primevue/usetoast";
const toast = useToast();
const TableData = ref([]);
const loading = ref(false);

const getTableData = async () => {
  loading.value = true;
  try {
    const response = await makeCustomRequest({
      url: "api/Blogs",
      method: "GET",
    });
    if (response) {
      TableData.value = response;
    } else {
      toast.add({ severity: "error", summary: "Server Error", life: 3000 });
    }
  } catch (error) {
    toast.add({ severity: "error", summary: "Something went wrong", life: 3000 });
  } finally {
    loading.value = false;
  }
};

const editBlog = (id) => {};

const navigateToAdd = () => {
  navigateTo("/blogs/manageblog");
};

const deleteBlog = async (id) => {
  try {
    const response = await makeCustomRequest({
      url: `api/Blogs/${id}`,
      method: "GET",
    });
    if (response) {
      getTableData();
    }
  } catch {
    toast.add({ severity: "warn", summary: `Delete blog ID: ${id}`, life: 3000 });
  }
};

onMounted(() => {
  getTableData();
});
</script>

<style lang="scss">
@media (max-width: 768px) {
  // Add responsive styles here
}
</style>
