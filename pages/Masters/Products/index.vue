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
              <Button
                label="Export Products"
                icon="pi pi-download"
                class="mr-2"
                severity="success"
                @click="exportData('product')"
              />
              <Button
                label="Export SKU"
                icon="pi pi-download"
                class="mr-2"
                severity="success"
                @click="exportData('sku')"
              />
              <Button
                label="Import Data"
                icon="pi pi-download"
                class="mr-2"
                severity="success"
                @click="importDataShow"
              />
              <Button
                label="Repost Random 50 products"
                icon="pi pi-cog"
                class="mr-2"
                :loading="reposting"
                severity="success"
                @click="repostRandom"
              />
              <Button
                label="Schedule Repost"
                icon="pi pi-cog"
                class="mr-2"
                :loading="scheduling"
                severity="success"
                @click="scheduleRepost"
              />
            </div>
          </template>
        </Toolbar>
        <div class="col-12">
          <reportFielder :filters="filters" @filter="getTableData" />
        </div>
        <DataTable
          v-if="data"
          :loading="loading"
          ref="table"
          :value="data.data.data"
          dataKey="id"
        >
          <!-- :paginator="true"
          :rows="10"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          :rowsPerPageOptions="[5, 10, 25]"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} roles" -->
          <template #header>
            <div
              class="flex flex-column md:flex-row md:justify-content-between md:align-items-center"
            >
              <h5 class="m-0">Manage products</h5>
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
            header="Created At"
            headerStyle="width:auto; min-width:10rem;"
          >
            <template #body="slotProps">
              <span class="p-column-title">Created At</span>
              {{ slotProps.data.created_at }}
            </template>
          </Column>
          <Column
            field="Parent"
            header="Last posted at"
            headerStyle="width:auto; min-width:10rem;"
          >
            <template #body="slotProps">
              <span class="p-column-title">Last Posted at</span>
              {{ slotProps.data.posted_date }}
            </template>
          </Column>
          <Column field="MRP" header="MRP" headerStyle="width:auto; min-width:10rem;">
            <template #body="slotProps">
              <span class="p-column-title">MRP</span>
              {{ slotProps.data.mrp ? slotProps.data.mrp : "" }}
            </template>
          </Column>
          <Column field="Action" header="Action" headerStyle="min-width:15rem;">
            <template #body="slotProps">
              <Button
                icon="pi pi-pencil"
                class="mr-2"
                severity="success"
                rounded
                @click="editEntryOpen(slotProps.data)"
              />
              <Button
                icon="pi pi-refresh"
                class="mr-2"
                severity="success"
                rounded
                @click="repostRandom(slotProps.data)"
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
          <template #footer>
            <TableFooter :totalPages="totalPages" v-model="page"></TableFooter>
          </template>
        </DataTable>
        <div
          v-else
          class="flex items-center justify-center text-primary"
          style="justify-content: center"
        >
          <span>
            <i class="pi pi-spin pi-spinner text-8xl"></i>
          </span>
        </div>

        <Dialog
          v-model:visible="createDialog"
          position="top"
          :style="{ width: '90%' }"
          header="Create Product"
          :modal="true"
          class="p-fluid"
        >
          <div class="feild grid gap-1 mt-2">
            <div class="field col-3">
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
            <div class="field col-3">
              <label for="name">Category <span class="text-red-400">*</span></label>
              <Dropdown
                v-model="makeEntry.category"
                :options="catgMast"
                optionLabel="name"
                optionValue="id"
                placeholder="Select"
              />
            </div>
            <div class="field col-3">
              <label for="name">MRP</label>
              <InputNumber
                :minFractionDigits="0"
                :maxFractionDigits="5"
                id="name"
                v-model.trim="makeEntry.mrp"
                required="true"
                autofocus
              />
            </div>
            <div class="field col-2">
              <label for="name">Images</label>
              <Button
                label="Upload"
                icon="pi pi-upload"
                class="mr-2"
                severity="success"
                @click="imageUploaderProduct = true"
              />
              <span class="text-primary"></span>
              {{ makeEntry.images.length ? makeEntry.images.length + " Selected" : "" }}
            </div>
            <div class="field col-3">
              <label for="name">Tax %</label>
              <InputNumber
                :minFractionDigits="0"
                :maxFractionDigits="5"
                id="name"
                v-model.trim="makeEntry.tax"
                required="true"
                autofocus
              />
            </div>
            <div class="field col-3">
              <label for="name">Discount (in RS)</label>
              <InputNumber
                :minFractionDigits="0"
                :maxFractionDigits="5"
                id="name"
                v-model.trim="makeEntry.discount"
                required="true"
                autofocus
              />
            </div>
            <div class="field col-3">
              <label for="name">Weight (in grams)</label>
              <InputNumber
                :minFractionDigits="0"
                :maxFractionDigits="5"
                id="name"
                v-model.trim="makeEntry.weight"
                required="true"
                autofocus
              />
            </div>
            <div class="feild col-6">
              <label for="name">Tags</label>
              <MultiSelect
                v-model="makeEntry.tags"
                :options="tagData"
                option-label="name"
                option-value="code"
                @filter="filterInput"
                placeholder="Select Tags"
                :filter="true"
              >
                <template #filtericon>
                  <i
                    @click="saveNewTag"
                    class="pi pi-plus text-black p-icon p-multiselect-filter-icon"
                  ></i>
                </template>
              </MultiSelect>
            </div>
            <div class="feild col-5">
              <label for="name">Vendor</label>
              <Dropdown
                filter
                v-model="makeEntry.vendor"
                :options="vendorData"
                option-label="name"
                option-value="code"
                placeholder="Select"
              />
            </div>
            <div class="field col-10">
              <label for="name">Description</label>
              <Textarea v-model="makeEntry.description" rows="5" cols="100" />
            </div>
          </div>
          <div class="feild grid gap-6 mt-2">
            <div class="field">
              <h5 class="p-dialog-title ml-2">Home Listings</h5>
            </div>
          </div>
          <div class="feild grid gap-6 mt-2 mb-2">
            <div v-for="list in homeListing" class="feild col-2">
              <div class="field-checkbox mb-0">
                <Checkbox
                  id="checkOption1"
                  name="option"
                  :value="list.id"
                  v-model="homeListingShow"
                />
                <label for="checkOption1">{{ list.name }}</label>
              </div>
            </div>
          </div>
          <ManageSku v-model="skudata"></ManageSku>
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
              :loading="submitted"
              :disabled="submitted"
              icon="pi pi-check"
              class="mr-2"
              severity="success"
              @click="saveEntry"
            />
          </template>
        </Dialog>

        <Dialog
          v-model:visible="editDialog"
          position="top"
          :style="{ width: '90%' }"
          header="Edit product"
          :modal="true"
          class="p-fluid"
        >
          <div class="feild grid gap-1 mt-2">
            <div class="field lg:col-3 col-12">
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
            <div class="field lg:col-3 col-5">
              <label for="name">Category <span class="text-red-400">*</span></label>
              <Dropdown
                v-model="editEntry.category"
                :options="catgMast"
                optionLabel="name"
                optionValue="id"
                placeholder="Select"
              />
            </div>
            <div class="field lg:col-3 col-5">
              <label for="name">MRP</label>
              <InputNumber
                :minFractionDigits="0"
                :maxFractionDigits="5"
                id="name"
                v-model.trim="editEntry.mrp"
                required="true"
                autofocus
              />
            </div>
            <div class="field lg:col-2 col-12">
              <label for="name">Images</label>
              <Button
                label="Upload"
                icon="pi pi-upload"
                class="mr-2"
                severity="success"
                @click="imageUploaderProductEdit = true"
              />
              <span class="text-primary"></span>
              {{ editEntry.images ? editEntry.images.length + " Selected" : "" }}
            </div>
            <div class="field lg:col-2 col-5">
              <label for="name">Tax %</label>
              <InputNumber
                :minFractionDigits="0"
                :maxFractionDigits="5"
                id="name"
                v-model.trim="editEntry.tax"
                required="true"
                autofocus
              />
            </div>
            <div class="field lg:col-2 col-5">
              <label for="name">Discount (in RS)</label>
              <InputNumber
                :minFractionDigits="0"
                :maxFractionDigits="5"
                id="name"
                v-model.trim="editEntry.discount"
                required="true"
                autofocus
              />
            </div>
            <div class="field lg:col-2 col-5">
              <label for="name">Weight (in grams)</label>
              <InputNumber
                :minFractionDigits="0"
                :maxFractionDigits="5"
                id="name"
                v-model.trim="editEntry.weight"
                required="true"
                autofocus
              />
            </div>
            <div class="feild lg:col-2 col-12">
              <label for="name">Tags</label>
              <MultiSelect
                v-model="editEntry.tags"
                :options="tagData"
                option-label="name"
                @filter="filterInputEdit"
                option-value="code"
                placeholder="Select Tags"
                :filter="true"
              >
                <template #filtericon>
                  <i
                    @click="saveNewTagEdit"
                    class="pi pi-plus text-black p-icon p-multiselect-filter-icon"
                  ></i>
                </template>
              </MultiSelect>
            </div>
            <div class="feild lg:col-3 col-12">
              <label for="name">Vendor</label>
              <Dropdown
                filter
                v-model="editEntry.vendor"
                :options="vendorData"
                option-label="name"
                option-value="code"
                placeholder="Select"
              />
            </div>
            <div class="field lg:col-12 col-12">
              <label for="name">Description</label>
              <Textarea v-model="editEntry.description" rows="5" cols="100" />
            </div>
          </div>
          <div class="feild grid gap-6 mt-2">
            <div class="field">
              <h5 class="p-dialog-title ml-2">Home Listings</h5>
            </div>
          </div>
          <div class="feild grid lg:gap-6 mt-2 mb-2">
            <div v-for="list in homeListing" class="feild lg:col-2 col-6">
              <div class="field-checkbox mb-0">
                <Checkbox
                  id="checkOption1"
                  name="option"
                  :value="list.id"
                  v-model="homeListingShowEdit"
                />
                <label for="checkOption1">{{ list.name }}</label>
              </div>
            </div>
          </div>
          <ManageSku v-model="skudataedit"></ManageSku>
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
              :loading="submittededit"
              :disabled="submittededit"
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

        <Dialog
          v-model:visible="import_show"
          position="top"
          :style="{ width: '90%' }"
          header="Import Data"
          :modal="true"
          class="p-fluid"
        >
          <div class="feild grid gap-6 mt-2">
            <div class="field col-2">
              <label for="name">Sample Product</label>
              <Button
                label="Export"
                icon="pi pi-download"
                class="mr-2"
                severity="success"
                @click="exportSample('product')"
              />
            </div>
            <div class="field col-2">
              <label for="name">Sample SKU</label>
              <Button
                label="Export"
                icon="pi pi-download"
                class="mr-2"
                severity="success"
                @click="exportSample('sku')"
              />
            </div>
            <div class="feild col-2">
              <label for="name">Import Product</label>
              <input
                class="p-inputtext mt-2"
                @change="updateModel('product', $event)"
                type="file"
              />
              <Button
                label="Import"
                icon="pi pi-upload"
                class="mr-2 mt-2"
                severity="success"
                @click="importFile('product')"
              />
            </div>
            <div class="feild col-2">
              <label for="name">Import SKU</label>
              <input
                class="p-inputtext mt-2"
                type="file"
                @change="updateModel('sku', $event)"
              />
              <Button
                label="Import"
                icon="pi pi-upload"
                class="mr-2 mt-2"
                severity="success"
                @click="importFile('sku')"
              />
            </div>
          </div>
        </Dialog>
      </div>
    </div>
  </div>
  <ImageUploader
    :visible="imageUploaderProduct"
    v-model="makeEntry.images"
    @close="imageUploaderProduct = false"
  ></ImageUploader>
  <ImageUploader
    :visible="imageUploaderProductEdit"
    v-model="editEntry.images"
    @close="imageUploaderProductEdit = false"
  ></ImageUploader>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useToast } from "primevue/usetoast";
