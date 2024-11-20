import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/hook";
import { getAccount } from "../redux/auth/authSlice";
import { useEffect, Suspense, lazy } from "react";
import Cookies from "js-cookie";
// import OrderPage from "../pages/order/OrderPage";
const LoginEmployee = lazy(() => import("../pages/login/LoginEmployeePage"));
const LoginManager = lazy(() => import("../pages/login/LoginManagerPage"));
const EmployeeMain = lazy(() => import("../pages/staff/home/EmployeeMainPage"));
const Dashboard = lazy(() => import("../pages/manager/Dashboard"));
const ProtectedRoute = lazy(() => import("./ProtectRoute"));
const EmployeePage = lazy(() => import("../pages/manager/employee/EmployeePage"));
const NotFoundPage = lazy(() => import("../pages/error/NotFoundPage"));
const Loading = lazy(() => import("../components/Loading"));
const CreateEmployee = lazy(() => import("../pages/manager/employee/CreateEmployee"));
const UpdateEmployee = lazy(() => import("../pages/manager/employee/UpdateEmployee"));
const SupplierPage = lazy(
  () => import("../pages/manager/supplier/SupplierPage")
);
const CreateSupplier = lazy(
  () => import("../pages/manager/supplier/CreateSupplier")
);
const UpdateSupplier = lazy(
  () => import("../pages/manager/supplier/UpdateSupplier")
);
const Sidebar = lazy(() => import("../layout/Sidebar"));
const CategoryPage = lazy(() => import("../pages/manager/product/CategoryPage"));
const ProductPage = lazy(() => import("../pages/manager/product/ProductPage"));
const UpdateProduct = lazy(() => import("../pages/manager/product/UpdateProduct"));
const CreatePromotion = lazy(
  () => import("../pages/manager/promotion/CreatePromotion")
);
const PromotionPage = lazy(
  () => import("../pages/manager/promotion/PromotionPage")
);
const UnitManagement = lazy(() => import("../pages/manager/product/UnitPage"));
const OrderList = lazy(() => import("../pages/manager/order/OrderList"));

const ShipmentPage = lazy(
  () => import("../pages/manager/inventory/ShipmentPage")
);
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
const CreateProduct = lazy(() => import("../pages/manager/product/CreateProduct"));
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

const CustomerPage = lazy(() => import("../pages/manager/customer/CustomerPage"));

const PrintImportInvoice = lazy(
  () => import("../pages/manager/print/PrintImportInvoice")
);

const PageRouter = () => {
  const auth = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const token = Cookies.get("accessToken");
  // const userRoleRef = useRef(auth.role);
  useEffect(() => {
    if (token) {
      dispatch(getAccount());
    }
  }, [token, dispatch]);
  const isLoggedIn = auth.isLogin;
  const userRole = auth.role;

  return (
    <Router>
      <Suspense fallback={<Loading />}>
        <Routes>
          {/* routes for manager */}
          <Route
            path="/login"
            element={
              isLoggedIn && userRole === "EMPLOYEE" ? (
                <Navigate to={"/"} />
              ) : isLoggedIn && userRole === "MANAGER" ? (
                <Navigate to={"/dashboard"} />
              ) : (
                <LoginEmployee />
              )
            }
          />
          {/* login page for manager */}
          <Route
            path="/admin"
            element={
              isLoggedIn && userRole === "MANAGER" ? (
                <Navigate to={"/dashboard"} />
              ) : isLoggedIn && userRole === "EMPLOYEE" ? (
                <Navigate to={"/"} />
              ) : (
                <LoginManager />
              )
            }
          />
          {/* routes for employee */}
          <Route
            element={
              <ProtectedRoute
                isLoggedIn={isLoggedIn}
                allowedRoles={["EMPLOYEE", "MANAGER"]}
                userRole={userRole}
                redirectPath="/login"
              />
            }
          >
            <Route element={<EmployeeMain />}>
              <Route path="/" element={<DashboardEmployee />} />
              <Route
                path="/staff/orders/create-order"
                element={<OrderTabs />}
              />
              <Route path="/staff/products" element={<ProductPage />} />
              <Route
                path="/staff/inventory/shipment"
                element={<ShipmentPage />}
              />
            </Route>
          </Route>
          {/* route for manager */}
          <Route
            element={
              <ProtectedRoute
                isLoggedIn={isLoggedIn}
                allowedRoles={["MANAGER"]}
                userRole={userRole}
                redirectPath="/login"
              />
            }
          >
            {/* viết giao diện các chức năng của quản lý dưới sidebar */}
            <Route element={<Sidebar />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/employees" element={<EmployeePage />} />
              <Route path="/create-employee" element={<CreateEmployee />} />
              <Route path="/suppliers" element={<SupplierPage />} />
              <Route path="/create-supplier" element={<CreateSupplier />} />
              <Route path="/update-product/:id" element={<UpdateProduct />} />
              <Route path="/update-supplier/:id" element={<UpdateSupplier />} />

              <Route path="/create-product" element={<CreateProduct />} />

              <Route path="/products" element={<ProductPage />} />

              <Route path="/products/categories" element={<CategoryPage />} />
              <Route path="/products/units" element={<UnitManagement />} />
              <Route path="/update-employee/:id" element={<UpdateEmployee />} />

              <Route path="/customers" element={<CustomerPage />} />

              {/* Static pages */}
              <Route path="/reports/product" element={<StatisticsProduct />} />
              <Route
                path="/reports/employee"
                element={<StatisticsEmployee />}
              />
              <Route
                path="/reports/product-price/:productId"
                element={<StatisticsProductPrice />}
              />
              {/* inventory */}
              <Route
                path="/inventory/import-invoices"
                element={<InventoryPage />}
              />
              <Route path="/inventory/:id" element={<InventoryDetailPage />} />
              <Route path="/logout" element={<Logout />} />
              <Route path="/orders/create-order" element={<OrderTabs />} />
              {/* <Route path="/orders/create-order" element={<OrderPage1 />} />
              <Route path="/order2" element={<OrderPage2 />} /> */}
              <Route path="/orders" element={<OrderList />} />
              <Route path="/orders/:orderId" element={<OrderDetail />} />

              <Route
                path="/inventory/create-inventory"
                element={<CreateInventoryOrder />}
              />
              <Route
                path="/print/import-invoice"
                element={<PrintImportInvoice />}
              />

              <Route path="/print/order-invoice" element={<PrintOrder />} />
              <Route path="/inventory/shipment" element={<ShipmentPage />} />
              <Route
                path="/promotions/create-promotion"
                element={<CreatePromotion />}
              />
              <Route path="/promotions" element={<PromotionPage />} />
            </Route>
          </Route>
          {/* Not found page */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default PageRouter;
