<script setup>
import Calendar from "primevue/calendar";
import { useToast } from "primevue/usetoast";

const { filters, userLabelText } = defineProps({
  filters: {
    type: Object,
    default: {
      from_date: "",
      to_date: "",
      product_id: "",
      category_id: "",
      user_id: "",
      plan_id: "",
    },
    // userLabelText: {
    //   type: String,
    //   default: "Seller",
    // },
  },
});
const toast = useToast();
const showToast = (message) => {
  toast.add({ severity: "info", detail: message, life: 3000 });
};

const isLoading = ref(false);
const pluckProductsList = ref([]);
const pluckSellerList = ref([]);
const pluckCategoryList = ref([]);
const pluckPlansyList = ref([]);

const emit = defineEmits(["filter"]);

const fetchData = async (url, listRef) => {
  isLoading.value = true;
  try {
    const response = await makeCustomRequest({ url, method: "GET" });
    if (response?.data) {
      listRef.value = response.data;
    } else {
      showToast("No data received");
    }
  } catch (error) {
    showToast(`Error fetching data: ${error.message || error}`);
  } finally {
    isLoading.value = false;
  }
};

const fetchAllData = () => {
  if (filters.hasOwnProperty("product_id")) {
    fetchData("api/pluckProducts", pluckProductsList);
  }
  if (filters.hasOwnProperty("user_id")) {
    fetchData("api/pluckSeller", pluckSellerList);
  }
  if (filters.hasOwnProperty("category_id")) {
    fetchData("api/pluckCategory", pluckCategoryList);
  }
  if (filters.hasOwnProperty("plan_id")) {
    fetchData("api/pluckPlans", pluckPlansyList);
  }
};

onMounted(() => {
  fetchAllData();
});
</script>

<template>
  <div class="reprotFiltersDiv">
    <div class="dateFilter card">
      <div class="text-center" v-if="isLoading">
        <i class="pi pi-spin pi-spinner text-5xl"></i>
      </div>
      <div v-else class="feild grid gap-1 mt-2">
        <div class="field lg:col-3 col-12">
          <label>From Date</label><br />
          <Calendar v-model="filters.from_date" dateFormat="yy-mm-dd" showIcon />
        </div>
        <div class="field lg:col-3 col-12">
          <label>To Date</label><br />
          <Calendar v-model="filters.to_date" dateFormat="yy-mm-dd" showIcon />
        </div>
        <div v-if="filters.hasOwnProperty('product_id')" class="field lg:col-5 col-12">
          <label>Product</label>
          <Dropdown
            v-model="filters.product_id"
            style="width: 100%"
            :laoding="true"
            :options="pluckProductsList"
            optionLabel="name"
            optionValue="id"
            placeholder="Select Product"
          />
        </div>
        <div v-if="filters.hasOwnProperty('category_id')" class="field lg:col-3 col-12">
          <label>Categgory</label><br />
          <Dropdown
            v-model="filters.category_id"
            style="width: 100%"
            :options="pluckCategoryList"
            optionLabel="name"
            optionValue="id"
            placeholder="Select Category"
          />
        </div>
        <div v-if="filters.hasOwnProperty('user_id')" class="field lg:col-3 col-12">
          <label>Seller</label><br />
          <Dropdown
            v-model="filters.user_id"
            style="width: 100%"
            :options="pluckSellerList"
            optionLabel="name"
            optionValue="id"
            placeholder="Select Seller"
          />
          <!-- :placeholder="`Select ${userLabelText}`" -->
        </div>
        <div v-if="filters.hasOwnProperty('plan_id')" class="feild lg:col-3 col-12">
          <label>Subscription Plan</label><br />
          <Dropdown
            v-model="filters.plan_id"
            style="width: 100%"
            :options="pluckPlansyList"
            class="mt-2"
            optionLabel="title"
            optionValue="id"
            placeholder="Select Plan"
          />
        </div>
        <div class="feild lg:col-2 col-12 mt-3">
          <Button
            label="Filter"
            icon="pi pi-filter"
            class="mr-2 mt-2"
            @click="emit('filter')"
            severity="success"
          />
        </div>
      </div>
    </div>
  </div>
</template>
