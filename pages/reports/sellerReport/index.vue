<script setup>
const filters = ref(getFilter([]));
const data = ref(null);
const loading = ref(false);
const page = ref(1);
const totalPages = ref(0);
const getTableData = async () => {
  if (filters.value.from_date instanceof Date) {
    filters.value.from_date = `${filters.value.from_date.getFullYear()}-${(
      filters.value.from_date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}-${filters.value.from_date
      .getDate()
      .toString()
      .padStart(2, "0")}`;
  }
  if (filters.value.to_date instanceof Date) {
    filters.value.to_date = `${filters.value.to_date.getFullYear()}-${(
      filters.value.to_date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}-${filters.value.to_date.getDate().toString().padStart(2, "0")}`;
  }
  loading.value = true;
  const response = await makeCustomRequest({
    url: `api/sellerReport?page=${page.value}`,
    method: "GET",
    query: {
      ...filters.value,
    },
  });
  if (response.success) {
    const total_records = response.data.total;
    const per_page = response.data.per_page;
    totalPages.value = Math.ceil(total_records / per_page);
    data.value = response.data.data;
  } else {
  }
  loading.value = false;
};
watch((page) => {
  getTableData();
});
onMounted(() => {
  getTableData();
});
</script>
<template>
  <reportFielder :filters="filters" @filter="getTableData" />
  <DataTable v-if="data" class="mt-3" ref="table" :value="data" dataKey="id" :rows="10">
    <template #header>
      <div
        class="flex flex-column md:flex-row md:justify-content-between md:align-items-center"
      >
        <h5 class="m-0">Customers</h5>
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
        <span class="p-column-title">user name</span>
        {{
          slotProps.data.name
            ? slotProps.data.name
            : slotProps.data.name
        }}
      </template>
    </Column>
    <Column field="Type" header="Email" headerStyle="width:auto; min-width:10rem;">
      <template #body="slotProps">
        <span class="p-column-title">email</span>
        {{ slotProps.data.email }}
      </template>
    </Column>    
    <Column field="Type" header="Gst No" headerStyle="width:auto; min-width:10rem;">
      <template #body="slotProps">
        <span class="p-column-title">phone</span>
        {{ slotProps.data.gst_no ? slotProps.data.gst_no : "" }}
      </template>
    </Column>
    <Column field="Title" header="Email" headerStyle="width:auto; min-width:10rem;">
      <template #body="slotProps">
        <span class="p-column-title">SKU size</span>
        {{ slotProps.data.email }}
      </template>
    </Column>
    <Column field="Title" header="Pincode" headerStyle="width:auto; min-width:10rem;">
      <template #body="slotProps">
        <span class="p-column-title">SKU stock</span>
        {{ slotProps.data.pincode }}
      </template>
    </Column>
    <Column field="Title" header="Locality" headerStyle="width:auto; min-width:10rem;">
      <template #body="slotProps">
        <span class="p-column-title">Created at</span>
        {{ slotProps.data.locality ? slotProps.data.locality : "" }}
      </template>
    </Column>
    <Column field="Title" header="City" headerStyle="width:auto; min-width:10rem;">
      <template #body="slotProps">
        <span class="p-column-title">Created at</span>
        {{ slotProps.data.city	 ? slotProps.data.city	 : "" }}
      </template>
    </Column>
    <Column field="Title" header="State" headerStyle="width:auto; min-width:10rem;">
      <template #body="slotProps">
        <span class="p-column-title">Created at</span>
        {{ slotProps.data.state	 ? slotProps.data.state	 : "" }}
      </template>
    </Column>
    <Column field="Title" header="Landmark" headerStyle="width:auto; min-width:10rem;">
      <template #body="slotProps">
        <span class="p-column-title">Created at</span>
        {{ slotProps.data.landmark	 ? slotProps.data.landmark	 : "" }}
      </template>
    </Column>
    <Column field="Title" header="Approved at" headerStyle="width:auto; min-width:10rem;">
      <template #body="slotProps">
        <span class="p-column-title">Created at</span>
        {{ slotProps.data.approved_at ? slotProps.data.approved_at : "" }}
      </template>
    </Column>
    <Column field="Title" header="Social media" headerStyle="width:auto; min-width:10rem;">
      <template #body="slotProps">
        <span class="p-column-title">Created at</span>
        <nuxt-link :to="slotProps.data.social_media" target="_blank">{{ slotProps.data.social_media	 ? slotProps.data.social_media	 : "" }}</nuxt-link>
      </template>
    </Column>
    <template #footer>
      <TableFooter :totalPages="totalPages" v-model="page"></TableFooter>
    </template>
  </DataTable>
  <div v-else-if="loading" class="text-center card mt-3">
    <i class="pi pi-spin pi-spinner text-5xl"></i><br />
    <span class="text-3xl">Fetching Data ...</span>
  </div>
  <div v-else>
    <i class="pi pi-times-circle text-5xl"></i><br />
    <span class="text-3xl text-red-400">Error in Fetching Data!</span>
  </div>
</template>
