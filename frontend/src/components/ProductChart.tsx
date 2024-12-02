import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatMoney, formatMoneyThousand } from "../utils/formatMoney";
import DataFormater from "../utils/formatDataChart";

type Data = {
  name: string;
  value: number;
};

type Props = {
  data: Data[];
  dataKey: string;
};

export default function ProductChart({ data, dataKey }: Props) {
  return (
    <ComposedChart width={1000} height={350} data={data} margin={{left:45}}>
      <XAxis
        dataKey="name"
        angle={-20}
        textAnchor="end"
        tickLine={false}
        height={140}
        fontSize={11}
        width={50}
      />
      <YAxis dataKey={dataKey} tickFormatter={DataFormater} />
      <Tooltip
        formatter={(value) => {
          if (dataKey === "total") return formatMoney(value as number);
          return formatMoneyThousand(value as number);
        }}
      />
      <Legend align="center" verticalAlign="top" iconSize={12} />
      <CartesianGrid stroke="#f5f5f5" />
      {/* <Area type="monotone" dataKey="amt" fill="#8884d8" stroke="#8884d8" /> */}
      <Bar
        dataKey={dataKey}
        fill="#413ea0"
        name={dataKey === "total" ? "Doanh thu" : "Số lượng đã bán"}
      />
      <Line
        type="monotone"
        dataKey={dataKey}
        stroke="#ff7300"
        name={dataKey === "total" ? "Doanh thu" : "Số lượng đã bán"}
      />
    </ComposedChart>
  );
}