import makeCustomRequest from "../../../composables/makeCustomRequest";
import ManageSku from "../../../components/ManageSku.vue";
import InputNumber from "primevue/inputnumber";
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

const totalPages = ref(0);
const page = ref(1);
const searchQuery = ref("");
const filters = ref(getFilter(["user", "category"]));

const homeListingShow = ref([]);
const homeListingShowEdit = ref([]);
const imageUploaderProduct = ref(false);
const imageUploaderProductEdit = ref(false);
const skudata = ref({
  1: {
    name: "",
    color: "",
    size: "",
    stock: "",
    price: "",
    price_subscribed: "",
    images: [],
  },
});
const skudataedit = ref({
  1: {
    name: "",
    color: "",
    size: "",
    stock: "",
    price: "",
    price_subscribed: "",
    images: [],
  },
});
// Get entries
onMounted(() => {
  getTableData();
  getPlucks();
  getHomeListing();
});

const table = ref();
const data = ref(null);

const tagData = ref([]);
const vendorData = ref([]);

const getPlucks = async () => {
  const data_vendor = await makeCustomRequest({
    url: "api/getVendors",
    method: "POST",
  });
  const data_tags = await makeCustomRequest({
    url: "api/getTags",
    method: "POST",
  });
  tagData.value = data_tags;
  vendorData.value = data_vendor;
};

