import { useState } from "react";
import { getDashboardEmployeeService } from "../../../services/dashboard.service";
import { useQuery } from "@tanstack/react-query";
import ReceiptIcon from "@mui/icons-material/Receipt";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Box, Skeleton, Snackbar } from "@mui/material";
import Grid from "@mui/material/Grid2";
import colors from "../../../constants/color";
import AnalyticsPaper from "../../../components/AnalyticsPaper";
import { formatMoney } from "../../../utils/formatMoney";
export default function Dashboard() {
  const [errMessage, setErrMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const getDashboardEmp = async () => {
    try {
      const response = await getDashboardEmployeeService();
      if (response.message !== "success") {
        setErrMessage(response.message);
      }
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };
  const { isLoading, isFetching, isError, data } = useQuery({
    queryKey: ["dashboardEmployee"],
    queryFn: getDashboardEmp,
    refetchOnWindowFocus: false,
  });
  const style = {
    color: "white",
    fontSize: 36,
  };

  const map = new Map([
    [
      "currentTotalOrders",
      {
        column: "Đơn hàng",
        icon: <ReceiptIcon sx={style} />,
        color: colors.cloud,
        iconColor: colors.lightBlue,
      },
    ],
    [
      "currentTotalSales",
      {
        column: "Doanh thu",
        icon: <ShoppingCartIcon sx={style} />,
        color: colors.ocean,
        iconColor: colors.lightBlue,
      },
    ],
  ]);

  const handleClose = () => {
    setIsOpen(false);
  };
  if (isLoading || isFetching) {
    return (
      <Grid container spacing={2}>
        <Skeleton variant="rectangular" height={200} />
        <Skeleton variant="rectangular" height={200} />
      </Grid>
    );
  }
  if (isError) {
    setIsOpen(true);
    <Snackbar
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      open={isOpen}
      onClose={handleClose}
      message={errMessage}
      // key={vertical + horizontal}
    />;
  }
  console.log(data);
  return (
    <Box
      sx={{
        width: "100%",
        // backgroundColor: "rgb(249, 250, 252)",
        height: "100vh",
      }}
    >
      <Grid
        container
        mx={{ xs: 1, md: 2 }}
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
      >
        {Object.keys(data).map((key, _index) => {
          return (
            <Grid key={key} size={{ xs: 12, sm: 12, md: 6 }}>
              <AnalyticsPaper
                props={{
                  name: map.get(key)?.column ?? "",
                  value:
                    key !== "currentTotalOrders"
                      ? formatMoney(data[key])
                      : data[key],
                  color: map.get(key)?.color ?? "",
                  iconColor: map.get(key)?.iconColor ?? "",
                  icon: map.get(key)?.icon ?? null,
                }}
              />
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
