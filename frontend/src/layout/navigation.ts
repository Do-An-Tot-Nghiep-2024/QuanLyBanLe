
// import type { Router, Navigation, Session } from "@toolpad/core";
// import {
//     Dashboard as DashboardIcon,
//     ShoppingCart as ShoppingCartIcon,
//     BarChart as BarChartIcon,
//     BadgeOutlined as BadgeOutlinedIcon,
//     PeopleAltOutlined as PeopleAltOutlinedIcon,
//     DateRange as DateRangeIcon,
//     Store as StoreIcon,
//     RecentActors as RecentActorsIcon,
//     ShoppingBag as ShoppingBagIcon,
//     Inventory as InventoryIcon,
//     Settings as SettingsIcon,
//     NoteAddOutlined,
//     Logout,
//   } from "@mui/icons-material";

// const NAVIGATION: Navigation = [
//     {
//       segment: "dashboard",
//       title: "Dashboard",
//       icon: <DashboardIcon />,
//     },
//     {
//       segment: "orders",
//       title: "Đơn hàng",
//       icon: <ShoppingCartIcon />,
//       children: [
//         {
//           segment: "create-order",
//           title: "Tạo đơn hàng mới",
//           icon: <WarehouseIcon />,
//         },
//         {
//           segment: "",
//           title: "Quản lí đơn hàng",
//           icon: <ReceiptIcon />,
//         },
//       ],
//     },
//     {
//       segment: "inventory",
//       title: "Kho hàng",
//       icon: <InventoryIcon />,
//       children: [
//         {
//           segment: "import-invoices",
//           title: "Quản lí đơn nhập hàng",
//           icon: <ReceiptIcon />,
//         },
//         {
//           segment: "shipment",
//           title: "Quản lí lô hàng",
//           icon: <WarehouseIcon />,
//         },
//       ],
//     },
//     {
//       segment: "products",
//       title: "Sản phẩm",
//       icon: <StoreIcon />,
//       children: [
//         {
//           segment: "",
//           title: "Quản lí sản phẩm",
//           icon: <WarehouseIcon />,
//         },
//         {
//           segment: "categories",
//           title: "Quản lí danh mục",
//           icon: <AddBusinessIcon />,
//         },
//         {
//           segment: "units",
//           title: "Quản lí đơn vị tính",
//           icon: <ViewColumnIcon />,
//         },
//       ],
//     },
  
//     {
//       segment: "suppliers",
//       title: "Nhà cung cấp",
//       icon: <NoteAddOutlined />,
//     },
//     {
//       segment: "employees",
//       title: "Nhân viên",
//       icon: <BadgeOutlinedIcon />,
//     },
//     {
//       segment: "customers",
//       title: "Khách hàng",
//       icon: <PeopleAltOutlinedIcon />,
//     },
//     {
//       segment: "promotions",
//       title: "Chương trình khuyến mãi",
//       icon: <NoteAddOutlined />,
//       children: [
//         {
//           segment: "",
//           title: "Quản lí chương trình khuyến mãi",
//           icon: <WarehouseIcon />,
//         },
//         {
//           segment: "create-promotion",
//           title: "Tạo chương trình khuyến mãi",
//           icon: <AddBusinessIcon />,
//         },
//       ],
//     },
//     {
//       segment: "reports",
//       title: "Báo cáo",
//       icon: <BarChartIcon />,
//       children: [
//         {
//           segment: "product",
//           title: "Theo sản phẩm",
//           icon: <ShoppingBagIcon />,
//         },
//         {
//           segment: "employee",
//           title: "Theo nhân viên",
//           icon: <RecentActorsIcon />,
//         },
//         {
//           segment: "date",
//           title: "Theo thời gian",
//           icon: <DateRangeIcon />,
//         },
//       ],
//     },
//     {
//       segment: "settings",
//       title: "Cài đặt",
//       icon: <SettingsIcon />,
//     },
//     {
//       segment: "logout",
//       title: "Đăng xuất",
//       icon: <Logout />,
//     },
//   ];
  