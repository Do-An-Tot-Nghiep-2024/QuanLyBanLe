import { Box, } from "@mui/material";
import { lazy } from "react";
// import PersonIcon from "@mui/icons-material/Person";
import ReceiptIcon from "@mui/icons-material/Receipt";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { getDashboardService } from "../../services/dashboard.service";
import { useQuery } from "@tanstack/react-query";
import { formatMoney } from "../../utils/formatMoney";
import Grid from "@mui/material/Grid2";
import AnalyticsPaper from "../../components/AnalyticsPaper";
import colors from "../../constants/color";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import {
  getSalesAndProfitService,
  getSalesBySupplierService,
} from "../../services/statistic.service";
const DataChart = lazy(() => import("../../components/DataChart"));
const PieChartCard = lazy(() => import("../../components/RadarChart"));
function Dashboard() {
  const getDashboard = async () => {
    try {
      const response: any = await getDashboardService();
      if (response.message !== "success") {
        throw new Error("Error fetching dashboard");
      }
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  const getSalesBySupplier = async () => {
    try {
      const response = await getSalesBySupplierService();
      if (response.message !== "success") {
        throw new Error("Error fetching dashboard");
      }
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  const getSalesAndProfit = async () => {
    try {
      const response = await getSalesAndProfitService({
        fromDateRequest: "",
        toDateRequest: "",
      });
      if (response.message !== "success") {
        throw new Error("Error fetching dashboard");
      }
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  const { isLoading, isError, error, data, isFetching } = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => getDashboard(),
    refetchOnWindowFocus: false,
  });
  const {
    isLoading: supplierLoading,
    isError: supplierError,
    error: supplierErrorMessage,
    data: supplierData,
    isFetching: supplierFetching,
  } = useQuery({
    queryKey: ["dashboardSupplier"],
    queryFn: () => getSalesBySupplier(),
    refetchOnWindowFocus: false,
  });

  const {
    isLoading: profitLoading,
    isError: profitError,
    error: profitErrorMessage,
    data: profitData,
    isFetching: profitFetching,
  } = useQuery({
    queryKey: ["dashboardProfit"],
    queryFn: () => getSalesAndProfit(),
    refetchOnWindowFocus: false,
  });

  if (isLoading || isFetching) {
    return <div>Loading...</div>;
  }
  if (supplierLoading || supplierFetching) {
    return <div>Loading...</div>;
  }
  if (profitLoading || profitFetching) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>Error: {error.message}</div>;
  }
  if (supplierError) {
    return <div>Error: {supplierErrorMessage.message}</div>;
  }
  if (profitError) {
    return <div>Error: {profitErrorMessage.message}</div>;
  }
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
    [
      "currentNetTotalProfit",
      {
        column: "Lợi nhuận",
        icon: <LocalAtmIcon sx={style} />,
        color: colors.lightPink,
        iconColor: colors.pink,
      },
    ],
  ]);

  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor: "rgb(249, 250, 252)",
        height: "100vh",
        paddingTop: 5,
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
            <Grid key={key} size={{ xs: 12, sm: 12, md: 4 }}>
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
      <Grid container mt={5}>
        <Grid size={{ lg: 5, sm: 12, xs: 12 }}>
          <PieChartCard data={supplierData} />
        </Grid>
        <Grid size={{ lg: 6, sm: 12, xs: 12 }}>
          {/* <Card component={Paper}>
            <CardContent>
              <Box
                width={"100%"}
                alignItems={"center"}
                justifyContent={"center"}
                display={"flex"}
              > */}
                <DataChart data={profitData} />
              {/* </Box>
            </CardContent>
          </Card> */}
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;
