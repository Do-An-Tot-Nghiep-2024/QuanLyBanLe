import { Box, Container, Stack, TextField, Typography } from "@mui/material";
import { generateDateDuringWeek } from "../../../utils/dateUtil";
import { useState } from "react";
import { getSalesAndProfitService } from "../../../services/statistic.service";
import { useQuery } from "@tanstack/react-query";
import DataChart from "../../../components/DataChart";

export default function ProfitReport() {
  const { fromDate: before, toDate: after } = generateDateDuringWeek();
  const [fromDate, setFromDate] = useState(before);
  const [toDate, setToDate] = useState(after);

  const handleChangeFromDate = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFromDate(event.target.value);
  };
  const handleChangeToDate = (event: React.ChangeEvent<HTMLInputElement>) => {
    setToDate(event.target.value);
  };
  const getSalesAndProfit = async () => {
    try {
      const response = await getSalesAndProfitService({
        fromDateRequest: fromDate,
        toDateRequest: toDate,
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
    queryKey: ["dashboardProfit", fromDate, toDate],
    queryFn: () => getSalesAndProfit(),
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
      <Stack
        flexDirection={"row"}
        justifyContent={"space-evenly"}
        gap={2}
        sx={{
          px: 20,
          py: "5px",
        }}
      >
        <TextField
          fullWidth
          label="Ngày bắt đầu"
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
          fullWidth
          label="Ngày kết thúc"
          value={toDate}
          onChange={handleChangeToDate}
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
          type="date"
        />
      </Stack>
      <Container sx={{ width: "90%", height: "80%" }}>
        <Typography variant="h6" sx={{ mt: 5 }} align="center">Biểu đồ doanh thu theo thời gian</Typography>
        <DataChart data={data} />
      </Container>
    </Box>
  );
}
