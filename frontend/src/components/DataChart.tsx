import { Box } from "@mui/material";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  Legend,
  Bar,
} from "recharts";
import { formatMoney } from "../utils/formatMoney";
// import { FunctionComponent } from "react";

type DataWeek = {
  data: string;
  totalSales: number;
  totalProfit: number;
};
type DateMonth = {
  week: string;
  totalSales: number;
  totalProfit: number;
}

type Props = {
  data: DataWeek[] | DateMonth[];
};

// const CustomizedLabel: FunctionComponent<any> = (props: any) => {
//   const { x, y, stroke, value } = props;

//   return (
//     <text x={x} y={y} dy={-4} fill={stroke} fontSize={10} textAnchor="middle">
//       {value}
//     </text>
//   );
// };

// const CustomizedAxisTick: FunctionComponent<any> = (props: any) => {
//   const { x, y, payload } = props;

//   return (
//     <g transform={`translate(${x},${y})`}>
//       <text
//         x={0}
//         y={0}
//         dy={16}
//         textAnchor="end"
//         fill="#666"
//         // transform="rotate(-20)"
//       >
//         {payload.value}
//       </text>
//     </g>
//   );
// };
const DataFormater = (number:number) => {
  if (number > 1000000000) {
    return (number / 1000000000).toString() + "Tỉ";
  } else if (number > 1000000) {
    return (number / 1000000).toString() + "M";
  } else if (number > 1000) {
    return (number / 1000).toString() + "K";
  } else {
    return number.toString();
  }
};

//  how to check data is week or month
const isWeek = (data: any[]) => {
  return data[0]?.week !== undefined;
};
export default function DataChart({ data }: Props) {
  return (
    <Box display="flex" sx={{ px: 2 }}>
      <ResponsiveContainer width="100%" height={250}>
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={isWeek(data) ? "week" : "date"} />
          <YAxis tickFormatter={DataFormater} />
          <Tooltip formatter={(value) => formatMoney(value as number)} />
          <Legend iconType="circle" align="center" verticalAlign="top" />
          <Bar dataKey="totalSales" fill="#89A8B2" name="Doanh thu" />
          <Bar dataKey="totalProfit" fill="#9ABF80" name="Lợi nhuận" />
        </ComposedChart>
      </ResponsiveContainer>
    </Box>
  );
}
