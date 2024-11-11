import { useMemo, useState } from "react";
import { createTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import {
  Dashboard as DashboardIcon,
  ShoppingCart as ShoppingCartIcon,
  BarChart as BarChartIcon,
  BadgeOutlined as BadgeOutlinedIcon,
  PeopleAltOutlined as PeopleAltOutlinedIcon,
  DateRange as DateRangeIcon,
  Store as StoreIcon,
  RecentActors as RecentActorsIcon,
  ShoppingBag as ShoppingBagIcon,
  Inventory as InventoryIcon,
  Settings as SettingsIcon,
  NoteAddOutlined,
  Logout,
} from "@mui/icons-material";
import { AppProvider, DashboardLayout } from "@toolpad/core";
import type { Router, Navigation, Session } from "@toolpad/core";
import AddAlertIcon from "@mui/icons-material/AddAlert";
import WarehouseIcon from '@mui/icons-material/Warehouse';

import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import Cookies from "js-cookie";
import { logout } from "../redux/auth/authSlice";
import { useAppDispatch } from "../redux/hook";
import { Outlet, useNavigate } from "react-router-dom";
import colors from "../constants/color";
import ReceiptIcon from "@mui/icons-material/Receipt";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
const NAVIGATION: Navigation = [
  {
    segment: "dashboard",
    title: "Dashboard",
    icon: <DashboardIcon />,
  },
  {
    segment: "orders",
    title: "Đơn hàng",
    icon: <ShoppingCartIcon />,
  },
  {
    segment: "inventory",
    title: "Kho hàng",
    icon: <InventoryIcon />,
    children: [
      {
        segment: "create-inventory",
        title: "Tạo hóa đơn nhập hàng",
        icon: <AddBusinessIcon />,
      },
      {
        segment: "import-invoices",
        title: "Hóa đơn nhập hàng",
        icon: <ReceiptIcon />,
      },
      {
        segment: "shipment",
        title: "Quản lý lô hàng",
        icon: <WarehouseIcon />,
      }
    ],
  },
  {
    segment: "products",
    title: "Sản phẩm",
    icon: <StoreIcon />,
    children: [
      {
        segment: "",
        title: "Danh sách sản phẩm",
        icon: <WarehouseIcon />,
      },
      {
        segment: "categories",
        title: "Quản lí danh mục",
        icon: <AddBusinessIcon />,
      },
    ],
  },
  {
    segment: "units",
    title: "Đơn vị tính",
    icon: <ViewColumnIcon />,
  },
  {
    segment: "suppliers",
    title: "Nhà cung cấp",
    icon: <NoteAddOutlined />,
  },
  {
    segment: "employees",
    title: "Nhân viên",
    icon: <BadgeOutlinedIcon />,
  },
  {
    segment: "notifications",
    title: "Thông báo",
    icon: <AddAlertIcon />,
  },
  {
    segment: "customers",
    title: "Khách hàng",
    icon: <PeopleAltOutlinedIcon />,
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
      }
    }
  },
});
const Logo = () => (
  <img
    src="https://res.cloudinary.com/dujylxkra/image/upload/c_thumb,w_200,g_face/v1729824625/logo-product_imja18.png"
    alt="logo"
    style={{ width: "100%", borderRadius: "50%" }}
  />
);

export default function Sidebar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>({
    user: {
      // name: "Bharat Kashyap",
      email: "bharatkashyap@outlook.com",
      image: "https://avatars.githubusercontent.com/u/19550456",
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
            image: "https://avatars.githubusercontent.com/u/19550456",
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
        // logo: "https://avatars.githubusercontent.com/u/19550456",
        logo: <Logo />,
        title: "Retail Store",
      }}
    >
      <DashboardLayout>
        <Box
          component={"main"}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            padding: 4,
          }}
        >
          <Outlet />
        </Box>
      </DashboardLayout>
    </AppProvider>
    // preview-end
  );
}