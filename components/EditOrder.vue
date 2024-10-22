<template>
    <!-- <div class="feild grid gap-6 mt-2">
      <div class="col-10 text-align-left">
        <h5 class="p-dialog-title">Edit order items</h5>
      </div>
    </div> -->
    <div v-for="row in rows" :key="row" class="feild grid mt-2">
      <div class="field lg:col-3 col-12">
        <label for="name">Product <span class="text-red-400">*</span></label><br>
         {{ localData[row].product_name }}
      </div>
      <div class="field lg:col-4 col-12">
        <div class="feild grid">
          <div class="col-6">
            <label for="color">Color <span class="text-red-400">*</span></label><br>
            <span class="mt-3">{{ localData[row].color }}</span>
          </div>
          <div class="col-6">
            <label for="color">Size <span class="text-red-400">*</span></label><br>
            {{ localData[row].size }}
          </div>
        </div>
      </div>
      <div class="field lg:col-2 col-12">
        <label for="color">Quantity <span class="text-red-400">*</span></label>
        <InputNumber v-model.trim="localData[row].quantity" required="true" autofocus />
      </div>
      <div class="field lg:col-3 col-12">
        <div class="feild grid">
          <div class="col-6">
            <label for="color">Price/pcs <span class="text-red-400">*</span></label>
            <InputNumber
              v-model.trim="localData[row].price_per_pc"
              class="mt-2"
              required="true"
              autofocus
            />
          </div>
        </div>
      </div>
    </div>
  </template>
  <script setup>
  import { ref, watch } from "vue";
  
  const imageUploaderSKU = ref(false);
  const props = defineProps({
    modelValue: {
      type: Object,
      default: () => ({
        1: {
          name: "",
          color: "",
          size: "",
          stock: "",
          price: "",
          price_subscribed: "",
          images: [],
        },
      }),
    },
  });
  
  const HandlecloseProductUploader = () => {
    imageUploaderSKU.value = false;
  };
  const emit = defineEmits(["update:modelValue"]);
  
  const UploaderVisible = ref({});
  const rows = ref(Object.keys(props.modelValue).map(Number));
  
  UploaderVisible.value = { [rows.value]: false };
  
  const localData = ref({ ...props.modelValue });
  
  const addRow = () => {
    const newRowNumber = rows.value.length ? Math.max(...rows.value) + 1 : 1;
    localData.value = {
      ...localData.value,
      [newRowNumber]: {
        name: "",
        color: "",
        size: "",
        stock: "",
        price: "",
        images: [],
      },
    };
    rows.value.push(newRowNumber);
    emit("update:modelValue", localData.value);
    UploaderVisible.value = { ...UploaderVisible.value, [newRowNumber]: false };
  };
  
  const removeRow = (index) => {
    const { [index]: _, ...tempData } = localData.value;
    localData.value = tempData;
    rows.value = rows.value.filter((row) => row !== index);
    const oldval = UploaderVisible.value;
    delete oldval[index];
    emit("update:modelValue", localData.value);
  };
  
  watch(
    localData,
    (newVal) => {
      emit("update:modelValue", newVal);
    },
    { deep: true }
  );
  
  const copyProduct = (data) => {
    const newRowNumber = rows.value.length ? Math.max(...rows.value) + 1 : 1;
    localData.value = {
      ...localData.value,
      [newRowNumber]: {
        name: data.name,
        color: data.color,
        size: data.size,
        stock: data.stock,
        price: data.price,
        price_subscribed: data.price_subscribed,
        images: [...data.images], // Copy images array
      },
    };
    rows.value.push(newRowNumber);
    emit("update:modelValue", localData.value);
    UploaderVisible.value = { ...UploaderVisible.value, [newRowNumber]: false };
  };
  </script>
  