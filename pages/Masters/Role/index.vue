<template>
  <div class="grid">
    <div class="col-12">
      <reportFielder :filters="filters" @filter="getTableData" userLabelText="user" />
    </div>
    <div class="col-12">
      <div class="card">
        <Toolbar class="mb-4">
          <template v-slot:start>
            <div class="my-2">
              <Button
                label="New"
                icon="pi pi-plus"
                class="mr-2"
                severity="success"
                @click="openNew"
              />
              <Button
                label="Delete"
                icon="pi pi-trash"
                severity="danger"
                @click="confirmDeleteSelected"
                :disabled="!selectedProducts || !selectedProducts.length"
              />
            </div>
          </template>

          <template v-slot:end>
            <FileUpload
              mode="basic"
              accept="image/*"
              :maxFileSize="1000000"
              label="Import"
              chooseLabel="Import"
              class="mr-2 inline-block"
            />
            <Button
              label="Export"
              icon="pi pi-upload"
              severity="help"
              @click="exportCSV($event)"
            />
          </template>
        </Toolbar>
        <DataTable
          v-if="data"
          ref="table"
          :value="data.data.data"
          v-model:selection="selectedProducts"
          dataKey="id"
          :paginator="true"
          :rows="10"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          :rowsPerPageOptions="[5, 10, 25]"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} roles"
        >
          <template #header>
            <div
              class="flex flex-column md:flex-row md:justify-content-between md:align-items-center"
            >
              <h5 class="m-0">Manage Roles</h5>
              <filterBySearch
                :initialSearch="searchQuery"
                :debounceTime="300"
                :onSearch="updateSearch"
              />
            </div>
          </template>
          <Column field="ID" header="ID" headerStyle="width:auto; min-width:10rem;">
            <template #body="slotProps">
              <span class="p-column-title">ID</span>
              {{ slotProps.data.id }}
            </template>
          </Column>
          <Column field="Name" header="Name" headerStyle="width:auto; min-width:10rem;">
            <template #body="slotProps">
              <span class="p-column-title">ID</span>
              {{ slotProps.data.name }}
            </template>
          </Column>
          <Column field="Action" header="Action" headerStyle="min-width:10rem;">
            <template #body="slotProps">
              <Button
                icon="pi pi-pencil"
                class="mr-2"
                severity="success"
                rounded
                @click="editRoleOpen(slotProps.data)"
              />
              <Button
                icon="pi pi-trash"
                class="mt-2"
                severity="warning"
                rounded
                @click="confirmDeleteRole(slotProps.data)"
              />
            </template>
          </Column>
        </DataTable>

        <Dialog
          v-model:visible="productDialog"
          :style="{ width: '450px' }"
          header="Create Role"
          :modal="true"
          class="p-fluid"
        >
          <div class="field">
            <label for="name">Name</label>
            <InputText
              id="name"
              v-model.trim="makeRole.name"
              required="true"
              autofocus
              :invalid="submitted && !makeRole.name"
            />
            <small class="p-invalid" v-if="submitted && !makeRole.name"
              >Name is required.</small
            >
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
              @click="saveProduct"
            />
          </template>
        </Dialog>

        <Dialog
          v-model:visible="producEdittDialog"
          :style="{ width: '450px' }"
          header="Create Role"
          :modal="true"
          class="p-fluid"
        >
          <div class="field">
            <label for="name">Name</label>
            <InputText
              id="name"
              v-model.trim="editRole.name"
              required="true"
              autofocus
              :invalid="submittededit && !editRole.name"
            />
            <small class="p-invalid" v-if="submittededit && !editRole.name"
              >Name is required.</small
            >
          </div>
          <template #footer>
            <Button
              label="Cancel"
              icon="pi pi-times"
              class="mr-2"
              severity="danger"
              @click="hideDialogEdit"
            />
            <Button
              label="Save"
              icon="pi pi-check"
              class="mr-2"
              severity="success"
              @click="updatedRole"
            />
          </template>
        </Dialog>

        <Dialog
          v-model:visible="deleteProductDialog"
          :style="{ width: '450px' }"
          header="Confirm"
          :modal="true"
        >
          <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
            <span v-if="product"
              >Are you sure you want to delete <b>{{ deleteRole.name }}</b
              >?</span
            >
          </div>
          <template #footer>
            <Button
              label="No"
              icon="pi pi-times"
              text
              @click="deleteProductDialog = false"
            />
            <Button label="Yes" icon="pi pi-check" text @click="deleteRoleSingle" />
          </template>
        </Dialog>

        <Dialog
          v-model:visible="deleteProductsDialog"
          :style="{ width: '450px' }"
          header="Confirm"
          :modal="true"
        >
          <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
            <span v-if="product"
              >Are you sure you want to delete the selected products?</span
            >
          </div>
          <template #footer>
            <Button
              label="No"
              icon="pi pi-times"
              text
              @click="deleteProductsDialog = false"
            />
            <Button label="Yes" icon="pi pi-check" text @click="deleteSelectedProducts" />
          </template>
        </Dialog>
      </div>
    </div>
  </div>