const updateSearch = (newSearchQuery) => {
  searchQuery.value = newSearchQuery;
};

const loading = ref(true);
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
  const res = await makeCustomRequest({
    url: `api/Masters/Products?page=${page.value}`,
    method: "GET",
    query: {
      from_date: filters.value.from_date,
      to_date: filters.value.to_date,
      category: filters.value.category_id,
      seller: filters.value.user_id,
      search: searchQuery.value,
      // ...filters.value,
    },
  });
  if (res) {
    const total_records = res.data.total;
    const per_page = res.data.per_page;
    totalPages.value = Math.ceil(total_records / per_page);
    data.value = res;
  }
  loading.value = false;
  getCatgMast();
};

const pagination = computed(() => {
  if (data.value) {
    const last_page = toFixed(data.value.total / 5);
    return { current: data.value.current_page, total: data.total, last: last_page };
  }
});

const showDetails = async (order_id, details = 1) => {
  const response = await makeCustomRequest({
    url: `api/salesOrderReport?details=1&order_id=${order_id}`,
    method: "GET",
  });
  if (response) {
    userData.value = response;
    detailDialog.value = true;
  } else {
    toast.add({
      severity: "error",
      summary: "error in getting seles data",
      life: 3000,
    });
  }
};

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

const homeListing = ref();
const getHomeListing = async () => {
  const res = await makeCustomRequest({
    url: "api/getHomeListing",
    method: "POST",
  });
  if (res.success) {
    homeListing.value = res.data;
  }
};
const makeEntry = reactive({
  name: "",
  mrp: "",
  category: "",
  is_highlighted: 0,
  description: "",
  images: [],
  vendor: "",
  tags: [],
});

