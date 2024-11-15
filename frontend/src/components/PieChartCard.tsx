import { Box, Card, CardContent, Paper, Typography } from "@mui/material";
import { PieChart, Pie, Cell, Legend } from "recharts";

const data = [
  { name: "Group A", value: 400 },
  { name: "Group B", value: 300 },
  { name: "Group C", value: 300 },
  { name: "Group D", value: 200 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      fontSize={20}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function PieChartCard() {
  return (
    <Card sx={{ ml: 2}} component={Paper}>
      <CardContent>
        <Typography align="left" fontWeight={"600"}>
          Tỉ lệ doanh thu theo nhà cung cấp
        </Typography>
        <Box alignItems={"center"} justifyContent={"center"} display={"flex"}>
          <PieChart width={400} height={500}>
            <Pie
              data={data}
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
              fontSize={"16px"}
            >
              {data.map((_entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            {/* <Tooltip /> */}
            <Legend
              // content={renderLegend} // Use custom legend component
              
              verticalAlign="bottom"
              align="left"
              iconType="line"
            />
          </PieChart>
        </Box>
      </CardContent>
    </Card>
  );
}
