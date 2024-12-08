import { useEffect, useMemo, useState } from "react";
import { createTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import "../assets/css/style.css";
import {
  Dashboard as DashboardIcon,
  ShoppingCart as ShoppingCartIcon,
  BarChart as BarChartIcon,
  BadgeOutlined as BadgeOutlinedIcon,
  PeopleAltOutlined as PeopleAltOutlinedIcon,
  Store as StoreIcon,
  ShoppingBag as ShoppingBagIcon,
  Inventory as InventoryIcon,
  // Settings as SettingsIcon,
  AddBusiness as AddBusinessIcon,
  Receipt as ReceiptIcon,
  ViewColumn as ViewColumnIcon,
  Warehouse as WarehouseIcon,
  Gite as GiteIcon,
  NoteAddOutlined,
  AddShoppingCart as AddShoppingCartIcon,
  AppRegistration as AppRegistrationIcon,
  MapsUgc as MapsUgcIcon,
  AttachMoney as AttachMoneyIcon,
  Refresh as RefreshIcon,
  Grain as GrainIcon,
  AccessTime as AccessTimeIcon,
  Logout,
} from "@mui/icons-material";
import RedeemIcon from "@mui/icons-material/Redeem";
import { AppProvider, DashboardLayout } from "@toolpad/core";
import type { Router, Navigation, Session } from "@toolpad/core";
import Cookies from "js-cookie";
import { logout } from "../redux/auth/authSlice";
import { useAppDispatch, useAppSelector } from "../redux/hook";
import { Outlet, useNavigate } from "react-router-dom";
import logo from "../assets/images/logo.png";
import Notification from "../components/Notification";
import { connectToSocket } from "../config/socket";
import { getSentNotificationsService } from "../services/notification.service";
import { IconButton, Stack } from "@mui/material";

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
    children: [
      {
        segment: "create-order",
        title: "Tạo đơn hàng mới",
        icon: <AddShoppingCartIcon />,
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
        segment: "import-invoices",
        title: "Quản lí phiếu nhập hàng",
        icon: <ReceiptIcon />,
      },
      {
        segment: "",
        title: "Quản lí lô hàng",
        icon: <WarehouseIcon />,
      },
      {
        segment: "expiration-quantity",
        title: "Quản lý sản phẩm hết hạn",
        icon: <AccessTimeIcon />,
      },
    ],
  },
  {
    segment: "products",
    title: "Sản phẩm",
    icon: <StoreIcon />,
    children: [
      {
        segment: "",
        title: "Quản lí sản phẩm",
        icon: <GiteIcon />,
      },
      {
        segment: "categories",
        title: "Quản lí danh mục",
        icon: <AddBusinessIcon />,
      },
      {
        segment: "units",
        title: "Quản lí đơn vị tính",
        icon: <ViewColumnIcon />,
        kind: "page",
      },
    ],
  },
  {
    segment: "promotions",
    title: "Khuyến mãi",
    icon: <RedeemIcon />,
    children: [
      {
        segment: "",
        title: "Quản lí khuyến mãi",
        icon: <AppRegistrationIcon />,
      },
      {
        segment: "create-promotion",
        title: "Tạo khuyến mãi",
        icon: <MapsUgcIcon />,
      },
    ],
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
        segment: "profit",
        title: "Theo doanh thu",
        icon: <AttachMoneyIcon />,
      },
      {
        segment: "stock",
        title: "Theo số lượng nhập và bán",
        icon: <GrainIcon />,
      },
    ],
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
    segment: "customers",
    title: "Khách hàng",
    icon: <PeopleAltOutlinedIcon />,
  },

  // {
  //   segment: "settings",
  //   title: "Cài đặt",
  //   icon: <SettingsIcon />,
  // },
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

    // dark: {
    //   palette: {
    //     background: {
    //       default: colors.dark,
    //       paper: colors.dark,
    //     },
    //   },
    // },
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

// function CustomThemeSwitcher() {

// }

export default function Sidebar() {
  const auth = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [nofitications, setNotifications] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [session, setSession] = useState<Session | null>({
    user: {
      name: auth?.usename,
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
          setPathname(String(path));
          navigate(path);
        }
      },
    };
  }, [pathname]);

  const getNotifications = async () => {
    try {
      const response = await getSentNotificationsService();
      if (response.message !== "success") {
        throw new Error(response.message);
      }
      setNotifications(response.data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    // const socket = new SockJS("http://localhost:8080/ws");
    // const client: Client = Stomp.over(socket);

    // client.connect({}, () => {
    //   client.subscribe(
    //     "/topic/messages",
    //     (message: any) => {
    //       const chatMessage = JSON.parse(message.body);
    //       setMessages((prevMessages: any) => {
    //         if (
    //           !prevMessages.find(
    //             (msg: { id: any }) => msg.id === chatMessage.id
    //           )
    //         ) {
    //           return [...prevMessages, chatMessage];
    //         }
    //         return prevMessages;
    //       });
    //     },
    //     (err: string) => {
    //       console.log("Connection error: " + err);
    //     }
    //   );
    // });
    getNotifications();
    connectToSocket(setNotifications);
  }, [refresh]);

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
        title:"CHÀO MỪNG QUẢN LÝ"
      }}
    >
      <DashboardLayout
        slots={{
          toolbarActions: () => (
            <Stack flexDirection={"row"}>
              <IconButton
                sx={{ mb: 1 }}
                onClick={() => setRefresh((prev) => !prev)}
              >
                <RefreshIcon />
              </IconButton>
              <Notification data={nofitications} />
            </Stack>
          ),
        }}
      >
        <Box
          component={"main"}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <Outlet />
        </Box>
      </DashboardLayout>
    </AppProvider>
    // preview-end
  );
}
