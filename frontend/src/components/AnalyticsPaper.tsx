import { Box, Card } from "@mui/material";
type Props = {
  name: string;
  value: number;
  color: string;
  iconColor:string;
  icon: JSX.Element | null;
};

export default function AnalyticsPaper({ props }: { props: Props }) {
  return (
    <Card
      sx={{
        width: "100%",
        p: 3,
        boxShadow: "none",
        position: "relative",
        backgroundColor: props.color,
        borderRadius: 3,
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          mb: 3,
          backgroundColor: props.iconColor,
          borderRadius: "50%",
          width: 50,
          height: 50,
          alignItems: "center",
          display: "flex",
          justifyContent: "center",
        }}
      >
        {props.icon}
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Box sx={{ typography: "h3", textAlign: "center",color:"" }}>{props.value}</Box>
        <Box sx={{ mb: 1, fontSize:16, textAlign: "center",color:"unset" }}>
          {props.name}
        </Box>
      </Box>
    </Card>
  );
}