const saveEntry = async () => {
  submitted.value = true;
  if (makeEntry.name != "" && makeEntry.category != "") {
    const url = "api/Masters/Products";
    const res = await makeCustomRequest({
      url: url,
      method: "POST",
      body: {
        name: makeEntry.name,
        category: makeEntry.category,
        mrp: makeEntry.mrp,
        description: makeEntry.description,
        homeListing: homeListingShow.value,
        sku: skudata.value,
        images: makeEntry.images,
        vendor: makeEntry.vendor,
        tags: makeEntry.tags,
        newTags: createNewTags.value,
        discount: makeEntry.discount,
        tax: makeEntry.tax,
        weight: makeEntry.weight,
      },
    });
    if (res.res) {
      createDialog.value = false;
      getTableData();
      makeEntry.name = "";
      makeEntry.category = "";
      makeEntry.mrp = "";
      makeEntry.images = [];
      homeListing.value = [];
      skudata.value = {
        1: {
          name: "",
          color: "",
          size: "",
          stock: "",
          price: "",
          images: [],
        },
      };
      createNewTags.value = [];
      toast.add({
        severity: "success",
        summary: "Product added successfully",
        life: 3000,
      });
    } else {
      toast.add({ severity: "error", summary: "Something went wrong", life: 3000 });
    }
  }
  // submitted.value = false;
};
// create Ends

