<script setup>
import Calendar from "primevue/calendar";
import { useToast } from "primevue/usetoast";

const toast = useToast();
const show = (message) => {
  toast.add({ severity: "info", detail: message, life: 3000 });
};

const pluckProductsList = ref([]);
const pluckSelectedProduct = ref(null);
const pluckSellerList = ref([]);
const pluckSellerSelected = ref(null);

const getPluckProducts = async () => {
  try {
    const response = await makeCustomRequest({
      url: `api/pluckProducts`,
      method: "GET",
    });
    if (response && response.data) {
      pluckProductsList.value = response.data;
    } else {
      show("No Pluck Product data received");
    }
  } catch (error) {
    show(`Error fetching Pluck products: ${error.message || error}`);
  }
};

const getpluckSeller = async () => {
  try {
    const response = await makeCustomRequest({
      url: `api/pluckSeller`,
      method: "GET",
    });
    if (response && response.data) {
      pluckSellerList.value = response.data;
    } else {
      show("No Pluck Product data received");
    }
  } catch (error) {
    show(`Error fetching Pluck products: ${error.message || error}`);
  }
};

onMounted(() => {
  getPluckProducts();
  getpluckSeller();
});
</script>

<template>
  <div class="reprotFiltersDiv">
    <div class="dateFilter">
      <div class="card flex flex-wrap gap-4">
        <div class="flex-auto">
          <span>From Date</span>
          <Calendar v-model="date" dateFormat="dd/mm/yy" showIcon />
        </div>
        <div class="flex-auto">
          <span>To Date</span>
          <Calendar v-model="date" dateFormat="dd/mm/yy" showIcon />
        </div>
        <Dropdown
          v-model="pluckSelectedProduct"
          :options="pluckProductsList"
          optionLabel="name"
          optionValue="id"
          class="pluckProductsDropDwon"
          placeholder="Select Pluck Product"
        />
        <Dropdown
          v-model="pluckSellerSelected"
          :options="pluckSellerList"
          optionLabel="name"
          optionValue="id"
          class="pluckSellerDropDwon"
          placeholder="Select Pluck Sellers"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.reprotFiltersDiv {
}
</style>
