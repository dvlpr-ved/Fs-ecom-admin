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
        icon: "pi pi-comments",
        to: "/Masters/allchats",
      },
      {
        label: "Manage Reports",
        icon: "pi pi-flag",
        expanded : true,
        items: [
          {
            label: "Orders Report",
            icon: "pi pi-chart-line",
            to: "/reports/ordersreport",
          },
          {
            label: "Product wise stock report",
            icon: "pi pi-chart-line",
            to: "/reports/stockreport",
          },
          {
            label: "SKU wise stock report",
            icon: "pi pi-chart-line",
            to: "/reports/skustockreport",
          },
          {
            label: "Seller wise stock report",
            icon: "pi pi-chart-line",
            to: "/reports/sellersalereport",
          },
          {
            label: "Subscriptions Expiry Report",
            icon: "pi pi-chart-line",
            to: "/reports/subscriptionPlanReport",
          },          
        ],
      },
      {
        label: "Manage Permissions",
        icon: "pi pi-file-export",
        to: "/permissions",
      },
      {
        label: "Seller Requests",
        icon: "pi pi-file-export",
        to: "/SellerRequests",
      }      
    ],
  },
]);

const toggleReports = (item) => {
  item.expanded = !item.expanded;
};
</script>

<template>
  <ul class="layout-menu">
    <template v-for="(item, i) in model" :key="item.label">
      <div>
        <app-menu-item
          v-if="!item.separator"
          :item="item"
          :index="i"
          @click="item.items && toggleReports(item)"
        >
        </app-menu-item>
        <ul v-else-if="item.items && item.expanded">
          <li v-for="(subItem, j) in item.items" :key="subItem.label">
            <app-menu-item :item="subItem" :index="j"></app-menu-item>
          </li>
        </ul>
      </div>
    </template>
  </ul>
</template>

<style lang="scss" scoped>
.layout-menu {
  list-style-type: none;
  padding: 0;
}

.layout-menu > li {
  margin: 0.5em 0;
}

ul {
  padding-left: 20px;
}
</style>
