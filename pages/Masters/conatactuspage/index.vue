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
                <h5 class="m-0">Manage Contact us data</h5>
              </div>
            </template>
            <Column field="id" header="No" headerStyle="width:auto; min-width:2rem;">
              <template #body="slotProps">
                <span class="p-column-title">No</span>
                {{ slotProps.data.id }}
              </template>
            </Column>

            <Column
              field="title"
              header="Name"
              headerStyle="width:auto; min-width:10rem;"
            >
              <template #body="slotProps">
                <span class="p-column-title">Name</span>
                {{ slotProps.data.name }}
              </template>
            </Column>
            <Column
              field="title"
              header="Phone"
              headerStyle="width:auto; min-width:5rem;"
            >
              <template #body="slotProps">
                <span class="p-column-title">Phone</span>
                {{ slotProps.data.phone }}
              </template>
            </Column>
            <Column
              field="title"
              header="Email"
              headerStyle="width:auto; min-width:8rem;"
            >
              <template #body="slotProps">
                <span class="p-column-title">Email</span>
                {{ slotProps.data.email }}
              </template>
            </Column>
            <Column
              field="title"
              header="Message"
              headerStyle="width:auto; min-width:15rem;"
            >
              <template #body="slotProps">
                <span class="p-column-title">Message</span>
                {{ slotProps.data.message }}
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
import { ref, reactive, onMounted } from "vue";
import { useToast } from "primevue/usetoast";
const toast = useToast();
const TableData = ref(null);
const loading = ref(false);
const submitted = ref(false);

const getTableData = async () => {
  loading.value = true;
  try {
    const response = await fetch("https://fashtsaly.com/API/public/api/getQuery", {
      method: "GET",
    });
    if (response.ok) {
      const jsonResponse = await response.json();
      TableData.value = jsonResponse.data;
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

onMounted(() => {
  getTableData();
});
</script>

<style lang="scss">
@media (max-width: 768px) {
}
</style>
