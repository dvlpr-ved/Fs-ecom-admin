<script setup>
const authstore = useAuthStore();

const orders = ref([]);
const loading = ref(false);
const fromDate = ref(null);
const toDate = ref(null);

const totalNewCustomers = ref(0);
const totalRecentOrders = ref(0);
const totalRecentSellers = ref(0);
const totalRecentSubscriptions = ref(0);
const totalTopShare = ref(0);

const formatDate = (date) => {
  if (!date) return null;
  return date.toISOString().split("T")[0];
};

const getCurrentDate = () => new Date();
const getSevenDaysBeforeDate = () => {
  const date = new Date();
  date.setDate(date.getDate() - 15);
  return date;
};
const calculateTotals = (data) => {
  totalNewCustomers.value = data.new_customers ? data.new_customers.length : 0;
  totalRecentOrders.value = data.recent_orders ? data.recent_orders.length : 0;
  totalRecentSellers.value = data.recent_sellers ? data.recent_sellers.length : 0;
  totalRecentSubscriptions.value = data.recent_subscriptions
    ? data.recent_subscriptions.length
    : 0;
  totalTopShare.value = data.top_share ? data.top_share.length : 0;
};

const getDashboardData = async () => {
  loading.value = true;
  try {
    const params = new URLSearchParams();
    if (fromDate.value) params.append("from_date", formatDate(fromDate.value));
    if (toDate.value) params.append("to_date", formatDate(toDate.value));

    const response = await makeCustomRequest({
      url: `api/getDashboardData?${params}`,
      method: "GET",
    });

    orders.value = response;

    calculateTotals(response);
  } catch (error) {
    console.error("Error fetching orders:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fromDate.value = getSevenDaysBeforeDate();
  toDate.value = getCurrentDate();
  getDashboardData();
});
</script>

<template>
  <div class="grid">
    <div class="col-12 lg:col-6 xl:col-3">
      <div class="card mb-0">
        <div class="flex justify-content-between mb-3">
          <div>
            <span class="block text-500 font-medium mb-3">Total Orders </span>
            <div class="text-900 font-medium text-xl">
              {{ totalRecentOrders }}
            </div>
          </div>
          <div
            class="flex align-items-center justify-content-center bg-blue-100 border-round"
            style="width: 2.5rem; height: 2.5rem"
          >
            <i class="pi pi-shopping-cart text-blue-500 text-xl"></i>
          </div>
        </div>
        <!-- <span class="text-green-500 font-medium"> New </span> -->
        <!-- <span class="text-500">since last visit</span> -->
      </div>
    </div>
    <div class="col-12 lg:col-6 xl:col-3" v-if="authstore.userData.name === 'Admin'">
      <div class="card mb-0">
        <div class="flex justify-content-between mb-3">
          <div>
            <span class="block text-500 font-medium mb-3">Subscriptions</span>
            <div class="text-900 font-medium text-xl">{{ totalRecentSubscriptions }}</div>
          </div>
          <div
            class="flex align-items-center justify-content-center bg-blue-100 border-round"
            style="width: 2.5rem; height: 2.5rem"
          >
            <i class="pi pi-credit-card text-blue-500 text-xl"></i>
          </div>
        </div>
        <!-- <span class="text-green-500 font-medium"> new Subscriber </span> -->
        <!-- <span class="text-500">since last week</span> -->
      </div>
    </div>
    <div class="col-12 lg:col-6 xl:col-3" v-if="authstore.userData.name === 'Admin'">
      <div class="card mb-0">
        <div class="flex justify-content-between mb-3">
          <div>
            <span class="block text-500 font-medium mb-3">New Customers</span>
            <div class="text-900 font-medium text-xl">{{ totalNewCustomers }}</div>
          </div>
          <div
            class="flex align-items-center justify-content-center bg-cyan-100 border-round"
            style="width: 2.5rem; height: 2.5rem"
          >
            <i class="pi pi-inbox text-cyan-500 text-xl"></i>
          </div>
        </div>
        <!-- <span class="text-green-500 font-medium">newly registered </span> -->
        <!-- <span class="text-500">newly registered</span> -->
      </div>
    </div>
    <div class="col-12 lg:col-6 xl:col-3">
      <div class="card mb-0">
        <div class="flex justify-content-between mb-3">
          <div>
            <span class="block text-500 font-medium mb-3">Total Vendors</span>
            <div class="text-900 font-medium text-xl">{{ orders.total_vendors }}</div>
          </div>
          <div
            class="flex align-items-center justify-content-center bg-cyan-100 border-round"
            style="width: 2.5rem; height: 2.5rem"
          >
            <i class="pi pi-inbox text-cyan-500 text-xl"></i>
          </div>
        </div>
        <!-- <span class="text-green-500 font-medium">newly registered </span> -->
        <!-- <span class="text-500">newly registered</span> -->
      </div>
    </div>
    <div class="col-12 lg:col-6 xl:col-3">
      <div class="card mb-0">
        <div class="flex justify-content-between mb-3">
          <div>
            <span class="block text-500 font-medium mb-3">Total Products</span>
            <div class="text-900 font-medium text-xl">{{ orders.total_products }}</div>
          </div>
          <div
            class="flex align-items-center justify-content-center bg-cyan-100 border-round"
            style="width: 2.5rem; height: 2.5rem"
          >
            <i class="pi pi-inbox text-cyan-500 text-xl"></i>
          </div>
        </div>
        <!-- <span class="text-green-500 font-medium">newly registered </span> -->
        <!-- <span class="text-500">newly registered</span> -->
      </div>
    </div>
    <div class="col-12 lg:col-6 xl:col-3">
      <div class="card mb-0">
        <div class="flex justify-content-between mb-3">
          <div>
            <span class="block text-500 font-medium mb-3">Top Share</span>
            <div class="text-900 font-medium text-xl">{{ totalTopShare }}</div>
          </div>
          <div
            class="flex align-items-center justify-content-center bg-cyan-100 border-round"
            style="width: 2.5rem; height: 2.5rem"
          >
            <i class="pi pi-inbox text-cyan-500 text-xl"></i>
          </div>
        </div>
        <!-- <span class="text-green-500 font-medium">newly registered </span> -->
        <!-- <span class="text-500">newly registered</span> -->
      </div>
    </div>
    <div class="col-12 card p-3">
      <div class="dashboard">
        <div
          class="filters mb-4 flex border border-gray-300 rounded-xl"
          style="justify-content: space-between; align-items: center"
        >
          <h3 class="text-lg mb-2">Recent Orders Data</h3>
          <div>
            <h3 class="text-lg mb-2">Select Date</h3>
            <div class="flex gap-3">
              <Calendar
                v-model="fromDate"
                placeholder="From Date"
                dateFormat="yy-mm-dd"
              />
              <Calendar v-model="toDate" placeholder="To Date" dateFormat="yy-mm-dd" />
              <Button label="Apply Filter" @click="getDashboardData" />
            </div>
          </div>
        </div>
        <DataTable
          :value="orders.recent_orders"
          v-if="!loading"
          responsiveLayout="scroll"
        >
          <Column header="S.No">
            <template #body="slotProps">
              {{ slotProps.index + 1 }}
            </template>
          </Column>

          <Column field="name" header="Name">
            <template #body="slotProps">
              {{ slotProps.data.name }}
            </template>
          </Column>

          <!-- <Column field="phone" header="Phone">
            <template #body="slotProps">
              {{ slotProps.data.phone }}
            </template>
          </Column> -->

          <Column field="city" header="City">
            <template #body="slotProps">
              {{ slotProps.data.city }}
            </template>
          </Column>

          <!-- <Column field="address" header="Address">
            <template #body="slotProps">
              {{ slotProps.data.address }}
            </template>
          </Column> -->

          <Column field="created_at" header="Order Date">
            <template #body="slotProps">
              {{
                slotProps.data.created_at
                  ? new Date(slotProps.data.created_at).toLocaleDateString()
                  : "N/A"
              }}
            </template>
          </Column>

          <!-- <Column header="Invoice">
            <template #body="slotProps">
              <a :href="slotProps.data.pdf" target="_blank">Download</a>
            </template>
          </Column> -->

          <Column field="subtotal" header="Subtotal">
            <template #body="slotProps">
              {{ slotProps.data.subtotal }}
            </template>
          </Column>
        </DataTable>

        <div v-if="loading" class="flex justify-center py-10">
          <i class="pi pi-spin pi-spinner text-4xl"></i>
        </div>
      </div>
    </div>
  </div>
</template>
