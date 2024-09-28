<script setup>
const filters = ref(getFilter(['plan']));
const data = ref(null);
const loading = ref(false);
const page = ref(1); 
const totalPages = ref(0);
const tableError = ref(false);
const getTableData =async () => {
  if(filters.value.from_date instanceof Date){
    filters.value.from_date = `${filters.value.from_date.getFullYear()}-${(filters.value.from_date.getMonth() + 1).toString().padStart(2, '0')}-${filters.value.from_date.getDate().toString().padStart(2, '0')}`;    
  }
  if(filters.value.to_date instanceof Date){
    filters.value.to_date = `${filters.value.to_date.getFullYear()}-${(filters.value.to_date.getMonth() + 1).toString().padStart(2, '0')}-${filters.value.to_date.getDate().toString().padStart(2, '0')}`;
  }
  loading.value = true;
  const response = await makeCustomRequest({
    url : `api/subscriptionPlanReport?page=${page.value}`,
    method : 'GET',
    query : {
      ...filters.value
    }
  });
  if(response.success){
    const total_records = response.data.total;
    const per_page = response.data.per_page;
    totalPages.value = Math.ceil(total_records/per_page);
    data.value = response.data.data;
  }
  else{
    tableError.value = true;
  }
  loading.value = false;
}
watch((page) => {
  getTableData();
});
onMounted(() => {
  getTableData();
})
</script>
<template>
  <reportFielder :filters="filters" @filter="getTableData" />
  <DataTable
          v-if="data && data.length"
          class="mt-3"
          ref="table"
          :value="data"
          dataKey="id"
          :rows="10">
          <template #header>
            <div
              class="flex flex-column md:flex-row md:justify-content-between md:align-items-center"
            >
              <h5 class="m-0">Seller wise sales report</h5>
              <IconField iconPosition="left" class="block mt-2 md:mt-0">
                <InputIcon class="pi pi-search" />
                <InputText class="w-full sm:w-auto" placeholder="Search..." />
              </IconField>
            </div>
          </template>
          <Column field="ID" header="S.NO" headerStyle="width:auto; min-width:10rem;">
            <template #body="slotProps">
              <span class="p-column-title">S.No</span>
              {{ slotProps.data.count }}
            </template>
          </Column>
          <Column field="Type" header="User Name" headerStyle="width:auto; min-width:10rem;">
            <template #body="slotProps">
              <span class="p-column-title">Seller ID</span>
              {{ slotProps.data.user_name ? slotProps.data.user_name : '' }}
            </template>
          </Column>
          <Column field="Type" header="Plan Name" headerStyle="width:auto; min-width:10rem;">
            <template #body="slotProps">
              <span class="p-column-title"> Plan Name</span>
              {{ slotProps.data.plan_name ? slotProps.data.plan_name : '' }}
            </template>
          </Column>
          <Column field="Title" header="Ends on" headerStyle="width:auto; min-width:10rem;">
            <template #body="slotProps">
              <span class="p-column-title">Ends on</span>
              {{ slotProps.data.ends_on ? slotProps.data.ends_on : '' }}
            </template>
          </Column>
          <Column field="Title" header="Brand" headerStyle="width:auto; min-width:10rem;">
            <template #body="slotProps">
              <span class="p-column-title">Brand</span>
              {{ slotProps.data.brand }}
            </template>
          </Column>
          <Column field="Title" header="Role" headerStyle="width:auto; min-width:10rem;">
            <template #body="slotProps">
              <span class="p-column-title">Brand</span>
              {{ slotProps.data.gstNo }}
            </template>
          </Column>
          <Column field="Title" header="Address" headerStyle="width:auto; min-width:10rem;">
            <template #body="slotProps">
              <span class="p-column-title">Brand</span>
              {{ slotProps.data.address }}
            </template>
          </Column>
          <Column field="Title" header="Whatsapp No" headerStyle="width:auto; min-width:10rem;">
            <template #body="slotProps">
              <span class="p-column-title">Whatsapp No</span>
              {{ slotProps.data.whatsapp }}
            </template>
          </Column>
          <Column field="Title" header="Social media" headerStyle="width:auto; min-width:10rem;">
            <template #body="slotProps">
              <span class="p-column-title">socLink</span>
              {{ slotProps.data.socLink }}
            </template>
          </Column>
          <Column field="Title" header="GST No" headerStyle="width:auto; min-width:10rem;">
            <template #body="slotProps">
              <span class="p-column-title">GST No</span>
              {{ slotProps.data.gstNo }}
            </template>
          </Column>
          <template #footer>
            <TableFooter :totalPages="totalPages" v-model="page"></TableFooter>
          </template>
        </DataTable>
        <div v-else-if="loading" class="text-center card mt-3">
          <i class="pi pi-spin pi-spinner text-5xl"></i><br>
          <span class="text-3xl">Fetching Data ...</span>
        </div>
        <div v-else-if="!loading && !tableError" class="text-center card mt-3">
          <i class="pi pi-ban text-5xl"></i><br>
          <span class="text-3xl">No Data Found</span>
        </div>
        <div v-else class="text-center card mt-3">
          <i class="pi pi-times-circle text-5xl"></i><br>
          <span class="text-3xl text-red-400">Error in Fetching Data!</span>
        </div>
</template>
