<template>
    <Dialog v-model:visible="props.visible" :style="{ width: '90%', height:'100%' }" position="top">
        <template #header>
            <i @click="handleClose" class="pi pi-check p-2 bg-teal-400 border-round text-white"></i>
        </template>
        <template #closeicon>
            &nbsp;
        </template>
        <div class="card">
            <Toast />
            <FileUpload name="demo[]" url="/api/upload" customUpload @upload="onTemplatedUpload($event)" :multiple="true" accept="image/*" :maxFileSize="1000000" @select="onSelectedFiles" @uploader="customBase64Uploader">
                <template #header="{ chooseCallback, uploadCallback, clearCallback, files }">
                    <div class="flex flex-wrap justify-between items-center flex-1 gap-4">
                        <div class="flex gap-2">
                            <Button @click="chooseCallback()" icon="pi pi-images" rounded outlined severity="secondary"></Button>
                            <Button @click="uploadEvent(uploadCallback)" icon="pi pi-cloud-upload" rounded outlined severity="success" :disabled="!files || files.length === 0"></Button>
                            <Button @click="clearCallback()" icon="pi pi-times" rounded outlined severity="danger" :disabled="!files || files.length === 0"></Button>
                        </div>
                        <ProgressBar :value="totalSizePercent" :showValue="false" class="md:w-20rem h-1 w-full md:ml-auto">
                            <span class="whitespace-nowrap">{{ totalSize }}B / 1Mb</span>
                        </ProgressBar>
                    </div>
                </template>
                <template #content="{ files, uploadedFiles, removeUploadedFileCallback, removeFileCallback }">
                    <div class="flex flex-wrap gap-2 pt-4">
                        <div v-if="files.length > 0">
                            <h5>Pending</h5>
                            <div class="flex flex-wrap gap-1">
                                <div v-for="(file, index) of files" :key="file.name + file.type + file.size" class="p-2 rounded-border flex flex-col border border-surface items-center gap-4">
                                    <div>
                                        <img role="presentation" :alt="file.name" :src="file.objectURL" width="100" height="50" />
                                    </div>
                                    <span class="font-semibold text-ellipsis max-w-60 whitespace-nowrap overflow-hidden">{{ file.name }}</span>
                                    <div>{{ formatSize(file.size) }}</div>
                                    <Badge value="Pending" severity="warn" />
                                    <Button icon="pi pi-times" @click="onRemoveTemplatingFile(file, removeFileCallback, index)" outlined rounded severity="danger" />
                                </div>
                            </div>
                        </div>

                        <div v-if="uploadedFiles.length > 0">
                            <h5>Completed</h5>
                            <div class="flex flex-wrap gap-4">
                                <div v-for="(file, index) of uploadedFiles" :key="file.name + file.type + file.size" class="p-2 rounded-border flex flex-col border border-surface items-center gap-4">
                                    <div>
                                        <img role="presentation" :alt="file.name" :src="file.objectURL" width="100" height="50" />
                                    </div>
                                    <span class="font-semibold text-ellipsis max-w-60 whitespace-nowrap overflow-hidden">{{ file.name }}</span>
                                    <div>{{ formatSize(file.size) }}</div>
                                    <Badge value="Completed" class="mt-4" severity="success" />
                                    <Button icon="pi pi-times" @click="removeUploadedFileCallback(index)" outlined rounded severity="danger" />
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
            </FileUpload>
        </div>
        <!-- <div class="grid mb-3">
            <InputText class="mt-2 col-12" placeholder="Search" />
        </div> -->
        <div class="grid" v-if="sortedPreUploads.length > 0">
            <div v-for="upload in sortedPreUploads" class="col-2 relative">
                    <i v-if="selectedUrls.includes(upload.source)" class="pi pi-check bg-primary p-1 border-round absolute"></i>
                    <span class="bg-primary p-1 border-round absolute bottom-0">{{ upload.code }}</span>
                    <i @click="copyFileSource(upload.source)" class="pi pi-copy bg-primary p-1 border-round absolute" style="right: 20px;"></i>
                    <i @click="deleteFileSource(upload.id , upload)" class="pi pi-trash bg-primary p-1 border-round absolute" style="right: 80px;"></i>
                    <div class="w-9rem h-9rem">
                        <img :title="upload.name" @click="ChooseFile(upload.id)" class="w-full h-full border-round-lg" :src="upload.source"></img>
                    </div>
                </div>
            </div>    
      <TableFooter :totalPages="totalPages" v-model="page"></TableFooter>
    </Dialog>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { usePrimeVue } from 'primevue/config';
import { useToast } from "primevue/usetoast";

const props = defineProps({
    visible: {
        type: Boolean,
        default: false
    },
    modelValue: {
        default: () => [],
        type : Array
    },
    single  : {
        default : false
    }
});

watch(() => props.visible, (isVisible) => {
    if (isVisible) {
        loadImages();
    }
});
const $primevue = usePrimeVue();
const toast = useToast();

const totalSize = ref(0);
const totalSizePercent = ref(0);
const files = ref([]);
const preUploads = ref([]);

