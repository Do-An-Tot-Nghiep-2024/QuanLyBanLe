import { useEffect, useMemo, useState } from "react";
import { createTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import {
  Dashboard as DashboardIcon,
  ShoppingCart as ShoppingCartIcon,
  Store as StoreIcon,
  Inventory as InventoryIcon,
  Receipt as ReceiptIcon,
  Refresh as RefreshIcon,
  AccessTime as AccessTimeIcon,
  Logout,
} from "@mui/icons-material";
import { AppProvider, DashboardLayout } from "@toolpad/core";
import type { Router, Navigation, Session } from "@toolpad/core";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import Cookies from "js-cookie";
import { Outlet, useNavigate } from "react-router-dom";
// import ReceiptIcon from "@mui/icons-material/Receipt";
import logo from "../../../assets/images/logo.png";
// import colors from "../../../constants/color";
import { useAppDispatch, useAppSelector } from "../../../redux/hook";
import { logout } from "../../../redux/auth/authSlice";
import { getSentNotificationsService } from "../../../services/notification.service";
import { IconButton, Stack, Typography } from "@mui/material";
import Notification from "../../../components/Notification";
import { connectToSocket } from "../../../config/socket";
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
    segment: "staff/inventory",
    title: "Kho hàng",
    icon: <InventoryIcon />,
    children: [
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
    segment: "staff/products",
    title: "Sản phẩm",
    icon: <StoreIcon />,
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

export default function Sidebar() {
  const auth = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [nofitications, setNotifications] = useState([]);
  const [refresh, setRefresh] = useState(false);
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
        title: "",
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
              <Typography fontSize={16} pt={1} fontWeight={"bold"}>
                NHÂN VIÊN
              </Typography>
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
            pt: 3,
          }}
        >
          <Outlet />
        </Box>
      </DashboardLayout>
    </AppProvider>
    // preview-end
  );
}
