<script setup>
import Calendar from "primevue/calendar";
import { useToast } from "primevue/usetoast";

const toast = useToast();
const showToast = (message) => {
  toast.add({ severity: "info", detail: message, life: 3000 });
};

const isLoading = ref(false);
const pluckProductsList = ref([]);
const pluckSelectedProduct = ref(null);
const pluckSellerList = ref([]);
const pluckSellerSelected = ref(null);
const pluckCategoryList = ref([]);
const pluckCategorySelected = ref(null);
const pluckPlansyList = ref([]);
const pluckPlansSelected = ref(null);

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
  fetchData("api/pluckProducts", pluckProductsList);
  fetchData("api/pluckSeller", pluckSellerList);
  fetchData("api/pluckCategory", pluckCategoryList);
  fetchData("api/pluckPlans", pluckPlansyList);
};

onMounted(fetchAllData);
</script>

<template>
  <div class="reprotFiltersDiv">
    <div class="dateFilter card">
      <span v-if="isLoading">
        <i class="pi pi-spin pi-spinner text-5xl"></i>
      </span>
      <div class="flex flex-wrap gap-4 lg:mb-4 mb-2">
        <div class="col-3">
          <span>From Date</span>
          <Calendar v-model="date" dateFormat="dd/mm/yy" showIcon />
        </div>
        <div class="col-3">
          <span>To Date</span>
          <Calendar v-model="date" dateFormat="dd/mm/yy" showIcon />
        </div>
      </div>

      <div class="flex flex-wrap gap-4">
        <div class="col-2" style="overflow: hidden">
          <Dropdown
            v-model="pluckSelectedProduct"
            :options="pluckProductsList"
            optionLabel="name"
            optionValue="id"
            placeholder="Select Product"
          />
        </div>
        <div class="col-2">
          <Dropdown
            v-model="pluckSellerSelected"
            :options="pluckSellerList"
            optionLabel="name"
            optionValue="id"
            placeholder="Select Sellers"
          />
        </div>
        <div class="col-2">
          <Dropdown
            v-model="pluckCategorySelected"
            :options="pluckCategoryList"
            optionLabel="name"
            optionValue="id"
            placeholder="Select Category"
          />
        </div>
        <div class="col-2">
          <Dropdown
            v-model="pluckPlansSelected"
            :options="pluckPlansyList"
            optionLabel="title"
            optionValue="id"
            placeholder="Select Plan"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.reprotFiltersDiv {
}
</style>
