<template>
  <div class="grid">
    <div class="col-12">
      <div class="card">
        <Toolbar class="mb-4">
          <template v-slot:start>
            <div class="my-2">
              <Button
                label="New Listing"
                icon="pi pi-plus"
                class="mr-2"
                severity="success"
                @click="openNew"
              />
              <Button
                label="New Banner"
                icon="pi pi-plus"
                class="mr-2"
                severity="success"
                @click="openNewBanner"
              />
              <Button
                label="Manage Sequence"
                icon="pi pi-cog"
                class="mr-2"
                severity="success"
                @click="showSequenceDialog"
              />
            </div>
          </template>
        </Toolbar>
        <DataTable
          v-if="data"
          ref="table"
          :value="data.data"
          dataKey="id"
          :paginator="true"
          :rows="10"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          :rowsPerPageOptions="[5, 10, 25]"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
        >
          <template #header>
            <div
              class="flex flex-column md:flex-row md:justify-content-between md:align-items-center"
            >
              <h5 class="m-0">Manage Home Listings and Banners</h5>
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
          <Column field="Type" header="Type" headerStyle="width:auto; min-width:10rem;">
            <template #body="slotProps">
              <span class="p-column-title">Type</span>
              {{ slotProps.data.is_banner ? "Banner" : "Listing" }}
            </template>
          </Column>
          <Column field="Title" header="Title" headerStyle="width:auto; min-width:10rem;">
            <template #body="slotProps">
              <span class="p-column-title">Title</span>
              {{ slotProps.data.name }}
            </template>
          </Column>
          <Column field="Action" header="Action" headerStyle="min-width:10rem;">
            <template #body="slotProps">
              <Button
                v-if="!slotProps.data.is_banner"
                icon="pi pi-pencil"
                class="mr-2"
                severity="success"
                rounded
                @click="editEntryOpen(slotProps.data)"
              />
              <Button
                v-else
                icon="pi pi-pencil"
                class="mr-2"
                severity="success"
                rounded
                @click="editEntryOpenBanner(slotProps.data)"
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

        <div
          v-else
          class="flex items-center justify-center text-primary"
          style="justify-content: center"
        >
          <span><i class="pi pi-spin pi-spinner text-8xl"></i></span>
        </div>

        <Dialog
          v-model:visible="createDialog"
          :style="{ width: '450px' }"
          header="Create Listing"
          :modal="true"
          class="p-fluid"
        >
          <div class="field">
            <label for="name">Name</label>
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
          header="Edit Category"
          :modal="true"
          class="p-fluid"
        >
          <div class="field">
            <label for="name">Name</label>
            <InputText
              id="name"
              v-model.trim="editEntry.name"
              required="true"
              autofocus
              :invalid="submittededit && !editEntry.name"
            />
            <small class="p-invalid" v-if="submittededit && !editEntry.name"
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

        <!-- Banner -->
        <Dialog
          v-model:visible="createDialogBanner"
          :style="{ width: '450px' }"
          header="Create banner"
          :modal="true"
          class="p-fluid"
        >
          <div class="field">
            <label for="name">Name</label>
            <InputText
              id="name"
              v-model.trim="makeEntryBanner.name"
              required="true"
              autofocus
              :invalid="submitted && !makeEntryBanner.name"
            />
            <small class="p-invalid" v-if="submittedBanner && !makeEntryBanner.name"
              >Name is required.</small
            >
          </div>
          <div class="field col">
            <label for="name">Images</label>
            <Button
              icon="pi pi-upload"
              class="ml-2"
              rounded
              severity="success"
              @click="imageUploaderBanner = true"
            />
            <span class="text-primary"></span>
            {{
              makeEntryBanner.image.length
                ? makeEntryBanner.image.length + " Selected"
                : ""
            }}
          </div>
          <ImageUploader
            :visible="imageUploaderBanner"
            v-model="makeEntryBanner.image"
            @close="imageUploaderBanner = false"
          ></ImageUploader>
          <div class="field col">
            <label for="name">Mobile Banner</label>
            <Button
              icon="pi pi-upload"
              class="ml-2"
              rounded
              severity="success"
              @click="imageUploaderBannerMboile = true"
            />
            <span class="text-primary"></span>
            {{
              makeEntryBanner.mobile_image.length
                ? makeEntryBanner.mobile_image.length + " Selected"
                : ""
            }}
          </div>
          <ImageUploader
            :visible="imageUploaderBannerMboile"
            v-model="makeEntryBanner.mobile_image"
            @close="imageUploaderBannerMboile = false"
          ></ImageUploader>
          <template #footer>
            <Button
              label="Cancel"
              icon="pi pi-times"
              class="mr-2"
              severity="danger"
              @click="hideDialogBanner"
            />
            <Button
              label="Save"
              icon="pi pi-check"
              class="mr-2"
              severity="success"
              @click="saveEntryBanner"
            />
          </template>
        </Dialog>

        <Dialog
          v-model:visible="editDialogBanner"
          :style="{ width: '450px' }"
          header="Edit banner"
          :modal="true"
          class="p-fluid"
        >
          <div class="field">
            <label for="name">Name</label>
            <InputText
              id="name"
              v-model.trim="editEntryBanner.name"
              required="true"
              autofocus
              :invalid="submittededitBanner && !editEntryBanner.name"
            />
            <small class="p-invalid" v-if="submittededitBanner && !editEntryBanner.name"
              >Name is required.</small
            >
          </div>
          <div class="field col">
            <label for="name">Images</label>
            <Button
              icon="pi pi-upload"
              class="ml-2"
              rounded
              severity="success"
              @click="imageUploaderBannerEdit = true"
            />
            <span class="text-primary"></span>
            {{
              editEntryBanner.image.length
                ? editEntryBanner.image.length + " Selected"
                : ""
            }}
          </div>
          <ImageUploader
            :visible="imageUploaderBannerEdit"
            v-model="editEntryBanner.image"
            @close="imageUploaderBannerEdit = false"
          ></ImageUploader>
          <div class="field col">
            <label for="name">Mobile Banner</label>
            <Button
              icon="pi pi-upload"
              class="ml-2"
              rounded
              severity="success"
              @click="imageUploaderBannerMboileEdit = true"
            />
            <span class="text-primary"></span>
            {{
              editEntryBanner.mobile_image.length
                ? editEntryBanner.mobile_image.length + " Selected"
                : ""
            }}
          </div>
          <ImageUploader
            :visible="imageUploaderBannerMboileEdit"
            v-model="editEntryBanner.mobile_image"
            @close="imageUploaderBannerMboileEdit = false"
          ></ImageUploader>
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
              @click="updateEntryBannerEdit"
            />
          </template>
        </Dialog>
      </div>
    </div>
  </div>
  <Dialog
    v-model:visible="showSequence"
    :style="{ width: '50%' }"
    position="top"
    header="Manage sequence"
    :modal="true"
    class="p-fluid"
  >
    <div class="feild grid mt-2">
      <div v-for="(listin, index) in sequence_data" class="col-12 flex">
        <div class="field col-6">
          <label
            ><b>{{ listin.name }}</b></label
          >
        </div>
        <div class="field col-6">
          <InputNumber
            v-model="sequence_data[index].sequence"
            required="true"
            autofocus
          />
        </div>
      </div>
    </div>
    <template #footer>
      <Button
        label="Cancel"
        icon="pi pi-times"
        class="mr-2"
        severity="danger"
        @click="showSequence = false"
      />
      <Button
        label="Save"
        icon="pi pi-check"
        class="mr-2"
        severity="success"
        @click="saveEntrySequence"
      />
    </template>
  </Dialog>
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
const createImageUploader = ref(false);
const editImageUploader = ref(false);

