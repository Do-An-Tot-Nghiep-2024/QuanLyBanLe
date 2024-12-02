import { Box } from "@mui/material";
import {
  Legend,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  Area,
} from "recharts";

type Data = {
  name: string;
  soldQuantity: number;
  importQuantity: number;
  availableQuantity: number;
};
type Props = {
  data: Data[];
};
const formatName = (value:string) => {
  if(value.length > 10){
    // line break every 10 characters
   return value.slice(0, 13) + "..."
  }
  return value
}
export default function BarChartVertical({ data }: Props) {
  return (
    <Box
      display="flex"
      sx={{
        px: 2,
        mt: 5,
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ResponsiveContainer width="100%" height={350}>
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 50 }} // Adjust bottom margin for rotated labels
        >
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
            </linearGradient>

            <linearGradient id="colorAvb" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ff7300" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#ff7300" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="name"
            tick={{ fontSize:12}}
            angle={-50}
            tickFormatter={formatName}
            textAnchor="end"
            tickLine={false}
            height={110}
          />
          <YAxis />
          {/* <CartesianGrid strokeDasharray="3 3" /> */}
          <Legend align="center" verticalAlign="top" iconSize={12} />
          <Tooltip />
          <Area
            name="Số lượng đã bán"
            type="monotone"
            dataKey="soldQuantity"
            stroke="#8884d8"
            fillOpacity={1}
            fill="url(#colorUv)"
            label="Số lượng đã bán"
          />
          <Area
            name="Số lượng đã nhập"
            type="monotone"
            dataKey="importQuantity"
            stroke="#82ca9d"
            fillOpacity={1}
            fill="url(#colorPv)"
          />
          <Area
            name="Số lượng còn sẵn"
            type="monotone"
            dataKey="availableQuantity"
            stroke="#ff7300"
            fillOpacity={1}
            fill="url(#colorAvb)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Box>
  );
}
