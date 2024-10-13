<script setup>
import Dropdown from "primevue/dropdown";
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
const order_status = ref('');
const order_status_id = ref('');
const orderStatusShown = ref(false);
const order_traking_status = ref('');
const order_status_options = ref([
  {
    label : "Ordered",
    value : 1,
  },
  {
    label : "Ready to dispatch",
    value : 2,
  },
  {
    label : "Shipped",
    value : 3,    
  },
  {
    label : "Complete",
    value : 4,    
  },
  {
    label : "Return/Exchnage",
    value : 5,    
  }     
]);
const openOrderStatus = (data) => {
  order_status_id.value = data.id;
  order_status.value = data.order_status;
  order_traking_status.value = data.tracking_status;
  orderStatusShown.value = true;
}
const openStatusChnageModal = () => {

}
const updateOrderStatus =async (id) => {
  const response = await makeCustomRequest({
    url : 'api/changeOrderStatus',
    method : 'POST',
    body : {
      order_id : order_status_id.value,
      status : order_status.value,
      tracking_status : order_traking_status.value
    }
  });
  if(response.success){
  orderStatusShown.value = false;  
  getTableData();  
    toast.add({ severity: "success", summary: "Updated successfully", life: 3000 });
  }
  else{
  orderStatusShown.value = false;
  getTableData();    
    toast.add({ severity: "error", summary: "Something went wrong", life: 3000 });
  }
}
const printChallan = async (prod) => {
  const response = await makeCustomRequest({
    url : ``,
    method : 'POST',
    body : {
      order : prod.id
    }
  })
}
const editOrderModal = ref(false);
const fetchingEditOrderData = ref(false);
const editOrder = ref();
const editOrderDetails = ref();
const editData = reactive({
  name : '',
  phone : '',
  email : '',
  pincode	: '',
  locality	 : '',
  address	 : '',
  city	 : '',
  state	 : '',
  landmark	 : '',
  tracking_status : ''
});
const editInvoice = async (prod) => {
  fetchingEditOrderData.value = true;
  const response = await makeCustomRequest({
    url : `api/getEditOrderData`,
    method : 'POST',
    body : {
      order_id : prod.id
    }
  });
  if(response.success){
    fetchingEditOrderData.value = false;
    editOrderModal.value = true;
    editOrder.value  = response.data;
    editOrderDetails.value = response.details;
    editData.name  = response.data.name;
    editData.phone  = response.data.phone;
    editData.email  = response.data.email;
    editData.pincode  = response.data.pincode;
    editData.locality  = response.data.locality;
    editData.address  = response.data.address;
    editData.city  = response.data.city;
    editData.state  = response.data.state;
    editData.landmark  = response.data.landmark;
    editData.tracking_status  = response.data.tracking_status;
    console.log(response.data);
  }
  else{
    fetchingEditOrderData.value = false;
    toast.add({
      severity: "error",
      summary: "Some Error occured",
      life: 3000,
    });
  }
}
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
    <Column field="title" header="View detail" headerStyle="width:auto; min-width:15rem;">
      <template #body="slotProps">
        <span class="p-column-title">View detail</span>
        <Button
          @click="showDetails(slotProps.data.id)"
          icon="pi pi-eye"
          rounded
          class="px-1"
          severity=""
        ></Button>
        <Button
          @click="openOrderStatus(slotProps.data)"
          icon="pi pi-refresh"
          rounded
          class="px-1"
          severity=""
        ></Button>
        <Button
          @click="printChallan(slotProps.data)"
          icon="pi pi-print"
          rounded
          class="px-1"
          severity=""
        ></Button>
        <Button
          @click="editInvoice(slotProps.data)"
          icon="pi pi-pencil"
          rounded
          :loading="fetchingEditOrderData"
          class="px-1"
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
  <Dialog v-model:visible="orderStatusShown"
          :style="{ width: '450px' }"
          header="Update Order Status"
          :modal="true"
          class="p-fulid"
        >
        <div class="feild grid gap-1 mt-2">
          <div class="col-12 feild">
            <Dropdown
                v-model="order_status"
                :options="order_status_options"
                optionLabel="label"
                optionValue="value"
                placeholder="Select"
                class="w-full"
              />            
          </div>
          <div v-if="order_status == 2" class="col-12">
            <textarea v-model="order_traking_status" rows="5" class="w-full"></textarea>
          </div>
        </div>
          <template #footer>
            <Button label="Cancel" icon="pi pi-times" class="mr-2" severity="danger" @click="orderStatusShown = false"/>
            <Button label="Save" icon="pi pi-check" class="mr-2"severity="success"
              @click="updateOrderStatus"
            />
          </template>          
        </Dialog>
    
        <Dialog
      v-model:visible="editOrderModal"
      position="top"
      :style="{ width: '90%' }"
      header="Edit order"
      :modal="true"
      class="p-fluid"
    >
    <div class="feild grid gap-1 mt-2">
        <div class="field lg:col-2 col-12">
          <label for="name">Reciever name <span class="text-red-400">*</span></label>
          <InputText
            id="name"
            v-model.trim="editData.name"
            required="true"
            autofocus
          />
        </div>
        <div class="field lg:col-2 col-12">
          <label for="name">Reciever phone <span class="text-red-400">*</span></label>
          <InputText
            id="name"
            v-model.trim="editData.phone"
            required="true"
            autofocus
          />
        </div>
        <div class="field lg:col-2 col-12">
          <label for="name">Reciever email <span class="text-red-400">*</span></label>
          <InputText
            id="name"
            v-model.trim="editOrder.email"
            required="true"
            autofocus
          />
        </div>
        <div class="field lg:col-2 col-12">
          <label for="name">Reciever pincode<span class="text-red-400">*</span></label>
          <InputText
            id="name"
            v-model.trim="editOrder.pincode"
            required="true"
            autofocus
          />
        </div>
        <div class="field lg:col-2 col-12">
          <label for="name">Reciever locality<span class="text-red-400">*</span></label>
          <InputText
            id="name"
            v-model.trim="editOrder.locality"
            required="true"
            autofocus
          />
        </div>
        <div class="field lg:col-2 col-12">
          <label for="name">Reciever address<span class="text-red-400">*</span></label>
          <InputText
            id="name"
            v-model.trim="editOrder.address"
            required="true"
            autofocus
          />
        </div>
        <div class="field lg:col-2 col-12">
          <label for="name">Reciever city<span class="text-red-400">*</span></label>
          <InputText
            id="name"
            v-model.trim="editOrder.city"
            required="true"
            autofocus
          />
        </div>
        <div class="field lg:col-2 col-12">
          <label for="name">Reciever state<span class="text-red-400">*</span></label>
          <InputText
            id="name"
            v-model.trim="editOrder.state"
            required="true"
            autofocus
          />
        </div>
        <div class="field lg:col-2 col-12">
          <label for="name">Reciever landmark<span class="text-red-400">*</span></label>
          <InputText
            id="name"
            v-model.trim="editOrder.landmark"
            required="true"
            autofocus
          />
        </div>
        <div class="field lg:col-2 col-12">
          <label for="name">Tracking status<span class="text-red-400">*</span></label>
          <InputText
            id="name"
            v-model.trim="editOrder.tracking_status"
            required="true"
            autofocus
          />
        </div>        
        
    </div>    
  </Dialog>          
        
</template>