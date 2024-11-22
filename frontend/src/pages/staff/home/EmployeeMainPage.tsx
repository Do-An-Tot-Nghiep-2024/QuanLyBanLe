import { useMemo, useState } from "react";
import { createTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import {
  Dashboard as DashboardIcon,
  ShoppingCart as ShoppingCartIcon,
  BarChart as BarChartIcon,
  DateRange as DateRangeIcon,
  Store as StoreIcon,
  RecentActors as RecentActorsIcon,
  ShoppingBag as ShoppingBagIcon,
  Inventory as InventoryIcon,
  Settings as SettingsIcon,
  Receipt as  ReceiptIcon,
  Logout,
} from "@mui/icons-material";
import { AppProvider, DashboardLayout} from "@toolpad/core";
import type { Router, Navigation, Session } from "@toolpad/core";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import Cookies from "js-cookie";
import { Outlet, useNavigate } from "react-router-dom";
// import ReceiptIcon from "@mui/icons-material/Receipt";
import logo from "../../../assets/images/logo.png";
import colors from "../../../constants/color";
import { useAppDispatch, useAppSelector } from "../../../redux/hook";
import { logout } from "../../../redux/auth/authSlice";
const NAVIGATION: Navigation = [
  {
    segment: "",
    title: "Dashboard",
    icon: <DashboardIcon />,
  },
  {
    
    segment: "staff/orders",
    title: "Đơn hàng",
    icon: <ShoppingCartIcon />,
    children: [
      {
        segment: "create-order",
        title: "Tạo đơn hàng mới",
        icon: <WarehouseIcon />,
      },
      {
        segment: "",
        title: "Quản lí đơn hàng",
        icon: <ReceiptIcon />,
      },
    ],
  },
  {
    segment: "inventory",
    title: "Kho hàng",
    icon: <InventoryIcon />,
    children: [
      {
        segment: "shipment",
        title: "Quản lí lô hàng",
        icon: <WarehouseIcon />,
      },
    ],
  },
  {
    segment: "staff/products",
    title: "Sản phẩm",
    icon: <StoreIcon />,
  },
  {
    segment: "reports",
    title: "Báo cáo",
    icon: <BarChartIcon />,
    children: [
      {
        segment: "product",
        title: "Theo sản phẩm",
        icon: <ShoppingBagIcon />,
      },
      {
        segment: "employee",
        title: "Theo nhân viên",
        icon: <RecentActorsIcon />,
      },
      {
        segment: "date",
        title: "Theo thời gian",
        icon: <DateRangeIcon />,
      },
    ],
  },
  {
    segment: "settings",
    title: "Cài đặt",
    icon: <SettingsIcon />,
  },
  {
    segment: "logout",
    title: "Đăng xuất",
    icon: <Logout />,
  },
];

const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: "data-toolpad-color-scheme",
  },
  colorSchemes: {
    light: {
      palette: {
        background: {
          default: "#fff",
          paper: "#fff",
        },
      },
    },
    dark: {
      palette: {
        background: {
          default: colors.dark,
          paper: colors.dark,
        },
      },
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
  components: {
    MuiTableCell: {
      styleOverrides: {
        root: {
          fontSize: "16px",
        },
      },
    },
  },
});
const Logo = () => (
  <img src={logo} alt="logo" style={{ width: "100%", borderRadius: "50%" }} />
);

export default function Sidebar() {
  const auth = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>({
    user: {
      name: auth.usename,
      image: "https://avatar.iran.liara.run/public/job/designer/male",
    },
  });
  const clearToken = () => {
    setSession(null);
    Cookies.remove("accessToken");
    navigate("/login");
    dispatch(logout());
  };

  const authentication = useMemo(() => {
    return {
      signIn: () => {
        setSession({
          user: {
            name: "",
            image: "https://ui-avatars.com/api/?name=Admin",
          },
        });
      },
      signOut: () => {
        clearToken();
      },
    };
  }, []);
  const [pathname, setPathname] = useState("/dashboard");

  const router = useMemo<Router>(() => {
    return {
      pathname,
      searchParams: new URLSearchParams(),
      navigate: (path) => {
        if (path === "/logout") {
          clearToken();
        } else {
          console.log(path);
            setPathname(String(path));
            navigate(path);
          
        }
      },
    };
  }, [pathname]);

  return (
    // preview-start
    <AppProvider
      session={session}
      authentication={authentication}
      navigation={NAVIGATION}
      router={router}
      theme={demoTheme}
      branding={{
        logo: <Logo />,
        title: "",
      }}
    >
      <DashboardLayout
      >
        <Box
          component={"main"}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            height: "100vh",
            pt:3
          }}
        >
          <Outlet />
        </Box>
      </DashboardLayout>
    </AppProvider>
    // preview-end
  );
}
