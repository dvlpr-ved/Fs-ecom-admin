<template>
    <div class="grid">
      <div class="col-12">
        <div class="card">
          <div class="field">
            </div>
            <Toolbar class="mb-4">
              <template v-slot:start>
                  <div class="my-2">
                    <Dropdown :filter="true" @change="getData" v-model="selectedRole" :options="role" optionLabel="name" optionValue="id" placeholder="Select Role" />
                    <DatePicker v-model="date" />
                  </div>
              </template>

              <template v-slot:end>
                  <Button label="Update Permissions" icon="pi pi-upload" severity="help" @click="updatePermissions()" />
              </template>
            </Toolbar>            
          <div v-if="!loading && TableData" class="CutomResponsiveTable table-container">
            <DataTable v-if="TableData" ref="table" :value="TableData" dataKey="id">
              <template #header>
                <div
                  class="flex flex-column md:flex-row md:justify-content-between md:align-items-center"
                >
                  <h5 class="m-0">Manage Permissions</h5>
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
                header="Page Name"
                headerStyle="width:auto; min-width:10rem;"
              >
                <template #body="slotProps">
                  <span class="p-column-title">Page Name</span>
                  {{ slotProps.data.name }}
                </template>
              </Column>
  
              <Column header="Action" headerStyle="min-width:10rem;">
                <template #body="slotProps">
                  <div class="flex items-center">
                    <Checkbox v-model="permissions" :inputId="'ingredient1' + slotProps.data.id" name="permissions" :value="slotProps.data.id" />
                  </div>
                </template>
              </Column>
            </DataTable>
          </div>
          <Dialog
            v-model:visible="editDialog"
            :style="{ width: '450px' }"
            header="Update Plan"
            :modal="true"
            class="p-fluid"
          >
            <div class="field">
              <label for="price">Page Title<span class="text-red-400"> *</span></label>
              <InputText
                v-model.trim="makeEntry.page_title"
                required
                autofocus
                :invalid="submitted && !makeEntry.page_title"
              />
            </div>
            <div class="field">
              <label for="title"
                >Meta Keywords (comma seprated keywords)<span class="text-red-400">
                  *</span
                ></label
              >
              <InputText
                v-model.trim="makeEntry.page_meta_tags"
                required
                autofocus
                :invalid="submitted && !makeEntry.page_meta_tags"
              />
            </div>
            <div class="field">
              <label for="title"
                >Meta Description <span class="text-red-400"> *</span></label
              >
              <InputText
                v-model.trim="makeEntry.page_description"
                required
                autofocus
                :invalid="submitted && !makeEntry.page_description"
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
  const TableData = ref(null);
  const loading = ref(false);
  const editDialog = ref(false);
  const submitted = ref(false);
  const date = ref('');
  const getTableData = async (role) => {
    loading.value = true;
    try {
      const response = await makeCustomRequest({
        url :`api/getModules?role_id=${selectedRole.value}`,
        method : "GET"
      });
      if (response.success) {
        TableData.value = response.data;
        permissions.value = response.permissions;
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
    getRoleData();
  });
  const role = ref([]);
  const roleSelected = ref(0);
  const getRoleData = async  () => {
      const responserole  = await makeCustomRequest({
      url : 'api/Masters/Role',
      method : 'GET',
  });
  role.value = responserole.data.data;
}
const permissions = ref();
const selectedRole = ref(null);
const getData = () => {
  getTableData(selectedRole.value);
}; 
const updatePermissions =async () => {
  const save = await makeCustomRequest({
    url : 'api/updatePermissions',
    method : 'POST',
    body : {
      role_id : selectedRole.value,
      modules : permissions.value
    }
  });
  if(save.success){
    toast.add({ severity: 'success', summary: 'Permissions updated successfully', life: 3000 });
  }
  else{
    toast.add({ severity: 'error', summary: 'Something went wrong', life: 3000 });
  }
}
</script>
  
  <style lang="scss">
  @media (max-width: 768px) {
  }
  </style>
  