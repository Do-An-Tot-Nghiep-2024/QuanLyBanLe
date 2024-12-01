import {
  Box,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
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

type DateRequest = {
  fromDate: string;
  toDate: string;
};

export default function ProductReport() {
  const { fromDate: before, toDate: after } = generateDateDuringWeek();
  const [fromDate, setFromDate] = useState(before);
  const [toDate, setToDate] = useState(after);
  const [productType, setProductType] = useState("BEST_SELLING");

  const handleChange = (event: SelectChangeEvent) => {
    setProductType(event.target.value);
  };
  const handleChangeFromDate = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFromDate(event.target.value);
  };
  const handleChangeToDate = (event: React.ChangeEvent<HTMLInputElement>) => {
    setToDate(event.target.value);
  };

  const getTopFiveHighestGrossing = async ({
    request,
  }: {
    request: DateRequest;
  }) => {
    try {
      const response = await getTopFiveHighestGrossingService({
        fromDate: request.fromDate,
        toDate: request.toDate,
      });
      if (response.message !== "success") {
        throw new Error("Error fetching dashboard");
      }
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };
  const getBestSellingProduct = async ({
    request,
  }: {
    request: DateRequest;
  }) => {
    try {
      const response = await getBestSellingProductService({
        fromDate: request.fromDate,
        toDate: request.toDate,
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
      queryFn: () => getBestSellingProduct({ request: { fromDate, toDate } }),
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
      queryFn: () =>
        getTopFiveHighestGrossing({ request: { fromDate, toDate } }),
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
      <Box sx={{ display: "flex", flexDirection: "row", gap: 2, mb: 15 }}>
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
        <TextField
          label="Ngày bắt đầu"
          sx={{ minWidth: 300 }}
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
          value={fromDate}
          onChange={handleChangeFromDate}
          type="date"
        />
        <TextField
          label="Ngày kết thúc"
          value={toDate}
          onChange={handleChangeToDate}
          sx={{ minWidth: 300 }}
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
          type="date"
        />
      </Box>
      {productType === "BEST_SELLING" && (
        <Box
          sx={{
            mt: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            justifyItems: "center",
          }}
        >
          <ProductChart data={reponse.data} dataKey="quantity" />
        </Box>
      )}
      {productType === "TOP_FIVE" && (
        <ProductChart data={reponse.data} dataKey="total" />
      )}
    </Container>
  );
}
