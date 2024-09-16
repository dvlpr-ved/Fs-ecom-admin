<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <Toolbar class="mb-4">
                    <template v-slot:start>
                        <div class="my-2">
                            <Button label="New" icon="pi pi-plus" class="mr-2" severity="success" @click="openNew" />
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
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} roles">
                    <template #header>
                        <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                            <h5 class="m-0">Manage users</h5>
                            <IconField iconPosition="left" class="block mt-2 md:mt-0">
                                <InputIcon class="pi pi-search" />
                                <InputText class="w-full sm:w-auto"  placeholder="Search..." />
                            </IconField>
                        </div>
                    </template>
                    <Column field="ID" header="ID" headerStyle="width:auto; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">ID</span>
                            {{ slotProps.data.id }}
                        </template>
                    </Column>
                    <Column field="Name" header="Name"  headerStyle="width:auto; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">ID</span>
                            {{ slotProps.data.name }}
                        </template>
                    </Column>
                    <Column field="Name" header="Username"  headerStyle="width:auto; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Username</span>
                            {{ slotProps.data.email }}
                        </template>
                    </Column>
                    <Column field="Name" header="Password"  headerStyle="width:auto; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">password</span>
                            {{ slotProps.data.orig_password }}
                        </template>
                    </Column>
                    <Column field="Role" header="Role"  headerStyle="width:auto; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Role</span>
                            {{ nameRole(slotProps.data.role) }}
                        </template>
                    </Column>
                    <Column field="Role" header="Created at"  headerStyle="width:auto; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Created At</span>
                            {{ Date(slotProps.data.created_at) }}
                        </template>
                    </Column>
                    <Column field="Action" header="Action" headerStyle="min-width:10rem;">
                        <template #body="slotProps">
                            <Button icon="pi pi-pencil" class="mr-2" severity="success" rounded @click="editEntryOpen(slotProps.data)" />
                            <Button icon="pi pi-trash" class="mt-2" severity="warning" rounded @click="confirmDeleteEntry(slotProps.data)" />
                        </template>
                    </Column>
                </DataTable>

                <Dialog v-model:visible="createDialog" :style="{ width: '450px' }" header="Create User" :modal="true" class="p-fluid">
                    <div class="field">
                        <label for="name">Name<span class="text-red-400"> *</span></label>
                        <InputText id="name" v-model.trim="makeEntry.name" required="true" autofocus :invalid="submitted && !makeEntry.name" />
                        <small class="p-invalid" v-if="submitted && !makeEntry.name">Name is required.</small>
                    </div>
                    <div class="field">
                        <label for="name">Role<span class="text-red-400"> *</span></label>
                        <Dropdown v-model="makeEntry.role" :options="RoleMast" optionLabel="name" optionValue="id" placeholder="Select" />
                    </div>
                    <div class="field">
                        <label for="name">Username<span class="text-red-400"> *</span></label>
                        <InputText id="name" v-model.trim="makeEntry.email" required="true" autofocus :invalid="submitted && !makeEntry.email" />
                        <small class="p-invalid" v-if="submitted && !makeEntry.email">Username is required.</small>
                    </div>
                    <div class="field">
                        <label for="name">Password<span class="text-red-400"> *</span></label>
                        <InputText id="name" v-model.trim="makeEntry.password" required="true" autofocus :invalid="submitted && !makeEntry.email" />
                        <small class="p-invalid" v-if="submitted && !makeEntry.password">Password is required.</small>
                    </div>
                    <template #footer>
                        <Button label="Cancel" icon="pi pi-times" class="mr-2" severity="danger"  @click="hideDialog" />
                        <Button label="Save" icon="pi pi-check" class="mr-2" severity="success"  @click="saveEntry" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="editDialog" :style="{ width: '450px' }" header="Create Role" :modal="true" class="p-fluid">
                    <div class="field">
                        <label for="name">Name<span class="text-red-400"> *</span></label>
                        <InputText id="name" v-model.trim="editEntry.name" required="true" autofocus :invalid="submitted && !editEntry.name" />
                        <small class="p-invalid" v-if="submitted && !editEntry.name">Name is required.</small>
                    </div>
                    <div class="field">
                        <label for="name">Role<span class="text-red-400"> *</span></label>
                        <Dropdown v-model="editEntry.role" :options="RoleMast" optionLabel="name" optionValue="id" placeholder="Select" />
                    </div>
                    <div class="field">
                        <label for="name">Username<span class="text-red-400"> *</span></label>
                        <InputText id="name" v-model.trim="editEntry.email" required="true" autofocus :invalid="submitted && !editEntry.email" />
                        <small class="p-invalid" v-if="submitted && !editEntry.email">Username is required.</small>
                    </div>
                    <div class="field">
                        <label for="name">Password<span class="text-red-400"> *</span></label>
                        <InputText id="name" v-model.trim="editEntry.password" required="true" autofocus :invalid="submitted && !editEntry.email" />
                        <small class="p-invalid" v-if="submitted && !editEntry.password">Password is required.</small>
                    </div>
                    <template #footer>
                        <Button label="Cancel" icon="pi pi-times" class="mr-2" severity="danger"  @click="hideDialog" />
                        <Button label="Save" icon="pi pi-check" class="mr-2" severity="success"  @click="updateEntry" />
                    </template>
                </Dialog>                

                <Dialog v-model:visible="deleteDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="product"
                            >Are you sure you want to delete <b>{{ deleteEntry.name }}</b
                            >?</span>
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
import { ref, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import makeCustomRequest from '../../../composables/makeCustomRequest';
const toast = useToast();

const createDialog = ref(false);
const editDialog = ref(false);
const deleteDialog = ref(false);
const product = ref({});
const submitted = ref(false);
const submittededit = ref(false)
const RoleMast = ref(null);
const RoleMastIndexedArr = ref(null);
// Get entries
onMounted(() => {
    getTableData();
});
const table = ref();
const data = ref(null);

const pagination = computed(() => {
    if(data.value){
        const last_page = toFixed(data.value.total/10);
        return  {current : data.value.current_page , total : data.total , last : last_page};
    }
});
const getTableData = async  () => {
data.value  = await makeCustomRequest({
    url : 'api/Masters/User',
    method : 'GET',
});
getCatgRoleMst();
}
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
    name     : '',
    email    : '',
    password : '',
    role     : ''
});

