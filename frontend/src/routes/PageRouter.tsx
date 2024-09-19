import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import NotFoundPage from "../pages/error/NotFoundPage";
import { useAppDispatch} from "../redux/hook";
import { getAccount } from "../redux/auth/authSlice";
import { useEffect, Suspense, lazy } from "react";
import Cookies from "js-cookie";
import Layout from "../layout/Layout";
import Loading from "../components/Loading";
// import ProtectedRoute from "./ProtectRoute";
const LoginEmployee = lazy(() => import("../pages/login/LoginEmployeePage"));
const LoginManager = lazy(() => import("../pages/login/LoginManagerPage"));
const EmployeeMain = lazy(() => import("../pages/employee/EmployeeMainPage"));
const Dashboard = lazy(() => import("../pages/admin/Dashboard"));
const ProtectedRoute = lazy(() => import("./ProtectRoute"));

const PageRouter = () => {
  // const auth = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const token = Cookies.get("accessToken");
  useEffect(() => {
    if (token) {
      dispatch(getAccount());
    }
  }, [token, dispatch]);
  const isLoggedIn = true;
  const userRole: string = "MANAGER";
  return (
    <Router>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route element={<Layout />}>
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
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>
            <Route path="*" element={<NotFoundPage />} />
            {/* <Route path="/unauthorized" element={<UnauthorizedPage />} /> */}
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
};

export default PageRouter;
