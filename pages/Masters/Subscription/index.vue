<template>
  <div class="grid">
    <div class="col-12">
      <div class="card">
        <div
          v-if="!loading && TableData.length"
          class="CutomResponsiveTable table-container"
        >
          <DataTable v-if="TableData" ref="table" :value="TableData" dataKey="id">
            <template #header>
              <div
                class="flex flex-column md:flex-row md:justify-content-between md:align-items-center"
              >
                <h5 class="m-0">Manage Plans</h5>
              </div>
            </template>
            <Column field="id" header="No" headerStyle="width:auto; min-width:10rem;">
              <template #body="slotProps">
                <span class="p-column-title">No</span>
                {{ slotProps.data.id }}
              </template>
            </Column>

            <Column
              field="title"
              header="Name"
              headerStyle="width:auto; min-width:10rem;"
            >
              <template #body="slotProps">
                <span class="p-column-title">Name</span>
                {{ slotProps.data.title }}
              </template>
            </Column>

            <Column
              field="price"
              header="Price"
              headerStyle="width:auto; min-width:10rem;"
            >
              <template #body="slotProps">
                <span class="p-column-title">Price</span>
                ₹ {{ slotProps.data.price }}
              </template>
            </Column>
            <Column
              field="price"
              header="Active Users"
              headerStyle="width:auto; min-width:10rem;"
            >
              <template #body="slotProps">
                <span class="p-column-title">Active users</span>
                 {{ slotProps.data.active_users }}
              </template>
            </Column>
            <Column header="Action" headerStyle="min-width:10rem;">
              <template #body="slotProps">
                <div class="flex items-center">
                  <Button
                    icon="pi pi-pencil"
                    class="mr-2"
                    severity="success"
                    rounded
                    @click="editEntryOpen(slotProps.data)"
                  />
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
        <Dialog
          v-model:visible="editDialog"
          :style="{ width: '450px' }"
          header="Update Plan"
          :modal="true"
          class="p-fluid"
        >
          <div class="field">
            <label for="price">Price<span class="text-red-400"> *</span></label>
            <InputText
              v-model.trim="makeEntry.price"
              required
              autofocus
              :invalid="submitted && !makeEntry.price"
            />
          </div>
          <div class="field">
            <label for="title">Plan Title<span class="text-red-400"> *</span></label>
            <InputText
              v-model.trim="makeEntry.title"
              required
              autofocus
              :invalid="submitted && !makeEntry.title"
            />
          </div>
          <template #footer>
            <Button
              label="Cancel"
              icon="pi pi-times"
              class="mr-2"
              severity="danger"
              @click="hideDialog"
            />
            <Button
              label="Save"
              icon="pi pi-check"
              class="mr-2"
              severity="success"
              @click="updatePlan"
            />
          </template>
        </Dialog>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useToast } from "primevue/usetoast";
const toast = useToast();
const TableData = ref([]);
const loading = ref(false);
const editDialog = ref(false);
const submitted = ref(false);

const makeEntry = reactive({
  plan_id: "",
  price: "",
  title: "",
});

const getTableData = async () => {
  loading.value = true;
  try {
    const response = await fetch(
      "https://fashtsaly.com/API/public/api/getSubscriptionPlans",
      {
        method: "GET",
      }
    );
    if (response.ok) {
      const jsonResponse = await response.json();
      TableData.value = jsonResponse.data;
    } else {
      toast.add({ severity: "error", summary: "Server Error", life: 3000 });
    }
  } catch (error) {
    toast.add({ severity: "error", summary: "Something went wrong", life: 3000 });
  } finally {
    loading.value = false;
  }
};

const editEntryOpen = (plan) => {
  makeEntry.plan_id = plan.id;
  makeEntry.price = plan.price;
  makeEntry.title = plan.title;
  editDialog.value = true;
};

const hideDialog = () => {
  editDialog.value = false;
};

const updatePlan = async () => {
  submitted.value = true;
  if (makeEntry.title && makeEntry.price) {
    const url = "api/updateSubscriptionPlans";
    try {
      const response = await makeCustomRequest({
        url: url,
        method: "POST",
        body: {
          subscription_id: makeEntry.plan_id,
          title: makeEntry.title,
          price: makeEntry.price,
        },
      });
      if (response) {
        toast.add({
          severity: "success",
          summary: "Plan Updated successfully",
          life: 3000,
        });
        hideDialog();
        await getTableData();
      } else {
        toast.add({ severity: "error", summary: "Update failed", life: 3000 });
      }
    } catch (error) {
      toast.add({ severity: "error", summary: "Something went wrong", life: 3000 });
    } finally {
      submitted.value = false;
    }
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
