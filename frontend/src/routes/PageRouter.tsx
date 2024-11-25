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
import { employeeRoutes, managerRoutes } from "./route";
const LoginEmployee = lazy(() => import("../pages/login/LoginEmployeePage"));
const LoginManager = lazy(() => import("../pages/login/LoginManagerPage"));
const EmployeeMain = lazy(() => import("../pages/staff/home/EmployeeMainPage"));
const ProtectedRoute = lazy(() => import("./ProtectRoute"));
const NotFoundPage = lazy(() => import("../pages/error/NotFoundPage"));
const Loading = lazy(() => import("../components/Loading"));

const Sidebar = lazy(() => import("../layout/Sidebar"));

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

  type RedirectElementProps = {
    isLoggedIn: boolean;
    userRole: string;
    employeePath: string;
    managerPath: string;
    fallback: JSX.Element;
  };

  const getRedirectElement = ({
    isLoggedIn,
    userRole,
    employeePath,
    managerPath,
    fallback,
  }: RedirectElementProps): JSX.Element => {
    if (isLoggedIn) {
      return userRole === "EMPLOYEE" ? (
        <Navigate to={employeePath} />
      ) : (
        <Navigate to={managerPath} />
      );
    }
    return fallback;
  };

  interface RouteConfig {
    path: string;
    component: React.LazyExoticComponent<React.FC>;
  }
  const renderRoutes = (routes: RouteConfig[]) =>
    routes.map(({ path, component: Component }) => (
      <Route key={path} path={path} element={<Component />} />
    ));

  return (
    <Router>
      <Suspense fallback={<Loading />}>
        <Routes>
          {/* routes for manager */}
          <Route
            path="/login"
            element={getRedirectElement({
              isLoggedIn,
              userRole,
              employeePath: "/",
              managerPath: "/dashboard",
              fallback: <LoginEmployee />,
            })}
          />
          <Route
            path="/admin"
            element={getRedirectElement({
              isLoggedIn,
              userRole,
              employeePath: "/",
              managerPath: "/dashboard",
              fallback: <LoginManager />,
            })}
          />
          {/* Route for EMPLOYEE AND MANAGER */}
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
              {/* <Route path="/" element={<DashboardEmployee />} /> */}
              {/* <Route path="/staff/orders" element={<OrderEmployeePage />} /> */}
              {/* <Route path="/" element={<DashboardEmployee />} />
              <Route
                path="/staff/orders/create-order"
                element={<OrderTabs />}
              />
              <Route path="/products" element={<ProductPage />} />
              <Route path="/inventory/shipment" element={<ShipmentPage />} />
              <Route path="/staff/orders/:orderId" element={<OrderDetail />} /> */}
              {renderRoutes(employeeRoutes)}
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
            <Route element={<Sidebar />}>
              {/* <Route path="/dashboard" element={<Dashboard />} />
              
              <Route path="/suppliers" element={<SupplierPage />} />
              <Route path="/create-supplier" element={<CreateSupplier />} />
              <Route path="/update-supplier/:id" element={<UpdateSupplier />} />


              <Route path="/products" element={<ProductPage />} />
              <Route path="/create-product" element={<CreateProduct />} />
              <Route path="/update-product/:id" element={<UpdateProduct />} />
              <Route path="/products/categories" element={<CategoryPage />} />
              <Route path="/products/units" element={<UnitManagement />} />

              <Route path="/employees" element={<EmployeePage />} />
              <Route path="/create-employee" element={<CreateEmployee />} />
              <Route path="/update-employee/:id" element={<UpdateEmployee />} />


              <Route path="/customers" element={<CustomerPage />} /> */}

              {/* Static pages */}
              {/* <Route path="/reports/product" element={<StatisticsProduct />} />
              <Route
                path="/reports/employee"
                element={<StatisticsEmployee />}
              />
              <Route
                path="/reports/product-price/:productId"
                element={<StatisticsProductPrice />}
              /> */}
              {/* inventory */}
              {/* <Route path="/orders/create-order" element={<OrderPage1 />} />
              <Route path="/order2" element={<OrderPage2 />} /> */}

              {/* <Route path="/orders/create-order" element={<OrderTabs />} />
              <Route path="/orders" element={<OrderList />} />
              <Route path="/orders/:orderId" element={<OrderDetail />} /> */}

              {/* inventory */}
              {/* <Route
                path="/inventory/import-invoices"
                element={<InventoryPage />}
              />
              <Route path="/inventory/:id" element={<InventoryDetailPage />} />
              <Route path="/inventory/shipment" element={<ShipmentPage />} />
              <Route
                path="/print/import-invoice"
                element={<PrintImportInvoice />}
              />

              <Route
                path="/inventory/create-inventory"
                element={<CreateInventoryOrder />}
              />
              <Route path="/print/order-invoice" element={<PrintOrder />} /> */}
              {/*promotion  */}
              {/* <Route
                path="/promotions/create-promotion"
                element={<CreatePromotion />}
              />
              <Route path="/promotions" element={<PromotionPage />} />

              <Route path="/logout" element={<Logout />} /> */}
              {renderRoutes(managerRoutes)}
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
