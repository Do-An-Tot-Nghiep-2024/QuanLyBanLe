import {
  Box,
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
// import { getSalesAndProfitService } from "../../../services/statistic.service";
import { useQuery } from "@tanstack/react-query";
import DataChart from "../../../components/DataChart";
import {
  getSalesAndProfitByDateService,
  getSalesAndProfitByMonthService,
} from "../../../services/statistic.service";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Dayjs } from "dayjs";
import { viVN } from "@mui/x-date-pickers/locales";
import SnackbarMessage from "../../../components/SnackbarMessage";
import { formatDateInput } from "../../../utils/dateUtil";
export default function ProfitReport() {
  
  const defaultMonth = new Date().getMonth() + 1 + "";
  const currYear = new Date().getFullYear();
  const [type, setType] = useState("month");
  const [month, setMonth] = useState(defaultMonth);
  const [date, setDate] = useState<Dayjs | null>(null);
  const [message, setMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

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
  
  const getSalesAndProfitByDate = async (date: Dayjs | null) => {
    try {
      let toDate = date?.format("YYYY-MM-DD");
      if (!toDate) {
        toDate = formatDateInput(new Date().toISOString());
      }
      const response = await getSalesAndProfitByDateService(toDate ?? "");
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
      queryKey: ["dashboardProfit", date],
      queryFn: () => getSalesAndProfitByDate(date),
      refetchOnWindowFocus: false,
    });
    responseData.data = data;
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
  const handleChangeDate = (value: Dayjs | null) => {
    setDate(value);
  };
  if(responseData.isLoading || responseData.isFetching){
    return <div>Loading...</div>;
  }
  if(responseData.isError){
    return <div>Error: {responseData.error.message}</div>;
  }
  console.log(month);
  
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
          <Stack>
            <LocalizationProvider
              dateAdapter={AdapterDayjs}
              localeText={
                viVN.components.MuiLocalizationProvider.defaultProps.localeText
              }
            >
              <DatePicker
                label="Ngày kết thúc"
                onChange={handleChangeDate}
                value={date}
                format="DD/MM/YYYY"
                views={["day", "month", "year"]}
              />
              <Typography color="warning" sx={{ pt: 2 }}>
                ! Ngày bắt đầu là tuần trước của ngày kết thúc
              </Typography>
            </LocalizationProvider>
          </Stack>
        )}

      </Stack>
      <Container sx={{ width: "90%", height: "80%" }}>
        <Typography variant="h6" sx={{ mt: 5 }} align="center">
          Biểu đồ doanh thu theo {type === "month" ? "tháng" : "năm"} (K: Nghìn, M: Triệu, B: Tỉ)
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