</template>

<script setup>
import { FilterMatchMode } from "primevue/api";
import { ref, onMounted, onBeforeMount } from "vue";
import { useToast } from "primevue/usetoast";
import makeCustomRequest from "../../../composables/makeCustomRequest";
const toast = useToast();

const products = ref(null);
const productDialog = ref(false);
const deleteProductDialog = ref(false);
const deleteProductsDialog = ref(false);
const product = ref({});
const selectedProducts = ref(null);
const producEdittDialog = ref(false);
const submitted = ref(false);
const submittededit = ref(false);

const totalPages = ref(0);
const page = ref(1);
const filters = ref(getFilter([]));
const searchQuery = ref("");

const updateSearch = (newSearchQuery) => {
  searchQuery.value = newSearchQuery;
};

onMounted(() => {
  getTableData();
});
const openNew = () => {
  product.value = {};
  submitted.value = false;
  productDialog.value = true;
};

const hideDialog = () => {
  productDialog.value = false;
  submitted.value = false;
};
const hideDialogEdit = () => {
  producEdittDialog.value = false;
  submittededit.value = false;
};

const confirmDeleteSelected = () => {
  deleteProductsDialog.value = true;
};

const makeRole = reactive({
  name: "",
});
const editRole = reactive({
  id: "",
  name: "",
});
const deleteRole = reactive({
  id: "",
  name: "",
});

const saveProduct = async () => {
  submitted.value = true;
  if (makeRole.name != "") {
    const url = "api/Masters/Role";
    const token = localStorage.getItem("OAuth-token");
    const res = await makeCustomRequest({
      url: url,
      method: "POST",
      body: { name: makeRole.name },
    });
    if (res.res) {
      productDialog.value = false;
      getTableData();
      toast.add({ severity: "success", summary: "Role added successfully", life: 3000 });
    } else {
      toast.add({ severity: "error", summary: "Something went wrong", life: 3000 });
    }
  }
};

const table = ref();
const data = ref(null);

const pagination = computed(() => {
  if (data.value) {
    const last_page = toFixed(data.value.total / 50);
    return { current: data.value.current_page, total: data.total, last: last_page };
  }
});
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
  data.value = await makeCustomRequest({
    url: "api/Masters/Role",
    method: "GET",
    query: {
      from_date: filters.value.from_date,
      to_date: filters.value.to_date,
      search: searchQuery.value,
    },
  });
};

const editRoleOpen = (role) => {
  editRole.name = role.name;
  editRole.id = role.id;
  producEdittDialog.value = true;
};
const updatedRole = async () => {
  submittededit.value = true;
  if (editRole.name != "") {
    const url = `api/Masters/Role/${editRole.id}`;
    const token = localStorage.getItem("OAuth-token");
    const res = await makeCustomRequest({
      url: url,
      method: "PATCH",
      body: { name: editRole.name },
    });
    if (res.res) {
      producEdittDialog.value = false;
      getTableData();
      toast.add({
        severity: "success",
        summary: "Role updated successfully",
        life: 3000,
      });
    } else {
      toast.add({ severity: "error", summary: "Something went wrong", life: 3000 });
    }
  }
};

const confirmDeleteRole = (deleteprod) => {
  deleteRole.name = deleteprod.name;
  deleteRole.id = deleteprod.id;
  deleteProductDialog.value = true;
};
const deleteRoleSingle = async () => {
  const url = `api/Masters/Role/${deleteRole.id}`;
  const token = localStorage.getItem("OAuth-token");
  const res = await makeCustomRequest({
    url: url,
    method: "DELETE",
    body: { id: deleteRole.id },
  });
  if (res.res) {
    deleteProductDialog.value = false;
    getTableData();
    toast.add({ severity: "success", summary: "Role deleted successfully", life: 3000 });
  } else {
    toast.add({ severity: "error", summary: "Something went wrong", life: 3000 });
  }
};
watch((searchQuery, filters) => {
  getTableData();
});
</script>
