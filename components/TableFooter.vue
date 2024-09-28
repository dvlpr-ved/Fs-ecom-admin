<template>
<div class="p-paginator p-component">
    <div class="p-paginator-content">
        <span class="p-paginator-pages">
            <button @click="makeActive(page)" v-for="page in props.totalPages" class="p-paginator-page" :class="props.modelvalue == page ? 'p-paginator-page-selected text-white' : ''" type="button">{{ page }}</button>            
        </span>
    </div>
</div>
</template>
<script setup>
const props = defineProps({
    modelvalue : {
        default : () => 1
    },
    totalPages: {
        default : 1,
    }
});
const emits = defineEmits(['update:modelValue']);

const makeActive = (page) => {
  emits('update:modelValue', page);
}
</script>
<style scoped>
.p-paginator-page-selected{
    background-color: #22c55e;
}
</style>