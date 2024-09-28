<script setup>
const filters = ref(getFilter(['product' , 'user' , 'category']));
const data = ref(null);
const loading = ref(false);
const getTableData =async () => {
  if(filters.value.from_date instanceof Date){
    filters.value.from_date = `${filters.value.from_date.getFullYear()}-${(filters.value.from_date.getMonth() + 1).toString().padStart(2, '0')}-${filters.value.from_date.getDate().toString().padStart(2, '0')}`;    
  }
  if(filters.value.to_date instanceof Date){
    filters.value.to_date = `${filters.value.to_date.getFullYear()}-${(filters.value.to_date.getMonth() + 1).toString().padStart(2, '0')}-${filters.value.to_date.getDate().toString().padStart(2, '0')}`;
  }  
  loading.value = true;
  const response = await makeCustomRequest({
    url : `api/stockReport`,
    method : 'GET',
    query : {
      ...filters.value
    }
  });
  if(response.success){
    data.value = response.data;
  }
  else{

  }
  loading.value = false;
}
watch((page) => {
  getTableData();
},
{immediate : false});
onMounted(() => {
  getTableData();
})
</script>
<template>
  <reportFielder :filters="filters" @filter="getTableData" />
  <DataTable
          v-if="data"
          class="mt-3"
          ref="table"
          :value="data"
          dataKey="id"
          :rows="10">
          <template #header>
            <div
              class="flex flex-column md:flex-row md:justify-content-between md:align-items-center"
            >
              <h5 class="m-0">Product wise stock report</h5>
              <IconField iconPosition="left" class="block mt-2 md:mt-0">
                <InputIcon class="pi pi-search" />
                <InputText class="w-full sm:w-auto" placeholder="Search..." />
              </IconField>
            </div>
          </template>
          <Column field="ID" header="S.No" headerStyle="width:auto; min-width:10rem;">
            <template #body="slotProps">
              <span class="p-column-title">Count</span>
              {{ slotProps.data.count }}
            </template>
          </Column>
          <Column field="Type" header="Name" headerStyle="width:auto; min-width:10rem;">
            <template #body="slotProps">
              <span class="p-column-title">Name</span>
              {{ slotProps.data.name ? slotProps.data.name : '' }}
            </template>
          </Column>
          <Column field="Type" header="Total SKU" headerStyle="width:auto; min-width:10rem;">
            <template #body="slotProps">
              <span class="p-column-title"> Total SKU</span>
              {{ slotProps.data.total_sku ? slotProps.data.total_sku : '' }}
            </template>
          </Column>
          <Column field="Title" header="Total stock" headerStyle="width:auto; min-width:10rem;">
            <template #body="slotProps">
              <span class="p-column-title">Total stock</span>
              {{ slotProps.data.total_stock }}
            </template>
          </Column>
          <Column field="Title" header="Stock < 10" headerStyle="width:auto; min-width:10rem;">
            <template #body="slotProps">
              <span class="p-column-title">Stock < 10</span>
              {{ slotProps.data.low_stock }}
            </template>
          </Column>
          <Column field="Title" header="Vendor Name" headerStyle="width:auto; min-width:10rem;">
            <template #body="slotProps">
              <span class="p-column-title">Vendor Name</span>
              {{ slotProps.data.vendor }}
            </template>
          </Column>
          <Column field="Title" header="Created At" headerStyle="width:auto; min-width:10rem;">
            <template #body="slotProps">
              <span class="p-column-title">Created at</span>
              {{ slotProps.data.created_at ? slotProps.data.created_at : '' }}
            </template>
          </Column>
        </DataTable>
        <div v-else-if="loading" class="text-center card mt-3">
          <i class="pi pi-spin pi-spinner text-5xl"></i><br>
          <span class="text-3xl">Fetching Data ...</span>
        </div>
        <div v-else>
          <i class="pi pi-times-circle text-5xl"></i><br>
          <span class="text-3xl text-red-400">Error in Fetching Data!</span>
        </div>
</template>
