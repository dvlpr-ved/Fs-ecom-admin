<script setup>
const filters = ref(getFilter(['product' , 'user']));
const data = ref(null);
const loading = ref(false);
const page = ref(1); 
const totalPages = ref(0);
const getTableData =async () => {
  if(filters.value.from_date instanceof Date){
    filters.value.from_date = `${filters.value.from_date.getFullYear()}-${(filters.value.from_date.getMonth() + 1).toString().padStart(2, '0')}-${filters.value.from_date.getDate().toString().padStart(2, '0')}`;    
  }
  if(filters.value.to_date instanceof Date){
    filters.value.to_date = `${filters.value.to_date.getFullYear()}-${(filters.value.to_date.getMonth() + 1).toString().padStart(2, '0')}-${filters.value.to_date.getDate().toString().padStart(2, '0')}`;
  }  
  loading.value = true;
  const response = await makeCustomRequest({
    url : `api/skuWiseStockReport?page=${page.value}`,
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
              <h5 class="m-0">SKU wise stock report</h5>
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
          <Column field="Type" header="Product" headerStyle="width:auto; min-width:10rem;">
            <template #body="slotProps">
              <span class="p-column-title">Product</span>
              {{ slotProps.data.product_name ? slotProps.data.product_name : slotProps.data.product_name }}
            </template>
          </Column>
          <Column field="Type" header="SKU color" headerStyle="width:auto; min-width:10rem;">
            <template #body="slotProps">
              <span class="p-column-title">color</span>
              {{ slotProps.data.color ? slotProps.data.color : '' }}
            </template>
          </Column>
          <Column field="Title" header="Size" headerStyle="width:auto; min-width:10rem;">
            <template #body="slotProps">
              <span class="p-column-title">SKU size</span>
              {{ slotProps.data.size }}
            </template>
          </Column>
          <Column field="Title" header="SKU stock" headerStyle="width:auto; min-width:10rem;">
            <template #body="slotProps">
              <span class="p-column-title">SKU stock</span>
              {{ slotProps.data.stock }}
            </template>
          </Column>
          <Column field="Title" header="SKU price/pc" headerStyle="width:auto; min-width:10rem;">
            <template #body="slotProps">
              <span class="p-column-title">SKU price/pc</span>
              {{ slotProps.data.price }}
            </template>
          </Column>
          <Column field="Title" header="Created by" headerStyle="width:auto; min-width:10rem;">
            <template #body="slotProps">
              <span class="p-column-title">Created by</span>
              {{ slotProps.data.user_name_added ? slotProps.data.user_name_added : '' }}
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
        <div v-else>
          <i class="pi pi-times-circle text-5xl"></i><br>
          <span class="text-3xl text-red-400">Error in Fetching Data!</span>
        </div>
</template>
