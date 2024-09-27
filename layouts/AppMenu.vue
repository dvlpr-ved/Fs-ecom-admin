<script setup>
import { ref } from "vue";
import AppMenuItem from "./AppMenuItem.vue";
const model = ref([
  {
    label: "Home",
    items: [{ label: "Dashboard", icon: "pi pi-fw pi-home", to: "/" }],
  },
  {
    label: "Masters",
    items: [
      {
        label: "Users",
        icon: "pi pi-fw pi-desktop",
        to: "/Masters/users",
      },
      {
        label: "Role",
        icon: "pi pi-fw pi-desktop",
        to: "/Masters/Role",
      },
      {
        label: "Categories",
        icon: "pi pi-fw pi-desktop",
        to: "/Masters/Categories",
      },
      {
        label: "Products",
        icon: "pi pi-fw pi-desktop",
        to: "/Masters/Products",
      },
      {
        label: "Home Listing & Banners",
        icon: "pi pi-fw pi-desktop",
        to: "/Masters/HomeListing",
      },
      {
        label: "Vendor",
        icon: "pi pi-fw pi-user",
        to: "/Masters/Vendor",
      },
      {
        label: "Product tags",
        icon: "pi pi-fw pi-user",
        to: "/Masters/Tags",
      },
      {
        label: "Subscription Plans",
        icon: "pi pi-fw pi-tags",
        to: "/Masters/Subscription",
      },
      {
        label: "Manage Meta Data",
        icon: "pi pi-fw pi-book",
        to: "/Masters/metadata",
      },
      {
        label: "Contact page Query",
        icon: "pi pi-phone",
        to: "/Masters/conatactuspage",
      },
      {
        label: "Manage Chats",
        icon: "pi pi-phone",
        to: "/Masters/allchats",
      },
      {
        label: "Manage Permissions",
        icon: "pi pi-phone",
        to: "/permissions",
      },
    ],
  },
]);
</script>

<template>
  <ul class="layout-menu">
    <template v-for="(item, i) in model" :key="item">
      <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
      <li v-if="item.separator" class="menu-separator"></li>
    </template>
  </ul>
</template>

<style lang="scss" scoped></style>