// Edit entry
const editEntry = reactive({
  name: "",
  mrp: "",
  category: "",
  description: "",
  images: [],
  vendor: "",
  tags: [],
});

const editEntryOpen = async (en) => {
  const url = `api/getDataEdit`;
  const dataEdit = await makeCustomRequest({
    url: url,
    method: "POST",
    body: {
      product_id: en.id,
    },
  });
  editEntry.name = en.name;
  editEntry.id = en.id;
  editEntry.mrp = en.mrp;
  editEntry.category = en.category;
  editEntry.is_highlighted = en.is_highlighted;
  editEntry.images = en.images;
  editEntry.description = en.description;
  editEntry.vendor = en.vendor;
  editEntry.tags = en.tags;
  editEntry.discount = en.discount;
  editEntry.tax = en.tax;
  editEntry.weight = en.weight;
  homeListingShowEdit.value = dataEdit.listing;
  skudataedit.value = dataEdit.sku;
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
        mrp: editEntry.mrp,
        description: editEntry.description,
        homeListing: homeListingShowEdit.value,
        sku: skudataedit.value,
        images: editEntry.images,
        vendor: editEntry.vendor,
        tags: editEntry.tags,
        newTags: createNewTagsEdit.value,
        tax: editEntry.tax,
        discount: editEntry.discount,
        weight: editEntry.weight,
      },
    });
    if (res.res) {
      editDialog.value = false;
      editEntry.name = "";
      editEntry.category = "";
      editEntry.mrp = "";
      editEntry.images = [];
      homeListingShowEdit.value = [];

      getTableData();
      toast.add({
        severity: "success",
        summary: "Product updated successfully",
        life: 3000,
      });
      const data_tags = await makeCustomRequest({
        url: "api/getTags",
        method: "POST",
      });
      tagData.value = data_tags;
      createNewTagsEdit.value = [];
    } else {
      toast.add({ severity: "error", summary: "Something went wrong", life: 3000 });
    }
  }
  submittededit.value = false;
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
  if (res.success) {
    catgMast.value = res.data;
    const arr = [];
    for (let index = 0; index < catgMast.value.length; index++) {
      arr[catgMast.value[index].id] = catgMast.value[index].name;
    }
    catgMastIndexedArr.value = arr;
  }
};
const nameParentCatg = (id) => {
  if (catgMastIndexedArr.value) {
    return catgMastIndexedArr.value[id] ? catgMastIndexedArr.value[id] : "N/A";
  }
};
const exportData = async (opt) => {
  try {
    const config = useRuntimeConfig();
    const backendUrl = config.public.API_BASE_URL;
    const url = `${backendUrl}api/exportData?option=${opt}`;
    const token = localStorage.getItem("OAuth-token");
    if (!token) {
      navigateTo("/login");
    }
    const response = await useFetch(url, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    const url_blob = window.URL.createObjectURL(new Blob([response.data.value]));
    const link = document.createElement("a");
    link.href = url_blob;
    link.setAttribute("download", `${opt}.csv`);
    document.body.appendChild(link);
    link.click();
  } catch (err) {}
};
const import_show = ref(false);
const uploaded_product = ref(null);
const uploaded_sku = ref(null);
const importDataShow = () => {
  import_show.value = true;
};
const updateModel = async (option, e) => {
  const file = e.target.files[0];
  if (option == "product") {
    uploaded_product.value = file;
  } else {
    uploaded_sku.value = file;
  }
};
const exportSample = async (option) => {
  try {
    const config = useRuntimeConfig();
    const backendUrl = config.public.API_BASE_URL;
    const url =
      option == "product"
        ? `${backendUrl}api/exportData?option=export_sample_product`
        : `${backendUrl}api/exportData?option=export_sample_sku`;
    const token = localStorage.getItem("OAuth-token");
    if (!token) {
      navigateTo("/login");
    }
    const response = await useFetch(url, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    const url_blob = window.URL.createObjectURL(new Blob([response.data.value]));
    const link = document.createElement("a");
    link.href = url_blob;
    link.setAttribute("download", `${option}.csv`);
    document.body.appendChild(link);
    link.click();
  } catch (err) {}
};
const importFile = async (option) => {
  if (!uploaded_product.value && !uploaded_sku.value) {
    toast.add({ severity: "error", summary: "No file chosen", life: 3000 });
    return;
  }

  const config = useRuntimeConfig();
  const backendUrl = config.public.API_BASE_URL;
  const file = option == "product" ? uploaded_product.value : uploaded_sku.value;
  const url =
    option == "product"
      ? `${backendUrl}api/importData?option=import_product`
      : `${backendUrl}api/importData?option=import_sku`;
  const formData = new FormData();
  formData.append("file", file);
  formData.append("option", option);
  const token = localStorage.getItem("OAuth-token");
  if (!token) {
    navigateTo("/login");
  }
  const response = await useFetch(url, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + token,
    },
    body: formData,
  });
  if (response.data.value) {
    if (response.data.value.success) {
      import_show.value = false;
      toast.add({
        severity: "success",
        summary: "Product uploaded successfully",
        life: 3000,
      });
    } else if (!response.data.value.success && response.data.value.msg) {
      toast.add({ severity: "error", summary: response.msg, life: 3000 });
    } else {
      toast.add({ severity: "error", summary: "Something went wrong", life: 3000 });
    }
  } else {
    toast.add({ severity: "error", summary: "Something went wrong", life: 3000 });
  }
  getTableData();
  // console.log(response);
};
watch((page, searchQuery, filters) => {
  getTableData();
});