onMounted(() => {
    loadImages();
});
const totalPages = ref(0);
const page = ref(1);
watch(page , () => {
    loadImages();
});
const loadImages =async () => {
    if (process.client) {
        const res = await makeCustomRequest({
            url: `api/getImages?page=${page.value}`,
            method: 'POST',
        });
        if (res.success) {
            const total_records = res.imagesquery.total;
            const per_page = res.imagesquery.per_page;
            totalPages.value = Math.ceil(total_records / per_page);
            preUploads.value = res.imagesquery.data;
        }
    }
}

const emits = defineEmits(['update:modelValue', 'close']);
const handleClose = () => {
    emits('close');
};
const selectedUrls = ref(props.modelValue ? props.modelValue.map(val => val.source) : []);

watch(() => props.modelValue, (newValue) => {
    if(props.modelValue){
        selectedUrls.value = newValue.map(val => val.source);
    }
}, { immediate: true });
const ChooseFile = (file) => {
    const found = props.modelValue ? props.modelValue.some(fileinModel => file.source === fileinModel.source) : false;
    if (found) {
        selectedUrls.value = selectedUrls.value.filter(selurl => selurl !== file.source);
        emits('update:modelValue', props.modelValue.filter(fileinModel => fileinModel.source !== file.source));
    } else {
        if(props.single){
            if(selectedUrls.value.length > 0){
                return;
            }
        }
        selectedUrls.value = [...selectedUrls.value, file.source];
        emits('update:modelValue', [...props.modelValue, file]);
    }
};

const uploadCallback = () => {};

const onRemoveTemplatingFile = (file, removeFileCallback, index) => {
    removeFileCallback(index);
    totalSize.value -= parseInt(formatSize(file.size));
    totalSizePercent.value = totalSize.value / 10;
};

const onClearTemplatingUpload = (clearCallback) => {
    clearCallback();
    totalSize.value = 0;
    totalSizePercent.value = 0; // Reset progress when clearing files
    files.value = [];
    uploadedFiles.value = [];
};

const onSelectedFiles = (event) => {
    files.value = event.files;
    totalSize.value = files.value.reduce((total, file) => total + file.size, 0); // Calculate total size
    totalSizePercent.value = 0;  // Reset progress
    updateProgress();
};

const uploadEvent = (callback) => {
    totalSizePercent.value = totalSize.value / 10;
    callback();
    updateProgress();
};

const updateProgress = () => {
    const uploadedSize = uploadedFiles.value.reduce((total, file) => total + file.size, 0);
    totalSizePercent.value = (uploadedSize / totalSize.value) * 100;
    
    if (totalSizePercent.value >= 100) {
        totalSizePercent.value = 100;
    }
};

const onTemplatedUpload = () => {
    uploadedFiles.value = [...uploadedFiles.value, ...event.files];  
    updateProgress();                                                
    toast.add({ severity: "info", summary: "Success", detail: "File Uploaded", life: 3000 });
};

const formatSize = (bytes) => {
    const k = 1024;
    const dm = 3;
    const sizes = $primevue.config.locale.fileSizeTypes;

    if (bytes === 0) {
        return `0 ${sizes[0]}`;
    }

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const formattedSize = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));

    return `${formattedSize} ${sizes[i]}`;
};

const customBase64Uploader = async (event) => {
    for (let index = 0; index < event.files.length; index++) {
        const file = event.files[index];
        const reader = new FileReader();
        const blob = await fetch(file.objectURL).then(r => r.blob()); // blob:url

        reader.readAsDataURL(blob);

        reader.onloadend = async function () {
            const base64data = reader.result;
            const res = await makeCustomRequest({
                url: 'api/Upload',
                method: 'POST',
                body: {
                    image: base64data,
                    name: file.name
                }
            });
            if (res.success) {
                preUploads.value.unshift({ 
                    'source': res.data.source, 
                    'name': res.data.name,
                    'code': res.data.code
                });
            }
        };
    }
};
const deleteFileSource =async (id , image) => {
    if(id){
        const response =await makeCustomRequest({
            url : `api/deleteProductImage`,
            method : 'POST',
            body : {
                id : id
            }  
        });
        if(response.success){
            preUploads.value = preUploads.value.filter((upload) => upload.id !== id);
            toast.add({ severity: "success", summary: "Deleted successfully", life: 3000 });
        }
    }
}
const copyFileSource = async (source) => {
    try {
        await navigator.clipboard.writeText(source);
        toast.add({ severity: "success", summary: "Copied", life: 3000 });
    } catch (err) {
        toast.add({ severity: "danger", summary: "Failed to Copy!", life: 3000 });
    }
};
const sortedPreUploads = computed(() => {
    return preUploads.value.slice().sort((a, b) => {
        const aInPriority = selectedUrls.value.includes(a.source);
        const bInPriority = selectedUrls.value.includes(b.source);
        if (aInPriority && !bInPriority) return -1;
        if (!aInPriority && bInPriority) return 1;
        return 0;
    });
});

</script>

<style scoped>
.p-dialog-content {
    height: 100% !important;
    overflow: scroll;
}
</style>
