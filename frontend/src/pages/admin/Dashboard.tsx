import { Box } from "@mui/material";
import { lazy } from "react";
import PersonIcon from "@mui/icons-material/Person";
import ReceiptIcon from "@mui/icons-material/Receipt";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { getDashboardService } from "../../services/dashboard.service";
import { useQuery } from "@tanstack/react-query";
import { formatMoney } from "../../utils/formatMoney";
import Grid from "@mui/material/Grid2";
import AnalyticsPaper from "../../components/AnalyticsPaper";
import colors from "../../constants/color";
const DataChart = lazy(() => import("../../components/DataChart"));
const PieChartCard = lazy(() => import("../../components/PieChartCard"));
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

  const { isLoading, isError, error, data, isFetching } = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => getDashboard(),
    refetchOnWindowFocus: false,
  });
  if (isLoading || isFetching) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>Error: {error.message}</div>;
  }
  const style = {
    color: "white",
    fontSize: 36,
  };

  const map = new Map([
    [
      "totalOrders",
      {
        column: "Đơn hàng",
        icon: <ReceiptIcon sx={style} />,
        color: colors.cloud,
        iconColor:colors.lightBlue,
      },
    ],
    [
      "totalSales",
      {
        column: "Doanh thu",
        icon: <ShoppingCartIcon sx={style} />,
        color: colors.ocean,
        iconColor:colors.lightBlue,
      },
    ],
    [
      "totalCustomers",
      {
        column: "Khách hàng",
        icon: <PersonIcon sx={style} />,
        color: colors.lightPink,
        iconColor:colors.pink,
      },
    ],
  ]);
  console.log(map);
  
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
          mx={{ xs: 1, md: 2, }}
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 4, sm: 8, md: 12 }}
        >
         { Object.keys(data).map((key, _index) => {
            return (
              <Grid key={key} size={{ xs: 12, sm: 12, md: 4 }}>
                <AnalyticsPaper
                 props={{
                   name: map.get(key)?.column ?? "",
                   value: key === "totalSales" ? formatMoney(data[key]) : data[key],
                   color: map.get(key)?.color ?? "",
                   iconColor:map.get(key)?.iconColor ?? "",
                   icon: map.get(key)?.icon ?? null,
              
                 }}
                />
              </Grid>
            );
          })}
        </Grid>
      <Grid container mt={5}>
        <Grid size={{ lg: 5, sm: 12, xs: 12 }}>
          <PieChartCard />
        </Grid>
        <Grid size={{ lg: 7, sm: 12, xs: 12 }}>
          <DataChart />
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;
