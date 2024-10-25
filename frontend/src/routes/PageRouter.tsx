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
const Dashboard = lazy(() => import("../pages/admin/Dashboard"));
const ProtectedRoute = lazy(() => import("./ProtectRoute"));
const EmployeePage = lazy(() => import("../pages/employee/EmployeePage"));
const NotFoundPage = lazy(() => import("../pages/error/NotFoundPage"));
const Loading = lazy(() => import("../components/Loading"));
const CreateEmployee = lazy(() => import("../pages/employee/CreateEmployee"));
const UpdateEmployee = lazy(() => import("../pages/employee/UpdateEmployee"));
const SupplierPage = lazy(() => import("../pages/supplier/SupplierPage"));
const CreateSupplier = lazy(() => import("../pages/supplier/CreateSupplier"));
const UpdateSupplier = lazy(() => import("../pages/supplier/UpdateSupplier"));
const Sidebar = lazy(() => import("../layout/Sidebar"));
const CategoryPage = lazy(() => import("../pages/product/CategoryPage"));
const ProductPage = lazy(() => import("../pages/product/ProductPage"));
const UpdateProduct = lazy(() => import("../pages/product/UpdateProduct"));

// statistic
const StatisticsProduct = lazy(
  () => import("../pages/report/SalesStatisticsProduct")
);
const StatisticsEmployee = lazy(
  () => import("../pages/report/SalesStatisticsEmployee")
);

const StatisticsProductPrice = lazy(
  () => import("../pages/report/StatisticsProductPrice")
);

// inventory
const StockPage = lazy(() => import("../pages/inventory/StockPage"));
const Logout = lazy(() => import("../pages/login/Logout"));
const CreateProduct = lazy(() => import("../pages/product/CreateProduct"));
const OrderTabs = lazy(() => import("../pages/order/OrderTabs"));
const OrderPage = lazy(() => import("../pages/order/OrderPage"));
const CreateInventoryOrder = lazy(
  () => import("../pages/inventory/CreateInvenoryOrder")
);
const InventoryPage = lazy(() => import("../pages/inventory/InventoryPage"));

const InventoryDetailPage = lazy(
  () => import("../pages/inventory/InventoryDetailPage")
);

const PrintImportInvoice = lazy(
  () => import("../pages/print/PrintImportInvoice")
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
            <Route path="/" element={<EmployeeMain />} />
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

              <Route path="/categories" element={<CategoryPage />} />

              <Route path="/update-employee/:id" element={<UpdateEmployee />} />
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
              <Route path="/inventory/stock" element={<StockPage />} />
              <Route
                path="/inventory/import-invoices"
                element={<InventoryPage />}
              />
              <Route path="/inventory/:id" element={<InventoryDetailPage />} />
              <Route path="/logout" element={<Logout />} />
              <Route path="/orders" element={<OrderTabs />} />
              <Route path="/order" element={<OrderPage />} />

              <Route
                path="/inventory/create-inventory"
                element={<CreateInventoryOrder />}
              />
              <Route
                path="/print/import-invoice"
                element={<PrintImportInvoice />}
              />
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
