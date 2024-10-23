<template>
  <div class="grid">
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
            </div>
          </template>
        </Toolbar>
        <DataTable
          v-if="data"
          ref="table"
          :value="data.data.data"
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
              <h5 class="m-0">Manage products</h5>
              <IconField iconPosition="left" class="block mt-2 md:mt-0">
                <InputIcon class="pi pi-search" />
                <InputText class="w-full sm:w-auto" placeholder="Search..." />
              </IconField>
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
          <Column
            field="Parent"
            header="Category"
            headerStyle="width:auto; min-width:10rem;"
          >
            <template #body="slotProps">
              <span class="p-column-title">Category</span>
              {{ nameParentCatg(slotProps.data.category) }}
            </template>
          </Column>
          <Column
            field="Parent"
            header="Category"
            headerStyle="width:auto; min-width:10rem;"
          >
            <template #body="slotProps">
              <span class="p-column-title">Created At</span>
              {{ slotProps.data.created_at }}
            </template>
          </Column>
          <Column
            field="Parent"
            header="Highlighted"
            headerStyle="width:auto; min-width:10rem;"
          >
            <template #body="slotProps">
              <span class="p-column-title">Highlighted</span>
              {{ slotProps.data.is_highlighted ? "Yes" : "NO" }}
            </template>
          </Column>
          <Column
            field="Discount"
            header="Discount"
            headerStyle="width:auto; min-width:10rem;"
          >
            <template #body="slotProps">
              <span class="p-column-title">Discount</span>
              {{ slotProps.data.discount ? slotProps.data.discount : "" }}
            </template>
          </Column>
          <Column field="Action" header="Action" headerStyle="min-width:10rem;">
            <template #body="slotProps">
              <Button
                icon="pi pi-pencil"
                class="mr-2"
                severity="success"
                rounded
                @click="editEntryOpen(slotProps.data)"
              />
              <Button
                icon="pi pi-trash"
                class="mt-2"
                severity="warning"
                rounded
                @click="confirmDeleteEntry(slotProps.data)"
              />
            </template>
          </Column>
        </DataTable>

        <Dialog
          v-model:visible="createDialog"
          :style="{ width: '450px' }"
          header="Create Product"
          :modal="true"
          class="p-fluid"
        >
          <div class="field">
            <label for="name">Name <span class="text-red-400">*</span></label>
            <InputText
              id="name"
              v-model.trim="makeEntry.name"
              required="true"
              autofocus
              :invalid="submitted && !makeEntry.name"
            />
            <small class="p-invalid" v-if="submitted && !makeEntry.name"
              >Name is required.</small
            >
          </div>
          <div class="field">
            <label for="name">Category <span class="text-red-400">*</span></label>
            <Dropdown
              v-model="makeEntry.category"
              :options="catgMast"
              optionLabel="name"
              optionValue="id"
              placeholder="Select"
            />
          </div>
          <div class="field">
            <label for="name">Discount</label>
            <InputText
              id="name"
              v-model.trim="makeEntry.discount"
              required="true"
              autofocus
            />
          </div>
          <div class="field">
            <label for="name"
              >Show in highlights <span class="text-red-400">*</span></label
            >
            <SelectButton
              v-model="makeEntry.is_highlighted"
              :options="HighlightValues"
              optionLabel="name"
              optionValue="value"
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
              @click="saveEntry"
            />
          </template>
        </Dialog>

        <Dialog
          v-model:visible="editDialog"
          :style="{ width: '450px' }"
          header="Create Role"
          :modal="true"
          class="p-fluid"
        >
          <div class="field">
            <label for="name">Name <span class="text-red-400">*</span></label>
            <InputText
              id="name"
              v-model.trim="editEntry.name"
              required="true"
              autofocus
              :invalid="submitted && !editEntry.name"
            />
            <small class="p-invalid" v-if="submitted && !editEntry.name"
              >Name is required.</small
            >
          </div>
          <div class="field">
            <label for="name">Category <span class="text-red-400">*</span></label>
            <Dropdown
              v-model="editEntry.category"
              :options="catgMast"
              optionLabel="name"
              optionValue="id"
              placeholder="Select"
            />
          </div>
          <div class="field">
            <label for="name">Discount</label>
            <InputText
              id="name"
              v-model.trim="editEntry.discount"
              required="true"
              autofocus
            />
          </div>
          <div class="field">
            <label for="name"
              >Show in highlights <span class="text-red-400">*</span></label
            >
            <SelectButton
              v-model="editEntry.is_highlighted"
              :options="HighlightValues"
              optionLabel="name"
              optionValue="value"
            />
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
              @click="updateEntry"
            />
          </template>
        </Dialog>

        <Dialog
          v-model:visible="deleteDialog"
          :style="{ width: '450px' }"
          header="Confirm"
          :modal="true"
        >
          <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
            <span v-if="product"
              >Are you sure you want to delete <b>{{ deleteEntry.name }}</b
              >?</span
            >
          </div>
          <template #footer>
            <Button label="No" icon="pi pi-times" text @click="deleteDialog = false" />
            <Button label="Yes" icon="pi pi-check" text @click="deleteEntrySingle" />
          </template>
        </Dialog>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useToast } from "primevue/usetoast";
