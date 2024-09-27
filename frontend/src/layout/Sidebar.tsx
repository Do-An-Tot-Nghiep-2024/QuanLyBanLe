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
} from "@mui/icons-material";
import { AppProvider, DashboardLayout } from "@toolpad/core";
import type { Router, Navigation, Session } from "@toolpad/core";
import AddAlertIcon from "@mui/icons-material/AddAlert";

import Cookies from "js-cookie";
import {logout } from "../redux/auth/authSlice";
import { useAppDispatch } from "../redux/hook";
import { Outlet, useNavigate } from "react-router-dom";
import colors from "../constants/color";
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
  },
  {
    segment: "product",
    title: "Sản phẩm",
    icon: <StoreIcon />,
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
        segment: "following products",
        title: "Theo sản phẩm",
        icon: <ShoppingBagIcon />,
      },
      {
        segment: "traffic",
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
];

const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: "data-toolpad-color-scheme",
  },
  colorSchemes: {
    light: {
      palette: {
        background: {
          default: "#F9F9FE",
          paper: "#EEEEF9",
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
});

export default function Sidebar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>({
    user: {
      name: "Bharat Kashyap",
      email: "bharatkashyap@outlook.com",
      image: "https://avatars.githubusercontent.com/u/19550456",
    },
  });

  const authentication = useMemo(() => {
    return {
      signIn: () => {
        setSession({
          user: {
            name: "Bharat Kashyap",
            email: "bharatkashyap@outlook.com",
            image: "https://avatars.githubusercontent.com/u/19550456",
          },
        });
      },
      signOut: () => {
        setSession(null);
        Cookies.remove("accessToken");
        navigate("/login");
        dispatch(logout());
      },
    };
  }, []);
  const [pathname, setPathname] = useState("/dashboard");

  const router = useMemo<Router>(() => {
    return {
      pathname,
      searchParams: new URLSearchParams(),
      navigate: (path) => {
        setPathname(String(path));
        navigate(path);
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
        title: "Retail Store",
      }}
    >
      <DashboardLayout>
        <Box
          component={"main"}
          sx={{
            py: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            mx: 4,
          }}
        >
          <Outlet />
        </Box>
      </DashboardLayout>
    </AppProvider>
    // preview-end
  );
}
