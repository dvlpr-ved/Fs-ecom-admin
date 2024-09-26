<template>
  <div class="grid">
    <div class="col-12">
      <div class="card">
        <div v-if="TableData" class="CutomResponsiveTable table-container">
          <DataTable v-if="TableData" ref="table" :value="TableData" dataKey="id">
            <template #header>
              <div
                class="flex flex-column md:flex-row md:justify-content-between md:align-items-center"
              >
                <h5 class="m-0">Manage Chats</h5>
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

const closeBoat = () => {
  chatBoatVisible.value = false;
};

const handleReply = (user_id, user_name) => {
  sendCleintData.userId = user_id;
  sendCleintData.userName = user_name;
  chatBoatVisible.value = !chatBoatVisible.value;
};

// https://fashtsaly.com/API/public/api/getchat?user_id=16

const getTableData = async () => {
  loading.value = true;
  try {
    const response = await makeCustomRequest({
      url: "api/getAllchatAdmin",
      method: "GET",
    });

    if (response) {
      // const jsonResponse = await response.json();
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
</script>

<style lang="scss">
@media (max-width: 768px) {
}
</style>
