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
const LoginEmployee = lazy(() => import("../pages/login/LoginEmployeePage")); // optimized import
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
const Logout = lazy(() => import("../pages/login/Logout"));
const CreateProduct = lazy(() => import("../pages/product/CreateProduct"));
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
  const userRole = auth.role || "MANAGER";

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
              <Route path="/create-employee" element={<CreateEmployee />}>
                {" "}
              </Route>
              <Route path="/suppliers" element={<SupplierPage />} />
              <Route path="/create-supplier" element={<CreateSupplier />} />
              <Route path="/update-product/:id" element={<UpdateProduct />} />
              <Route path="/update-supplier/:id" element={<UpdateSupplier />} />

              <Route path="/create-product" element={<CreateProduct />} />

              <Route path="/products" element={<ProductPage />} />
              <Route path="/categories" element={<CategoryPage />} />

  < Route path = "/update-employee/:id" element = {< UpdateEmployee />} />
                
    <Route path="/logout" element={<Logout />}  />
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
