import {
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import DataChart from "../../../components/DataChart";
import {
  getSalesAndProfitByMonthService,
  getSalesAndProfitInWeekService,
} from "../../../services/statistic.service";
import SnackbarMessage from "../../../components/SnackbarMessage";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import currentDate from "../../../constants/day";
import filterRessponse from "../../../utils/filterResponse";
export default function ProfitReport() {
  const defaultMonth = currentDate.getMonth() + 1 + "";
  const currYear = currentDate.getFullYear();
  const [type, setType] = useState("month");
  const [month, setMonth] = useState(defaultMonth);
  const [message, setMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [next, setNext] = useState(0);

  // const convertDateFromString = (date: string) => {
  //   const [day, month, year] = date.split("-").map(Number);
  //   const res = new Date(year, month - 1, day);
  //   return res;
  // };

  const updateErrorMessage = (message: string) => {
    setMessage(message);
    setSnackbarOpen(true);
    return;
  };

  const getSalesAndProfitByMonth = async (month: string) => {
    try {
      const response = await getSalesAndProfitByMonthService(Number(month));
      if (response.message !== "success") {
        updateErrorMessage(response.message);
      }
      return response.data;
    } catch (error: any) {
      updateErrorMessage(error.message);
    }
  };

  const getSalesAndProfitInWeek = async (next: number) => {
    try {
      const response = await getSalesAndProfitInWeekService(next);
      if (response.message !== "success") {
        updateErrorMessage(response.message);
      }
      return response.data;
    } catch (error: any) {
      updateErrorMessage("Lỗi kết nối tới máy chủ");
    }
  };
  type Response = {
    data: any;
    isLoading: boolean;
    isFetching: boolean;
    isError: boolean;
    error: any;
  };
  const responseData: Response = {
    data: null,
    isLoading: false,
    isFetching: false,
    isError: false,
    error: null,
  };

  if (type === "month") {
    const { data, isLoading, isFetching, isError, error } = useQuery({
      queryKey: ["dashboardProfit", month],
      queryFn: () => getSalesAndProfitByMonth(month),
      refetchOnWindowFocus: false,
    });
    responseData.data = data;
    responseData.isLoading = isLoading;
    responseData.isFetching = isFetching;
    responseData.isError = isError;
    responseData.error = error;
  } else {
    const { data, isLoading, isFetching, isError, error } = useQuery({
      queryKey: ["dashboardProfit", next],
      queryFn: () => getSalesAndProfitInWeek(next),
      refetchOnWindowFocus: false,
    });
    
    responseData.data = filterRessponse(data);
    responseData.isLoading = isLoading;
    responseData.isFetching = isFetching;
    responseData.isError = isError;
    responseData.error = error;
  }

  const handleChange = (event: SelectChangeEvent) => {
    setType(event.target.value);
  };
  const handleChangeMonth = (event: SelectChangeEvent) => {
    setMonth(event.target.value);
  };
  // const handleChangeDate = (value: Dayjs | null) => {
  //   setDate(value);
  // };
  if (responseData.isLoading || responseData.isFetching) {
    return <div>Loading...</div>;
  }
  if (responseData.isError) {
    return <div>Error: {responseData.error.message}</div>;
  }
  console.log(next);

  const handleChangeNext = (val: number) => {
    if (next + val > 0) {
      setNext(0);
    } else {
      setNext(next + val);
    }
  };
  return (
    <Box sx={{ width: "100%", height: "100%", marginTop: 5 }}>
      <Stack
        flexDirection={"row"}
        justifyContent={"space-evenly"}
        gap={2}
        sx={{
          px: 20,
          py: "5px",
        }}
      >
        <Box sx={{ minWidth: 200 }}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Thống kê</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={type}
              label="Thống kê"
              onChange={handleChange}
            >
              <MenuItem value={"month"}>Thống kê theo tháng</MenuItem>
              <MenuItem value={"day"}>Thống kê theo tuần</MenuItem>
            </Select>
          </FormControl>
        </Box>
        {type === "month" && (
          <Stack flexDirection={"row"} gap={2}>
            <FormControl fullWidth>
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
        )}

        {type === "day" && (
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<ArrowBackIcon />}
              onClick={() => handleChangeNext(-7)}
            >
              Tuần trước
            </Button>
            <Button
              variant="outlined"
              size="small"
              endIcon={<ArrowForwardIcon />}
              onClick={() => handleChangeNext(7)}
            >
              Tuần sau
            </Button>
          </Stack>
        )}
      </Stack>
      <Container sx={{ width: "90%", height: "80%" }}>
        <Typography variant="h6" sx={{ mt: 5 }} align="center">
          Biểu đồ doanh thu theo {type === "month" ? "tháng " + month : "tuần"}{" "}
          (K: Nghìn, M: Triệu, B: Tỉ)
        </Typography>
        <DataChart data={responseData.data} />
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
