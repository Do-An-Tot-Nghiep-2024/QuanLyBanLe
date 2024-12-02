import { Box, Card, CardContent, Paper, Typography } from "@mui/material";
import { Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";


type Data = {
  name: string;
  value: number;
};

type Props = {
  data: Data[];
};



export default function PieChartCard({data}: Props) {
  return (
    <Card sx={{ ml: 2 }} component={Paper}>
      <CardContent>
        <Typography align="left" fontWeight={"600"}>
          Tỉ lệ doanh thu theo nhà cung cấp
        </Typography>
        <Box alignItems={"center"} justifyContent={"center"} display={"flex"}>
          
          <RadarChart outerRadius={120} width={730} height={300} data={data}>
            <PolarGrid />
            <PolarAngleAxis dataKey="name" />
            <PolarRadiusAxis angle={50} />
            <Radar
              legendType="circle"
              name="Doanh thu"
              dataKey="total"
              stroke="#8884d8"
              fill="#8884d8"
              fillOpacity={0.6}
              
            />
          
            <Legend />
          </RadarChart>
        </Box>
      </CardContent>
    </Card>
  );
}
