import React, { lazy } from "react";

const Dashboard = lazy(() => import("../pages/manager/Dashboard"));

const EmployeePage = lazy(
  () => import("../pages/manager/employee/EmployeePage")
);
const CreateEmployee = lazy(
  () => import("../pages/manager/employee/CreateEmployee")
);
const UpdateEmployee = lazy(
  () => import("../pages/manager/employee/UpdateEmployee")
);
const SupplierPage = lazy(
  () => import("../pages/manager/supplier/SupplierPage")
);
const CreateSupplier = lazy(
  () => import("../pages/manager/supplier/CreateSupplier")
);
const UpdateSupplier = lazy(
  () => import("../pages/manager/supplier/UpdateSupplier")
);
// const Sidebar = lazy(() => import("../layout/Sidebar"));
const CategoryPage = lazy(
  () => import("../pages/manager/product/CategoryPage")
);
const UpdateProduct = lazy(
  () => import("../pages/manager/product/UpdateProduct")
);
const CreatePromotion = lazy(
  () => import("../pages/manager/promotion/CreatePromotion")
);
const PromotionPage = lazy(
  () => import("../pages/manager/promotion/PromotionPage")
);
const UnitManagement = lazy(() => import("../pages/manager/product/UnitPage"));
const OrderList = lazy(() => import("../pages/manager/order/OrderList"));

const OrderDetail = lazy(() => import("../pages/manager/order/OrderDetail"));
const PrintOrder = lazy(() => import("../pages/manager/print/PrintOrder"));
// statistic
const StatisticsProduct = lazy(
  () => import("../pages/manager/report/SalesStatisticsProduct")
);
const StatisticsEmployee = lazy(
  () => import("../pages/manager/report/SalesStatisticsEmployee")
);

const StatisticsProductPrice = lazy(
  () => import("../pages/manager/report/StatisticsProductPrice")
);

// inventory
const Logout = lazy(() => import("../pages/login/Logout"));
const CreateProduct = lazy(
  () => import("../pages/manager/product/CreateProduct")
);
const OrderTabs = lazy(() => import("../pages/manager/order/OrderTabs"));
// const OrderPage = lazy(() => import("../pages/order/OrderPage1"));
const CreateInventoryOrder = lazy(
  () => import("../pages/manager/inventory/CreateInvenoryOrder")
);

const InventoryPage = lazy(
  () => import("../pages/manager/inventory/InventoryPage")
);

const InventoryDetailPage = lazy(
  () => import("../pages/manager/inventory/InventoryDetailPage")
);
// const OrderPage1 = lazy(() => import("../pages/order/OrderPage1"));
// const OrderPage2 = lazy(() => import("../pages/order/OrderPage2"));

const DashboardEmployee = lazy(() => import("../pages/staff/home/Dashboard"));

const CustomerPage = lazy(
  () => import("../pages/manager/customer/CustomerPage")
);

// const PrintImportInvoice = lazy(
//   () => import("../pages/manager/print/PrintImportInvoice")
// );

const OrderEmployeePage = lazy(
  () => import("../pages/staff/order/OrderEmployeePage")
);
const ShipmentPage = lazy(
  () => import("../pages/manager/inventory/ShipmentPage")
);

const ProductPage = lazy(() => import("../pages/manager/product/ProductPage"));

const ProductReport = lazy(
  () => import("../pages/manager/report/ProductReport")
);

const ProfitReport = lazy(() => import("../pages/manager/report/ProfitReport"));

interface RouteConfig {
  path: string;
  component: React.LazyExoticComponent<React.FC>;
}
const employeeRoutes: RouteConfig[] = [
  { path: "/", component: DashboardEmployee },
  { path: "/staff/orders/create-order", component: OrderTabs },
  { path: "/staff/orders", component: OrderEmployeePage },
  { path: "/staff/orders/:orderId", component: OrderDetail },
  { path: "/staff/print/order-invoice", component: PrintOrder },
  { path: "/staff/inventory", component: ShipmentPage },
  { path: "/staff/products", component: ProductPage },
  { path: "/logout", component: Logout },
];

const managerRoutes: RouteConfig[] = [
  { path: "/dashboard", component: Dashboard },
  // order
  { path: "/orders", component: OrderList },
  { path: "/orders/create-order", component: OrderTabs },
  { path: "/orders/:orderId", component: OrderDetail },
  { path: "/print/order-invoice", component: PrintOrder },
  // inventory
  { path: "/inventory/import-invoices", component: InventoryPage },
  { path: "/inventory/:id", component: InventoryDetailPage },
  { path: "/inventory", component: ShipmentPage },
  { path: "/inventory/create-inventory", component: CreateInventoryOrder },
  // { path: "/print/import-invoice", component: PrintImportInvoice },
  // product
  { path: "/products", component: ProductPage },
  { path: "/create-product", component: CreateProduct },
  { path: "/update-product/:id", component: UpdateProduct },
  { path: "/products/categories", component: CategoryPage },
  { path: "/products/units", component: UnitManagement },
  // supplier
  { path: "/suppliers", component: SupplierPage },
  { path: "/create-supplier", component: CreateSupplier },
  { path: "/update-supplier/:id", component: UpdateSupplier },
  // employee
  { path: "/employees", component: EmployeePage },
  { path: "/create-employee", component: CreateEmployee },
  { path: "/update-employee/:id", component: UpdateEmployee },
  // customer
  { path: "/customers", component: CustomerPage },
  // report
  { path: "/report/product", component: StatisticsProduct },
  { path: "/report/employee", component: StatisticsEmployee },
  {
    path: "/report/product-price/:productId",
    component: StatisticsProductPrice,
  },
  // promotions
  { path: "/promotions", component: PromotionPage },
  { path: "/promotions/create-promotion", component: CreatePromotion },
  { path: "/logout", component: Logout },
  // report
  { path: "/reports/product", component: ProductReport },
  { path: "/reports/profit", component: ProfitReport },
];

export { employeeRoutes, managerRoutes };
