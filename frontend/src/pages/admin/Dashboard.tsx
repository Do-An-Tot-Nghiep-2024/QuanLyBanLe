import { Box, Card, CardContent, Stack, Typography } from "@mui/material";
import { lazy } from "react";
import PersonIcon from "@mui/icons-material/Person";
import ReceiptIcon from "@mui/icons-material/Receipt";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { getDashboardService } from "../../services/dashboard.service";
import { useQuery } from "@tanstack/react-query";
import formatMoney from "../../utils/formatMoney";
const DataChart = lazy(() => import("../../components/DataChart"));
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
  });
  if (isLoading || isFetching) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>Error: {error.message}</div>;
  }
  const mapName = new Map([
    ["totalQuantityOrder", "Đơn hàng"],
    ["totalSales", "Tiền bán được"],
    ["totalCustomers", "Khách hàng"],
  ]);
  const style = {
    color: "white",
    fontSize: 36,
  };
  const mapIcon = new Map([
    ["totalQuantityOrder", <ReceiptIcon sx={style} />],
    ["totalSales", <ShoppingCartIcon sx={style} />],
    ["totalCustomers", <PersonIcon sx={style} />],
  ]);
  const mapColor = new Map([
    ["totalQuantityOrder", "#7E60BF"],
    ["totalSales", "#FD8B51"],
    ["totalCustomers", "#72BF78"],
  ]);
  console.log(data);
  return (
    <Box
      sx={{
        width: "100%",
      }}
    >
      <Stack
        flexDirection="row"
        gap={5}
        mb={2}
        sx={{
          justifyContent: "space-evenly",
        }}
      >
        {
          // loop follow feilds in object
          Object.keys(data).map((key, index) => {
            console.log(key);
            return (
              <Card key={index}>
                <CardContent>
                  <Stack direction="row">
                    <Box
                      sx={{
                        backgroundColor: mapColor.get(key),
                        borderRadius: "50%",
                        width: 80,
                        height: 80,
                        alignItems: "center",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      {mapIcon.get(key)}
                    </Box>
                    <Stack sx={{ pl: 2, pt: 2 }}>
                      <Typography sx={{ fontSize: 20, fontWeight: "bold" }}>
                        {(key as string) === "totalSales"
                          ? formatMoney(data[key])
                          : data[key]}
                      </Typography>
                      <Typography sx={{ fontSize: 18 }}>
                        {mapName.get(key)}
                      </Typography>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            );
          })
        }
      </Stack>
      <DataChart />
    </Box>
  );
}

export default Dashboard;