const filtered = ref("");
const filterInput = (e) => {
  filtered.value = e.value ? e.value : "";
};
const createNewTags = ref([]);
const saveNewTag = () => {
  if (filtered.value) {
    const code = generateRandomString(10);
    createNewTags.value.push({ name: filtered.value, code: `new${code}` });
    tagData.value.push({ name: filtered.value, code: `new${code}` });
    makeEntry.tags.push(`new${code}`);
  }
};

const filteredEdit = ref("");
const filterInputEdit = (e) => {
  filteredEdit.value = e.value ? e.value : "";
};
const createNewTagsEdit = ref([]);
const saveNewTagEdit = () => {
  if (filteredEdit.value) {
    const code = generateRandomString(10);
    createNewTagsEdit.value.push({ name: filteredEdit.value, code: `new${code}` });
    tagData.value.push({ name: filteredEdit.value, code: `new${code}` });
    editEntry.tags.push(`new${code}`);
  }
};

function generateRandomString(length) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}
const rePostProduct = async (product) => {
  const response = await makeCustomRequest({
    url: "api/repostSingleProduct",
    method: "POST",
    body: {
      product_id: product.id,
    },
  });
  if (response.success) {
    toast.add({ severity: "success", summary: "Reposted successfully", life: 3000 });
  } else {
    toast.add({ severity: "error", summary: "Something went wrong", life: 3000 });
  }
};
const reposting = ref(false);
const repostRandom = async () => {
  reposting.value - true;
  const response = await makeCustomRequest({
    url: "api/repostRandomManual",
    method: "POST",
  });
  if (response.success) {
    toast.add({ severity: "success", summary: "Reposted successfully", life: 3000 });
  } else {
    toast.add({ severity: "error", summary: "Something went wrong", life: 3000 });
  }
  reposting.value = false;
};
const scheduling = ref(false);
const scheduleRepost = async () => {
  scheduling.value - true;
  const response = await makeCustomRequest({
    url: "api/scheduleRepost",
    method: "POST",
  });
  if (response.success) {
    toast.add({ severity: "success", summary: "Scheduled successfully", life: 3000 });
  } else {
    toast.add({
      severity: "error",
      summary: response.msg ? response.msg : "Something went wrong",
      life: 3000,
    });
  }
  scheduling.value = false;
};
</script>