const searchQuery = ref("");
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
    url: "api/Masters/HomeListing?page=1",
    method: "GET",
    query: {
      search: searchQuery.value,
    },
  });
};
// Get entries ends

const updateSearch = (newSearchQuery) => {
  searchQuery.value = newSearchQuery;
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
  editDialogBanner.value = false;
  editDialog.value = false;
  submittededit.value = false;
};

const makeEntry = reactive({
  name: "",
  is_banner: 0,
});

const saveEntry = async () => {
  submitted.value = true;
  if (makeEntry.name != "") {
    const url = "api/Masters/HomeListing";
    const res = await makeCustomRequest({
      url: url,
      method: "POST",
      body: { name: makeEntry.name, is_banner: makeEntry.is_banner },
    });
    if (res.success) {
      createDialog.value = false;
      getTableData();
      toast.add({
        severity: "success",
        summary: "Lising added successfully",
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
  id: "",
  name: "",
});

const editEntryOpen = (en) => {
  editEntry.name = en.name;
  editEntry.id = en.id;
  editEntry.is_banner = 0;
  editDialog.value = true;
};

const updateEntry = async () => {
  submittededit.value = true;
  if (editEntry.name != "") {
    const url = `api/Masters/HomeListing/${editEntry.id}`;
    const token = localStorage.getItem("OAuth-token");
    const res = await makeCustomRequest({
      url: url,
      method: "PATCH",
      body: { name: editEntry.name, is_banner: editEntry.is_banner },
    });
    if (res.success) {
      editDialog.value = false;
      getTableData();
      toast.add({
        severity: "success",
        summary: "Listing updated successfully",
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
});

const confirmDeleteEntry = (deleteprod) => {
  deleteEntry.name = deleteprod.name;
  deleteEntry.id = deleteprod.id;
  deleteDialog.value = true;
};
const deleteEntrySingle = async () => {
  const url = `api/Masters/HomeListing/${deleteEntry.id}`;
  const token = localStorage.getItem("OAuth-token");
  const res = await makeCustomRequest({
    url: url,
    method: "DELETE",
    is_banner: 0,
    body: { id: deleteEntry.id },
  });
  if (res.success) {
    deleteDialog.value = false;
    getTableData();
    toast.add({
      severity: "success",
      summary: "Listing deleted successfully",
      life: 3000,
    });
  } else {
    toast.add({ severity: "error", summary: "Something went wrong", life: 3000 });
  }
};
// Delete entry ends

// create entry Banner
const submittedBanner = ref(false);
const createDialogBanner = ref(false);
const imageUploaderBanner = ref(false);
const submittededitBanner = ref(false);
const editDialogBanner = ref(false);
const imageUploaderBannerEdit = ref(false);
const imageUploaderBannerMboile = ref(false);
const imageUploaderBannerMboileEdit = ref(false);

const makeEntryBanner = reactive({
  name: "",
  image: [],
  mobile_image: [],
  is_banner: 1,
});
const openNewBanner = () => {
  submitted.value = false;
  createDialogBanner.value = true;
};
const hideDialogBanner = () => {
  createDialogBanner.value = false;
  submittedBanner.value = false;
};
const saveEntryBanner = async () => {
  submitted.value = true;
  if (makeEntryBanner.name != "") {
    const url = "api/Masters/HomeListing";
    const res = await makeCustomRequest({
      url: url,
      method: "POST",
      body: {
        name: makeEntryBanner.name,
        is_banner: makeEntryBanner.is_banner,
        images: makeEntryBanner.image,
        mobile_image: makeEntryBanner.mobile_image,
      },
    });
    if (res.success) {
      createDialogBanner.value = false;
      getTableData();
      toast.add({
        severity: "success",
        summary: "Lising added successfully",
        life: 3000,
      });
    } else {
      toast.add({ severity: "error", summary: "Something went wrong", life: 3000 });
    }
  }
};

// edit entry banner
const editEntryBanner = reactive({
  name: "",
  image: [],
  mobile_image: [],
  is_banner: 1,
  id: "",
});

const editEntryOpenBanner = (en) => {
  editEntryBanner.name = en.name;
  editEntryBanner.id = en.id;
  editEntryBanner.is_banner = 1;
  editEntryBanner.image = en.images;
  editEntryBanner.mobile_image = en.mobile_images;
  editDialogBanner.value = true;
};
const updateEntryBannerEdit = async () => {
  submittededitBanner.value = true;
  if (editEntryBanner.name != "") {
    const url = `api/Masters/HomeListing/${editEntryBanner.id}`;
    const res = await makeCustomRequest({
      url: url,
      method: "PATCH",
      body: {
        name: editEntryBanner.name,
        is_banner: editEntryBanner.is_banner,
        images: editEntryBanner.image,
        mobile_image: editEntryBanner.mobile_image,
      },
    });
    if (res.success) {
      editDialogBanner.value = false;
      getTableData();
      toast.add({
        severity: "success",
        summary: "Banner updated successfully",
        life: 3000,
      });
    } else {
      toast.add({ severity: "error", summary: "Something went wrong", life: 3000 });
    }
  }
};

const sequence_data = ref([]);
const sequence_model = ref([]);
const showSequenceDialog = async () => {
  showSequence.value = true;
  const url = "api/getSequenceMast";
  const res = await makeCustomRequest({
    url: url,
    method: "GET",
  });
  if (res.success) {
    sequence_data.value = res.data;
  }
};

const saveEntrySequence = async () => {
  const url = "api/saveSequenceMast";
  const res = await makeCustomRequest({
    url: url,
    method: "POST",
    body: { data: sequence_data.value },
  });
  if (res.success) {
    toast.add({
      severity: "success",
      summary: "Sequence updated successfully",
      life: 3000,
    });
    showSequence.value = false;
  }
};

watch((searchQuery) => {
  getTableData();
});
// sequence
const showSequence = ref(false);
</script>
