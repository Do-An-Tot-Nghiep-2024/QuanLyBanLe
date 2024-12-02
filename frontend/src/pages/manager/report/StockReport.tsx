import {
  Box,
  Container,
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { getStockByProductService } from "../../../services/statistic.service";
import { useQuery } from "@tanstack/react-query";
import BarChartVertical from "../../../components/BarChartVertical";
import SnackbarMessage from "../../../components/SnackbarMessage";

export default function StockReport() {
  const [message, setMessage] = useState("");
  const currMonth = new Date().getMonth() + 1 + "";
  const currYear = new Date().getFullYear();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [month, setMonth] = useState(currMonth);
  const handleChangeMonth = (event: SelectChangeEvent) => {
    setMonth(event.target.value);
  };
  const updateErrorMessage = (message: string) => {
    setMessage(message);
    setSnackbarOpen(true);
    return;
  };
  const getStockByProduct = async (month: string) => {
    try {
      const response = await getStockByProductService(Number(month));
      if (response.message !== "success") {
        updateErrorMessage(response.message);
      }
      return response.data;
    } catch (error: any) {
      updateErrorMessage(error.message);
    }
  };

  const { data, isLoading, isFetching, isError, error } = useQuery({
    queryKey: ["stock-product", month],
    queryFn: () => getStockByProduct(month),
    refetchOnWindowFocus: false,
  });
  if (isLoading || isFetching) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Box sx={{ width: "100%", height: "100%", marginTop: 5 }}>
      <Box>
        <Stack
          flexDirection={"row"}
          gap={2}
          alignContent={"center"}
          justifyContent={"center"}
          mx={20}
        >
          <FormControl fullWidth sx={{ minWidth: 200 }}>
            <Select value={month} onChange={handleChangeMonth}>
              {Array.from(Array(12).keys()).map((i) => (
                <MenuItem key={i + 1} value={i + 1}>
                  Tháng {i + 1}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            type="text"
            value={currYear}
            slotProps={{
              input: {
                readOnly: true,
              },
            }}
          ></TextField>
        </Stack>
      </Box>
      <Container sx={{pt:2}}>
        <Typography align="center" fontWeight={"bold"}>
          Biểu đồ nhập và bán của sản phẩm theo tháng
        </Typography>
        <BarChartVertical data={data} />
      </Container>
      <SnackbarMessage
        isError={true}
        alertMessage={message}
        setSnackbarOpen={setSnackbarOpen}
        snackbarOpen={snackbarOpen}
      />
    </Box>
  );
}
