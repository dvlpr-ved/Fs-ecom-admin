<template>
  <div class="grid">
    <div class="col-12">
      <reportFielder :filters="filters" @filter="getTableData" userLabelText="user" />
    </div>
    <div class="col-12">
      <div class="card">
        <div v-if="TableData" class="CutomResponsiveTable table-container">
          <DataTable v-if="TableData" ref="table" :value="TableData" dataKey="id">
            <template #header>
              <div
                class="flex flex-column md:flex-row md:justify-content-between md:align-items-center"
              >
                <h5 class="m-0">Manage Chats</h5>
                <filterBySearch
                  :initialSearch="searchQuery"
                  :debounceTime="300"
                  :onSearch="updateSearch"
                />
              </div>
            </template>
            <Column field="id" header="No" headerStyle="width:auto; min-width:2rem;">
              <template #body="slotProps">
                <span class="p-column-title">No</span>
                {{ slotProps.data.id }}
              </template>
            </Column>

            <Column
              field="title"
              header="userId"
              headerStyle="width:auto; min-width:10rem;"
            >
              <template #body="slotProps">
                <span class="p-column-title">userId</span>
                {{ slotProps.data.user_id }}
              </template>
            </Column>
            <Column
              field="title"
              header="User Name"
              headerStyle="width:auto; min-width:5rem;"
            >
              <template #body="slotProps">
                <span class="p-column-title">User Name</span>
                {{ slotProps.data.user_name }}
              </template>
            </Column>
            <Column header="Action" headerStyle="min-width:10rem;">
              <template #body="slotProps">
                <div class="flex items-center">
                  <span
                    class="cursor-pointer"
                    style="color: #10b981"
                    @click="handleReply(slotProps.data.user_id, slotProps.data.user_name)"
                    >Reply</span
                  >
                  <!-- @click="editEntrOpen(slotProps.data)" -->
                </div>
              </template>
            </Column>
            <template #footer>
              <TableFooter :totalPages="totalPages" v-model="page"></TableFooter>
            </template>
          </DataTable>
        </div>
        <div
          v-else
          class="flex items-center justify-center text-primary"
          style="justify-content: center"
        >
          <span><i class="pi pi-spin pi-spinner text-8xl"></i></span>
        </div>
      </div>
    </div>
  </div>
  <chatboat
    :chatBoatVisible="chatBoatVisible"
    @closeBoat="closeBoat"
    :userData="sendCleintData"
  />
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useToast } from "primevue/usetoast";
const toast = useToast();
const TableData = ref(null);
const loading = ref(false);
const chatBoatVisible = ref(false);
const sendCleintData = reactive({
  userId: "",
  userName: "",
});

const totalPages = ref(0);
const page = ref(1);
const filters = ref(getFilter(["user"]));
const searchQuery = ref("");

const updateSearch = (newSearchQuery) => {
  searchQuery.value = newSearchQuery;
};

const closeBoat = () => {
  chatBoatVisible.value = false;
};

const handleReply = (user_id, user_name) => {
  sendCleintData.userId = user_id;
  sendCleintData.userName = user_name;
  chatBoatVisible.value = !chatBoatVisible.value;
};

const pagination = computed(() => {
  if (data.value) {
    const last_page = toFixed(data.value.total / 20);
    return { current: data.value.current_page, total: data.total, last: last_page };
  }
});

const getTableData = async () => {
  loading.value = true;
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
  try {
    const response = await makeCustomRequest({
      url: `api/getAllchatAdmin?page=${page.value}`,
      method: "GET",
      query: {
        from_date: filters.value.from_date,
        to_date: filters.value.to_date,
        user_id: filters.value.user_id,
        search: searchQuery.value,
      },
    });
    if (response) {
      TableData.value = response.data.data;
      loading.value = false;
    } else {
      toast.add({ severity: "error", summary: "Server Error", life: 3000 });
    }
  } catch (error) {
    toast.add({ severity: "error", summary: "Something went wrong", life: 3000 });
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  getTableData();
});
watch((searchQuery, filters) => {
  getTableData();
});
</script>

<style lang="scss">
@media (max-width: 768px) {
}
</style>