import makeCustomRequest from "../../../composables/makeCustomRequest";
const toast = useToast();

const createDialog = ref(false);
const editDialog = ref(false);
const deleteDialog = ref(false);
const product = ref({});
const submitted = ref(false);
const submittededit = ref(false);
const catgMast = ref(null);
const catgMastIndexedArr = ref(null);
const HighlightValues = ref([
  { name: "Yes", value: 1 },
  { name: "No", value: 0 },
]);
// Get entries
onMounted(() => {
  getTableData();
});
const table = ref();
const data = ref(null);

const pagination = computed(() => {
  if (data.value) {
    const last_page = toFixed(data.value.total / 10);
    return { current: data.value.current_page, total: data.total, last: last_page };
  }
});
const getTableData = async () => {
  data.value = await makeCustomRequest({
    url: "api/Masters/Products",
    method: "GET",
  });
  getCatgMast();
};
// Get entries ends

// create entry
const openNew = () => {
  submitted.value = false;
  createDialog.value = true;
};

const hideDialog = () => {
  createDialog.value = false;
  submitted.value = false;
};
const hideDialogEdit = () => {
  editDialog.value = false;
  submittededit.value = false;
};

const makeEntry = reactive({
  name: "",
  discount: "",
  category: "",
  is_highlighted: 0,
});

const saveEntry = async () => {
  submitted.value = true;
  if (
    makeEntry.name != "" &&
    makeEntry.category != "" &&
    makeEntry.is_highlighted != ""
  ) {
    const url = "api/Masters/Products";
    const res = await makeCustomRequest({
      url: url,
      method: "POST",
      body: {
        name: makeEntry.name,
        category: makeEntry.category,
        is_highlighted: makeEntry.is_highlighted,
        discount: makeEntry.discount,
      },
    });
    if (res.res) {
      createDialog.value = false;
      getTableData();
      toast.add({
        severity: "success",
        summary: "Product added successfully",
        life: 3000,
      });
    } else {
      toast.add({ severity: "error", summary: "Something went wrong", life: 3000 });
    }
  }
};
// create Ends

// Edit entry
const editEntry = reactive({
  name: "",
  discount: "",
  category: "",
  is_highlighted: 0,
});

const editEntryOpen = (en) => {
  editEntry.name = en.name;
  editEntry.id = en.id;
  editEntry.discount = en.discount;
  editEntry.category = en.category;
  editEntry.is_highlighted = en.is_highlighted;
  editDialog.value = true;
};

const updateEntry = async () => {
  submittededit.value = true;
  if (editEntry.name != "" && editEntry.category != "") {
    const url = `api/Masters/Products/${editEntry.id}`;
    const res = await makeCustomRequest({
      url: url,
      method: "PATCH",
      body: {
        name: editEntry.name,
        category: editEntry.category,
        is_highlighted: editEntry.is_highlighted,
        discount: editEntry.discount,
      },
    });
    if (res.res) {
      editDialog.value = false;
      getTableData();
      toast.add({
        severity: "success",
        summary: "Product updated successfully",
        life: 3000,
      });
    } else {
      toast.add({ severity: "error", summary: "Something went wrong", life: 3000 });
    }
  }
};

// Edit entry ends

// Delete entry start
const deleteEntry = reactive({
  id: "",
  name: "",
  parent: "",
});

const confirmDeleteEntry = (deleteprod) => {
  deleteEntry.name = deleteprod.name;
  deleteEntry.id = deleteprod.id;
  deleteEntry.category = deleteprod.category;
  deleteEntry.is_highlighted = deleteprod.is_highlighted;
  deleteDialog.value = true;
};
const deleteEntrySingle = async () => {
  const url = `api/Masters/Products/${deleteEntry.id}`;
  const res = await makeCustomRequest({
    url: url,
    method: "DELETE",
    body: { id: deleteEntry.id },
  });
  if (res.res) {
    deleteDialog.value = false;
    getTableData();
    toast.add({
      severity: "success",
      summary: "Product deleted successfully",
      life: 3000,
    });
  } else {
    toast.add({ severity: "error", summary: "Something went wrong", life: 3000 });
  }
};
// Delete entry ends

const getCatgMast = async () => {
  const url = "api/Masters/CatgMast";
  const res = await makeCustomRequest({
    url: url,
    method: "GET",
  });
  if (res.res) {
    catgMast.value = res.data;
    const arr = [];
    for (let index = 0; index < catgMast.value.length; index++) {
      arr[catgMast.value[index].id] = catgMast.value[index].name;
    }
    catgMastIndexedArr.value = arr;
  }
};
const nameParentCatg = (id) => {
  console.log(id);
  if (catgMastIndexedArr.value) {
    return catgMastIndexedArr.value[id] ? catgMastIndexedArr.value[id] : "N/A";
  }
};
const openNewSku = () => {};
</script>
