import {
  Box,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import { useState } from "react";
import {
  getBestSellingProductService,
  getTopFiveHighestGrossingService,
} from "../../../services/statistic.service";
import { useQuery } from "@tanstack/react-query";
import ProductChart from "../../../components/ProductChart";
import { generateDateDuringWeek } from "../../../utils/dateUtil";
import QueryResponse from "../../../types/common/queryResponse";
import DateInput from "../../../components/DateInput";
import dayjs, { Dayjs } from "dayjs";
import SnackbarMessage from "../../../components/SnackbarMessage";

export default function ProductReport() {
  const { fromDate: before, toDate: after } = generateDateDuringWeek();
  const [fromDate, setFromDate] = useState<Dayjs | null>(dayjs(before));
  const [toDate, setToDate] = useState<Dayjs | null>(dayjs(after));
  const [productType, setProductType] = useState("BEST_SELLING");
  const [message, setMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleChange = (event: SelectChangeEvent) => {
    setProductType(event.target.value);
  };
  // const handleChangeFromDate = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setFromDate(event.target.value);
  // };
  const handleChangeFromDate = (value: Dayjs | null) => {
    setFromDate(value);
  };
  const handleChangeToDate = (value: Dayjs | null) => {
    setToDate(value);
  };

  const setCurrentToDate = (toDate: Dayjs | null) => {
    console.log("toDate", toDate);
    if (toDate?.isSame(dayjs(after))) {
      return dayjs(after).set("date", dayjs(after).get("date") - 1);
    }
    return toDate;
  };

  const validateDate = (fromDate: Dayjs | null, toDate: Dayjs | null) => {
    if (toDate?.isBefore(fromDate)) {
      setMessage("Ngày kết thúc phải lớn hơn ngày bắt đầu");
      // setFromDate(dayjs(before));
      // setToDate(dayjs(after));
      setSnackbarOpen(true);
      return false;
    }
    if (fromDate?.isAfter(dayjs())) {
      setMessage("Ngày bắt đầu phải nhỏ hơn ngày kết thúc");
      // setFromDate(dayjs(before));
      setSnackbarOpen(true);
      return false;
    }
    if (toDate?.isAfter(dayjs())) {
      setToDate(dayjs(after));
      return true;
    }
    return true;
  };

  const getTopFiveHighestGrossing = async (
    fromDate: Dayjs | null,
    toDate: Dayjs | null
  ) => {
    try {
      if (!validateDate(fromDate, toDate)) {
        return null;
      }
      if (!fromDate || !toDate) {
        return null;
      }
      fromDate = fromDate?.set("date", fromDate?.get("date") - 1);
      toDate = toDate?.set("date", toDate?.get("date") + 1);
      const response = await getTopFiveHighestGrossingService({
        fromDate: fromDate?.format("YYYY-MM-DD") ?? "",
        toDate: toDate?.format("YYYY-MM-DD") ?? "",
      });
      if (response.message !== "success") {
        throw new Error("Error fetching dashboard");
      }
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };
  const getBestSellingProduct = async (
    fromDate: Dayjs | null,
    toDate: Dayjs | null
  ) => {
    try {
      if (!validateDate(fromDate, toDate)) {
        return null;
      }
      if (!fromDate || !toDate) {
        return null;
      }
      fromDate = fromDate?.set("date", fromDate?.get("date") - 1);
      toDate = toDate?.set("date", toDate?.get("date") + 1);
      const response = await getBestSellingProductService({
        fromDate: fromDate?.format("YYYY-MM-DD") ?? "",
        toDate: toDate?.format("YYYY-MM-DD") ?? "",
      });
      if (response.message !== "success") {
        throw new Error("Error fetching dashboard");
      }
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  const reponse: QueryResponse = {
    data: null,
    isLoading: false,
    isFetching: false,
    isError: false,
    error: null,
  };
  if (productType === "BEST_SELLING") {
    const { isLoading, isError, error, data, isFetching } = useQuery({
      queryKey: ["bestselling", fromDate, toDate, productType],
      queryFn: () => getBestSellingProduct(fromDate, toDate),
      refetchOnWindowFocus: false,
    });
    reponse.data = data;
    reponse.isLoading = isLoading;
    reponse.isFetching = isFetching;
    reponse.isError = isError;
    reponse.error = error;
  }
  if (productType === "TOP_FIVE") {
    const { isLoading, isError, error, data, isFetching } = useQuery({
      queryKey: ["topFive", fromDate, toDate, productType],
      queryFn: () => getTopFiveHighestGrossing(fromDate, toDate),
      refetchOnWindowFocus: false,
    });
    reponse.data = data;
    reponse.isLoading = isLoading;
    reponse.isFetching = isFetching;
    reponse.isError = isError;
    reponse.error = error;
  }

  if (reponse.isLoading || reponse.isFetching) {
    return <div>Loading...</div>;
  }
  if (reponse.isError) {
    return <div>Error: {reponse.error.message}</div>;
  }
  return (
    <Container sx={{ mt: 5 }}>
      <Box sx={{ display: "flex", flexDirection: "row", gap: 2, mb: 10 }}>
        <FormControl sx={{ minWidth: 300 }}>
          <InputLabel id="demo-simple-select-label">Loại thống kê</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={productType}
            label="Loại thống kê"
            onChange={handleChange}
          >
            <MenuItem value={"BEST_SELLING"}>Sản phẩm bán chạy</MenuItem>
            <MenuItem value={"TOP_FIVE"}>
              Top 5 sản phẩm có doanh thu cao nhất
            </MenuItem>
          </Select>
        </FormControl>

        <DateInput
          date={fromDate}
          onChange={handleChangeFromDate}
          lable="Ngày bắt đầu"
        />
        <DateInput
          date={setCurrentToDate(toDate)}
          onChange={handleChangeToDate}
          lable="Ngày kết thúc"
        />
      </Box>
      {productType === "BEST_SELLING" && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            justifyItems: "center",
            flexDirection: "column",
          }}
        >
          <Typography align="center" fontWeight="bold">
            Biểu đồ sản phẩm bán chạy theo thời gian
          </Typography>

          <ProductChart data={reponse.data} dataKey="quantity" />
        </Box>
      )}
      {productType === "TOP_FIVE" && (
        <Box>
          <Typography align="center" fontWeight="bold">
            Biểu đồ top 5 sản phẩm có doanh thu cao nhất (K: Nghìn, M: Triệu, B:
            Tỉ)
          </Typography>
          <ProductChart data={reponse.data} dataKey="total" />
        </Box>
      )}
      <SnackbarMessage
        isError={true}
        alertMessage={message}
        setSnackbarOpen={setSnackbarOpen}
        snackbarOpen={snackbarOpen}
      />
    </Container>
  );
}
