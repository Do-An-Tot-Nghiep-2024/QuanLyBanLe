import { Card, Paper, Typography } from "@mui/material";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  Legend,
  Bar,
  Line,
} from "recharts";
import { formatMoney } from "../utils/formatMoney";

type Data = {
  date: string;
  totalSales: number;
  totalProfit: number;
};

type Props = {
  data: Data[];
};

export default function DataChart({ data }: Props) {
  return (
    <div style={{ width: "100%", height: "315px", paddingLeft: 20 }}>
      <Card component={Paper} sx={{ width: "100%", height: "100%" }}>
        <Typography align="left" fontWeight={"600"} sx={{ pl: 20 }}>
          Biểu đồ doanh thu trong tuần
        </Typography>
        <ResponsiveContainer>
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip formatter={(value) => formatMoney(value as number)} />
            <Legend iconType="circle" />
            <Bar dataKey="totalSales" fill="#89A8B2" name="Doanh thu" />
            <Bar dataKey="totalProfit" fill="#9ABF80" name="Lợi nhuận" />
            <Line
              type="monotone"
              dataKey="totalProfit"
              stroke="#ff7300"
              name="Lợi nhuận"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
