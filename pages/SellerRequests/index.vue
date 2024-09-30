<template>
    <div class="grid">
      <div class="col-12">
        <div class="card">
          <div class="field">
            </div>            
          <div v-if="!loading && TableData" class="CutomResponsiveTable table-container">
            <DataTable v-if="TableData" ref="table" :value="TableData" dataKey="id">
              <template #header>
                <div
                  class="flex flex-column md:flex-row md:justify-content-between md:align-items-center"
                >
                  <h5 class="m-0">Seller Requests</h5>
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
                  {{ slotProps.data.name }}
                </template>
              </Column>
              <Column field="id" header="Email" headerStyle="width:auto; min-width:10rem;">
                <template #body="slotProps">
                  <span class="p-column-title">Email</span>
                  {{ slotProps.data.email }}
                </template>
              </Column>
              <Column field="id" header="Phone" headerStyle="width:auto; min-width:10rem;">
                <template #body="slotProps">
                  <span class="p-column-title">Phone</span>
                  {{ slotProps.data.phone }}
                </template>
              </Column>
              <Column field="id" header="Social Media" headerStyle="width:auto; min-width:10rem;">
                <template #body="slotProps">
                  <span class="p-column-title">Scial Media</span>
                  {{ slotProps.data.social_media }}
                </template>
              </Column>
              <Column field="id" header="GST NO" headerStyle="width:auto; min-width:10rem;">
                <template #body="slotProps">
                  <span class="p-column-title">GST NO</span>
                  {{ slotProps.data.gst_no }}
                </template>
              </Column>
              <Column field="id" header="Pincode" headerStyle="width:auto; min-width:10rem;">
                <template #body="slotProps">
                  <span class="p-column-title">Pincode</span>
                  {{ slotProps.data.pincode }}
                </template>
              </Column>
              <Column field="id" header="Locality" headerStyle="width:auto; min-width:10rem;">
                <template #body="slotProps">
                  <span class="p-column-title">Locality</span>
                  {{ slotProps.data.locality }}
                </template>
              </Column>
              <Column field="id" header="City" headerStyle="width:auto; min-width:10rem;">
                <template #body="slotProps">
                  <span class="p-column-title">City</span>
                  {{ slotProps.data.city }}
                </template>
              </Column>
              <Column field="id" header="State" headerStyle="width:auto; min-width:10rem;">
                <template #body="slotProps">
                  <span class="p-column-title">State</span>
                  {{ slotProps.data.state }}
                </template>
              </Column>
              <Column field="id" header="Landmark" headerStyle="width:auto; min-width:10rem;">
                <template #body="slotProps">
                  <span class="p-column-title">Landmark</span>
                  {{ slotProps.data.landmark }}
                </template>
              </Column>
              <Column field="id" header="Rquested at" headerStyle="width:auto; min-width:10rem;">
                <template #body="slotProps">
                  <span class="p-column-title">Requested at</span>
                  {{ slotProps.data.created_at }}
                </template>
              </Column>
              <Column field="id" header="Approve" headerStyle="width:auto; min-width:10rem;">
                <template #body="slotProps">
                    <Button icon="pi pi-check" class="mr-2" severity="success" rounded @click="approveSeller(slotProps.data.id)" />
                </template>
              </Column>
  
            </DataTable>
          </div>
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
  const date = ref('');
  const getTableData = async () => {
    loading.value = true;
    try {
      const response = await makeCustomRequest({
        url :`api/getSellerRequests`,
        method : "GET"
      });
      if (response.success) {
        TableData.value = response.data;
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
  const approveSeller = async(id) => {
    try {
      const response = await makeCustomRequest({
        url :`api/convertSellerRequests`,
        method : "POST",
        body : {
            seller_id : id
        }
      });
      if (response.success) {
        toast.add({ severity: 'success', summary: 'Request Approved Successfully', life: 3000 });
    } else {
        toast.add({ severity: "error", summary: "Server Error", life: 3000 });
      }
    } catch (error) {
      toast.add({ severity: "error", summary: "Something went wrong", life: 3000 });
    } finally {
      loading.value = false;
    }
    getTableData();    
  }
</script>
  
  <style lang="scss">
  @media (max-width: 768px) {
  }
  </style>
  