import {
  ComposedChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  Label,
  Bar
} from "recharts";
import { getSalesStatisticsByProductService } from "../../services/statistic.service";
import { useQuery } from "@tanstack/react-query";



export default function SalesStatisticsProduct() {
  const getSalesStatisticsByProduct = async () => {
    try {
      const response = await getSalesStatisticsByProductService();
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
    queryKey: ["statistics/product"],
    queryFn: () => getSalesStatisticsByProduct(), // No need for async/await here
  });
  if (isLoading || isFetching) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>Error: {error.message}</div>;
  }
  console.log(data);
  return (
    <div>
      <ComposedChart
        width={750}
        height={300}
        data={data}
        margin={{ top: 25, right: 30, left: 25, bottom: 65 }}
      >
        <CartesianGrid stroke="#f2f2f5" strokeDasharray="3 3" />
        <XAxis dataKey="name">
          <Label
            value="Biểu đồ doanh thu theo sản phẩm"
            position="bottom"
            offset={45}
            fontSize={20}
            fontStyle="italic"
            fontWeight={"bold"}
          />
        </XAxis>
        <YAxis>
          <Label
            dy={-50}
            dx={-10}
            value="Doanh thu (VNĐ)"
            position="left"
            angle={-90}
            fontWeight={"bold"}
          />
        </YAxis>
        <Tooltip
          formatter={(value: number) =>
            value.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
              minimumFractionDigits: 0,
            })
          }
        />
        <Legend />

        <Bar dataKey="total" fill="#8884d8" barSize={30} />
      </ComposedChart>
    </div>
  );
}
