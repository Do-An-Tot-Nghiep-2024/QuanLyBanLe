// import { createTheme } from "@mui/material/styles";
// import DashboardIcon from "@mui/icons-material/Dashboard";
// import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
// import BarChartIcon from "@mui/icons-material/BarChart";
// import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
// import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
// import { AppProvider } from "@toolpad/core/AppProvider";
// import DateRangeIcon from "@mui/icons-material/DateRange";
// import StoreIcon from "@mui/icons-material/Store";
// import { DashboardLayout } from "@toolpad/core/DashboardLayout";
// import type { Router, Navigation, Session } from "@toolpad/core";
// import RecentActorsIcon from "@mui/icons-material/RecentActors";
// import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
// import InventoryIcon from "@mui/icons-material/Inventory";
// import SettingsIcon from "@mui/icons-material/Settings";
// import { useMemo, useState } from "react";
// import Box from "@mui/material/Box";
// import Typography from "@mui/material/Typography";
import { useMemo, useState } from "react";
import { createTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
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
  Search as SearchIcon,
} from "@mui/icons-material";
import { AppProvider, DashboardLayout } from "@toolpad/core";
import type { Router, Navigation, Session } from "@toolpad/core";
// import DataTable from "../../components/DataTable";

import DataChart from "../../components/DataChart";
import { IconButton, TextField, Tooltip } from "@mui/material";
import React from "react";
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
          default: "#464667",
          paper: "#464667",
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

function DemoPageContent({ pathname }: { pathname: string }) {
  return (
    <Box
      sx={{
        py: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <Typography variant="h4">Welcome to {pathname}</Typography>
      {/* <DataTable/> */}
      <DataChart/>
    </Box>
  );
}

function Search() {
  return (
    <React.Fragment>
      <Tooltip title="Search" enterDelay={1000}>
        <div>
          <IconButton
            type="button"
            aria-label="search"
            size="small"
            sx={{
              display: { xs: 'inline-block', md: 'none' },
            }}
          >
            <SearchIcon />
          </IconButton>
        </div>
      </Tooltip>
      <TextField
        id="search"
        label="Search"
        variant="outlined"
        size="small"
        slotProps={{
          input: {
            endAdornment: (
              <IconButton type="button" aria-label="search" size="small">
                <SearchIcon />
              </IconButton>
            ),
            sx: { pr: 0.5 },
          },
        }}
        sx={{ display: { xs: 'none', md: 'inline-block' }, mr: 1 }}
      />
    </React.Fragment>
  );
}
interface DemoProps {
  /**
   * Injected by the documentation to work in an iframe.
   * Remove this when copying and pasting into your project.
   */
  window?: () => Window;
}

export default function Dashboard(props: DemoProps) {
  const { window } = props;
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
      },
    };
  }, []);
  const [pathname, setPathname] = useState("/dashboard");

  const router = useMemo<Router>(() => {
    return {
      pathname,
      searchParams: new URLSearchParams(),
      navigate: (path) => setPathname(String(path)),
    };
  }, [pathname]);

  const demoWindow = window !== undefined ? window() : undefined;

  return (
    // preview-start
    <AppProvider
      session={session}
      authentication={authentication}
      navigation={NAVIGATION}
      router={router}
      theme={demoTheme}
      window={demoWindow}
    >
      <DashboardLayout slots={{ toolbarActions: Search }}>
        <DemoPageContent pathname={pathname} />
      </DashboardLayout>
    </AppProvider>
    // preview-end
  );
}


