import { useParams } from "react-router-dom";
import { getStatisticsProductPriceService } from "../../../services/statistic.service";
import { useQuery } from "@tanstack/react-query";
import {
  CartesianGrid,
  Legend,
  XAxis,
  YAxis,
  Bar,
  Tooltip,
  Line,
  ComposedChart,
} from "recharts";
import { formatMoney } from "../../../utils/formatMoney";
import { Paper, Stack } from "@mui/material";

export default function StatisticsProductPrice() {
  const productId = useParams()?.productId;
  const getStatisticsProductPrice = async () => {
    try {
      const response = await getStatisticsProductPriceService(
        Number(productId)
      );
      console.log(response);
      if (!response.status) {
        throw new Error("Error fetching employees");
      }
      return response.data;
    } catch (error) {
      console.error(error);
      throw error; // Rethrow the error to be handled by useQuery
    }
  };
  const { isLoading, isError, error, data, isFetching } = useQuery({
    queryKey: ["/statistics/product-price", productId],
    queryFn: () => getStatisticsProductPrice(), // No need for async/await here
  });
  if (isLoading || isFetching) {
    return <div>Loading ....</div>;
  }
  if (isError) {
    return <div>{error.message}</div>;
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    console.log("payload is ", payload);
    if (active && payload && payload.length) {
      return (
        <Stack flexDirection={"column"} component={Paper}>
          <span style={{ color: payload.color }}>
            Ngày cập nhật: {new Date(label).toLocaleDateString("en-GB")}
          </span>
          <br />
          <span style={{ color: payload[0].color }}>
            Giá gốc: {`${formatMoney(payload[0].value)}`}
          </span>
          <br />
          <span style={{ color: payload[1].color }}>
            Giá bán: {`${formatMoney(payload[1].value)}`}
          </span>
          <br />
        </Stack>
      );
    }

    return null;
  };

  const getValue = (value: any) => {
    if (value === "originalPrice") {
      return "Giá gốc";
    }
    return "Giá bán";
  };

  const renderColorfulLegendText = (value: string, entry: any) => {
    const { color } = entry;

    return <span style={{ color }}>{getValue(value)}</span>;
  };

  return (
    <ComposedChart
      width={730}
      height={350}
      data={data}
      margin={{ top: 25, right: 30, left: 25, bottom: 65 }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis
        dataKey="createdAt"
        tickFormatter={(date: Date) =>
          new Date(date).toLocaleDateString("en-GB")
        }
        // i want fortmat time is dd/mm/yyy
      />
      <YAxis
        dataKey="price"
        tickFormatter={(amount: number) => formatMoney(amount)}
      />
      <Tooltip content={<CustomTooltip />} />
      <Legend formatter={renderColorfulLegendText} />
      <Bar dataKey="originalPrice" fill="#8884d8" />
      <Bar dataKey="price" fill="#82ca9d" />
      <Line type="monotone" dataKey="price" stroke="#ff7300" />
    </ComposedChart>
  );
}
