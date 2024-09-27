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

  console.log("role sss", userRole);
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
              <Route
                path="/create-employee"
                element={<CreateEmployee />}
              ></Route>
              <Route path="/update-employee/:id" element={<UpdateEmployee />} />
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