const saveEntry = async () => {
    submitted.value = true;
    if(makeEntry.name != '' && makeEntry.email != '' && makeEntry.role != '' && makeEntry.password != ''){
        const url = "api/Masters/User";
        const token = localStorage.getItem('OAuth-token');
        const res = await makeCustomRequest({
            url : url,
            method : 'POST',
            body : {name : makeEntry.name, email : makeEntry.email , password : makeEntry.password , role : makeEntry.role}
        });
        if(res.res){
            createDialog.value= false;
            getTableData();
            toast.add({ severity: 'success', summary: 'User added successfully', life: 3000 });
        }
        else{
            toast.add({ severity: 'error', summary: 'Something went wrong', life: 3000 });
        }
    }
};
 // create Ends


 // Edit entry
const editEntry = reactive({
    name     : '',
    email    : '',
    password : '',
    role     : '',
    id       : ''
});

const editEntryOpen = (en) => {
    editEntry.name = en.name;
    editEntry.id = en.id;
    editEntry.email = en.email;
    editEntry.password = en.orig_password;
    editEntry.role = en.role;
    editDialog.value = true;
}

const updateEntry =async () => {
    submittededit.value = true;
    if(editEntry.name != '' && editEntry.email != '' && editEntry.role != '' && editEntry.password != ''){
        const url = `api/Masters/User/${editEntry.id}`;
        const token = localStorage.getItem('OAuth-token');
        const res = await makeCustomRequest({
            url : url,
            method : 'PATCH',
            body : {name : editEntry.name, email : editEntry.email , password : editEntry.password , role : editEntry.role}
        });
        if(res.res){
            editDialog.value= false;
            getTableData();
            toast.add({ severity: 'success', summary: 'User updated successfully', life: 3000 });
        }
        else{
            toast.add({ severity: 'error', summary: 'Something went wrong', life: 3000 });
        }
    }
};

// Edit entry ends

// Delete entry start 
const deleteEntry = reactive({
    id : '',
    name   : '',
});

const confirmDeleteEntry = (deleteprod) => {
    deleteEntry.name = deleteprod.name;
    deleteEntry.id = deleteprod.id;
    deleteDialog.value = true;
}
const deleteEntrySingle =async () => {
    const url = `api/Masters/User/${deleteEntry.id}`;
    const token = localStorage.getItem('OAuth-token');
    const res = await makeCustomRequest({
        url : url,
        method : 'DELETE',
        body : {id : deleteEntry.id}
    });
    if(res.res){
        deleteDialog.value= false;
        getTableData();
        toast.add({ severity: 'success', summary: 'User deleted successfully', life: 3000 });
    }
    else{
        toast.add({ severity: 'error', summary: 'Something went wrong', life: 3000 });
    }
}
// Delete entry ends


const getCatgRoleMst =async () => {
    const url = 'api/Masters/RoleMast';
    const res = await makeCustomRequest({
        url : url,
        method : 'GET',
    });    
    if(res.res){
        RoleMast.value = res.data;
        const arr = [];        
        for (let index = 0; index < RoleMast.value.length; index++) {
            arr[RoleMast.value[index].id] = RoleMast.value[index].name; 
        }
        RoleMastIndexedArr.value = arr;
    }
}
const nameRole = (id) => {
    if(RoleMastIndexedArr.value) {
        return RoleMastIndexedArr.value[id] ? RoleMastIndexedArr.value[id] : 'N/A';
    }
}

</script>