<script setup>
import { useToast } from "primevue/usetoast";
const toast = useToast();
const filters = ref(getFilter(["product", "user", "category"]));
const userData = ref(null);
const detailDialog = ref(false);
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
    url: `api/salesOrderReport?page=${page.value}`,
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

const showDetails = async (order_id, details = 1) => {
  const response = await makeCustomRequest({
    url: `api/salesOrderReport?details=1&order_id=${order_id}`,
    method: "GET",
  });
  if (response) {
    userData.value = response;
    detailDialog.value = true;
  } else {
    toast.add({
      severity: "error",
      summary: "error in getting seles data",
      life: 3000,
    });
  }
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
        <h5 class="m-0">Sales order report</h5>
        <IconField iconPosition="left" class="block mt-2 md:mt-0">
          <InputIcon class="pi pi-search" />
          <InputText class="w-full sm:w-auto" placeholder="Search..." />
        </IconField>
      </div>
    </template>
    <Column field="ID" header="ID" headerStyle="width:auto; min-width:10rem;">
      <template #body="slotProps">
        <span class="p-column-title">ID</span>
        {{ slotProps.data.id }}
      </template>
    </Column>
    <Column field="Type" header="Ordered by" headerStyle="width:auto; min-width:10rem;">
      <template #body="slotProps">
        <span class="p-column-title">Ordered by</span>
        {{
          slotProps.data.user_name ? slotProps.data.user_name : slotProps.data.user_name
        }}
      </template>
    </Column>
    <Column field="Type" header="Ordered at" headerStyle="width:auto; min-width:10rem;">
      <template #body="slotProps">
        <span class="p-column-title">Ordered at</span>
        {{ slotProps.data.created_at ? slotProps.data.created_at : "" }}
      </template>
    </Column>
    <Column field="Title" header="No of SKU" headerStyle="width:auto; min-width:10rem;">
      <template #body="slotProps">
        <span class="p-column-title">No of SKU</span>
        {{ slotProps.data.name }}
      </template>
    </Column>
    <Column field="Title" header="Subtotal" headerStyle="width:auto; min-width:10rem;">
      <template #body="slotProps">
        <span class="p-column-title">Subtotal</span>
        {{ slotProps.data.subtotal }}
      </template>
    </Column>
    <Column
      field="Title"
      header="Delivery Name"
      headerStyle="width:auto; min-width:10rem;"
    >
      <template #body="slotProps">
        <span class="p-column-title">Delivery Name</span>
        {{ slotProps.data.name }}
      </template>
    </Column>
    <Column
      field="Title"
      header="Delivery Phone"
      headerStyle="width:auto; min-width:10rem;"
    >
      <template #body="slotProps">
        <span class="p-column-title">Delivery Phone</span>
        {{ slotProps.data.phone ? slotProps.data.phone : "" }}
      </template>
    </Column>
    <Column
      field="Title"
      header="Delivery Email"
      headerStyle="width:auto; min-width:10rem;"
    >
      <template #body="slotProps">
        <span class="p-column-title">Delivery Email</span>
        {{ slotProps.data.email }}
      </template>
    </Column>
    <Column
      field="Title"
      header="Delivery Pincode"
      headerStyle="width:auto; min-width:10rem;"
    >
      <template #body="slotProps">
        <span class="p-column-title">Delivery Pincode</span>
        {{ slotProps.data.pincode }}
      </template>
    </Column>
    <Column
      field="Title"
      header="Delivery Locality"
      headerStyle="width:auto; min-width:10rem;"
    >
      <template #body="slotProps">
        <span class="p-column-title">Delivery Locality</span>
        {{ slotProps.data.locality }}
      </template>
    </Column>
    <Column
      field="Title"
      header="Delivery Address"
      headerStyle="width:auto; min-width:10rem;"
    >
      <template #body="slotProps">
        <span class="p-column-title">Delivery Address</span>
        {{ slotProps.data.address }}
      </template>
    </Column>
    <Column
      field="Title"
      header="Delivery Address"
      headerStyle="width:auto; min-width:10rem;"
    >
      <template #body="slotProps">
        <span class="p-column-title">Delivery City</span>
        {{ slotProps.data.city }}
      </template>
    </Column>
    <Column
      field="Title"
      header="Delivery State"
      headerStyle="width:auto; min-width:10rem;"
    >
      <template #body="slotProps">
        <span class="p-column-title">Delivery State</span>
        {{ slotProps.data.state }}
      </template>
    </Column>
    <Column
      field="Title"
      header="Delivery Landmark"
      headerStyle="width:auto; min-width:10rem;"
    >
      <template #body="slotProps">
        <span class="p-column-title">Delivery Landmark</span>
        {{ slotProps.data.landmark }}
      </template>
    </Column>
    <Column field="Title" header="COD" headerStyle="width:auto; min-width:10rem;">
      <template #body="slotProps">
        <span class="p-column-title">COD</span>
        {{ slotProps.data.is_cod == 1 ? "Yes" : "No" }}
      </template>
    </Column>
    <Column field="title" header="View detail" headerStyle="width:auto; min-width:10rem;">
      <template #body="slotProps">
        <span class="p-column-title">View detail</span>
        <Button
          @click="showDetails(slotProps.data.id)"
          icon="pi pi-eye"
          rounded
          severity=""
        ></Button>
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
  <Dialog
    v-model:visible="detailDialog"
    :style="{ width: '1024px' }"
    header="user sales data"
    :modal="true"
    class="p-fluid"
  >
    <DataTable
      v-if="userData"
      class="mt-3"
      ref="table"
      :value="userData"
      dataKey="id"
      :rows="10"
    >
      <!-- <Column field="ID" header="S.No" headerStyle="width:auto; min-width:10rem;">
        <template #body="slotProps">
          <span class="p-column-title">S.No</span>
          {{ slotProps.data.id }}
        </template>
      </Column> -->
      <Column field="Type" header="Ordered Id" headerStyle="width:auto; min-width:10rem;">
        <template #body="slotProps">
          <span class="p-column-title">Ordered Id</span>
          {{ slotProps.data.order_id }}
        </template>
      </Column>
      <Column field="Type" header="Ordered at" headerStyle="width:auto; min-width:10rem;">
        <template #body="slotProps">
          <span class="p-column-title">Ordered at</span>
          {{ slotProps.data.created_at ? slotProps.data.created_at : "" }}
        </template>
      </Column>
      <Column field="Title" header="quantity" headerStyle="width:auto; min-width:10rem;">
        <template #body="slotProps">
          <span class="p-column-title">quantity</span>
          {{ slotProps.data.quantity }}
        </template>
      </Column>
      <Column
        field="Title"
        header="price_per_pc"
        headerStyle="width:auto; min-width:10rem;"
      >
        <template #body="slotProps">
          <span class="p-column-title">price_per_pc</span>
          {{ slotProps.data.price_per_pc }}
        </template>
      </Column>
      <Column field="Title" header="sku name" headerStyle="width:auto; min-width:10rem;">
        <template #body="slotProps">
          <span class="p-column-title">sku name</span>
          {{ slotProps.data.sku_name }}
        </template>
      </Column>
      <Column field="Title" header="color" headerStyle="width:auto; min-width:10rem;">
        <template #body="slotProps">
          <span class="p-column-title">color</span>
          {{ slotProps.data.color }}
        </template>
      </Column>
      <Column field="Title" header="Size" headerStyle="width:auto; min-width:10rem;">
        <template #body="slotProps">
          <span class="p-column-title">Size</span>
          {{ slotProps.data.size }}
        </template>
      </Column>
      <Column field="Title" header="subtotal" headerStyle="width:auto; min-width:10rem;">
        <template #body="slotProps">
          <span class="p-column-title">subtotal</span>
          {{ slotProps.data.subtotal }}
        </template>
      </Column>
    </DataTable>
  </Dialog>
</template>
