import {
  cilSpeedometer,
  cilFolder,
  cilLayers,
  cilTags,
  cilBalanceScale,
  cilIndustry,
  cilPeople,
  cilTruck,
  cilArrowCircleBottom,
  cilArrowCircleTop,
  cilSwapHorizontal,
  cilChart,
  cilStorage,
  cilDescription,
  cilUser,
  cilLockLocked,
  cilHistory
} from '@coreui/icons';

export const sidebarConfig = [
  {
    type: "item",
    path: "/dashboard",
    label: "Dashboard",
    icon: cilSpeedometer,
    roles: ["User","Admin","Super Admin"]
  },

  {
    type: "title",
    label: "Master Data",
    roles: ["Admin", "Super Admin"]
  },
  {
    type: "group",
    label: "Product Management",
    icon: cilFolder,
    roles: ["Admin", "Super Admin"],
    children: [
      {
        type: "item",
        path: "/products-stock",
        label: "Product",
        icon: cilLayers,
        roles: ["Admin", "Super Admin"]
      },
      {
        type: "item",
        path: "/categories",
        label: "Category",
        icon: cilTags,
        roles: ["Admin", "Super Admin"]
      },
      {
        type: "item",
        path: "/units",
        label: "Unit",
        icon: cilBalanceScale,
        roles: ["Admin","Super Admin"]
      }
    ]
  },

  {
    type: "title",
    label: "Operational User",
    roles: ["User"]
  },
  {
    type: "item",
    label: "Product",
    path: "/products",
    icon: cilLayers,
    roles: ["User"]
  },
  {
    type: "item",
    label: "Request Outbound",
    path: "/request",
    icon: cilDescription,
    roles: ["User"]
  },

  {
    type: "group",
    label: "Company",
    icon: cilIndustry,
    roles: ["Admin", "Super Admin"],
    children: [
      {
        type: "item",
        path: "/suppliers",
        label: "Supplier",
        icon: cilTruck,
        roles: ["Admin","Super Admin"]
      },
      {
        type: "item",
        path: "/customers",
        label: "Customer",
        icon: cilPeople,
        roles: ["Admin","Super Admin"]
      }
    ]
  },

  {
    type: "title",
    label: "Transaction",
    roles: ["Admin", "Super Admin"]
  },
  {
    type: "item",
    path: "/in-movements",
    label: "Inbound",
    icon: cilArrowCircleBottom,
    roles: ["Admin","Super Admin"]
  },
  {
    type: "item",
    path: "/out-movements",
    label: "Outbound",
    icon: cilArrowCircleTop,
    roles: ["Admin", "Super Admin"]
  },
  {
    type: "item",
    path: "/req-movements",
    label: "Request",
    icon: cilSwapHorizontal,
    roles: ["Admin", "Super Admin"]
  },

  {
    type: "title",
    label: "Report",
    roles: ["User","Admin", "Super Admin"]
  },
  {
    type: "item",
    path: "/stocks",
    label: "Stock",
    icon: cilStorage,
    roles: ["User","Admin", "Super Admin"]
  },
  {
    type: "item",
    path: "/request-report",
    label: "Request Outbound",
    icon: cilDescription,
    roles: ["User"]
  },
  {
    type: "item",
    path: "/in-report",
    label: "Inbound",
    icon: cilChart,
    roles: ["Admin", "Super Admin"]
  },
  {
    type: "item",
    path: "/out-report",
    label: "Outbound",
    icon: cilChart,
    roles: ["Admin", "Super Admin"]
  },

  {
    type: "title",
    label: "User Management",
    roles: ["Super Admin"]
  },
  {
    type: "item",
    path: "/users",
    label: "User Data",
    icon: cilUser,
    roles: ["Super Admin"]
  },
  {
    type: "item",
    path: "/roles",
    label: "Access Rights/Roles",
    icon: cilLockLocked,
    roles: ["Super Admin"]
  },
  {
    type: "item",
    path: "/activities",
    label: "User Activity",
    icon: cilHistory,
    roles: ["Super Admin"]
  }
];