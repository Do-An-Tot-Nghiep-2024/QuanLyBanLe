import { Avatar, Card, CardContent, Stack, Typography } from "@mui/material";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
export default function   CardItem({ value,column }: { value: number, column: string }) {
  return (
    <Card sx={{height:"100%"}}>
      <CardContent>
        <Stack
          direction="row"
          sx={{ alignItems: "flex-start", justifyContent: "space-between" }}
          spacing={3}
        >
          <Stack spacing={1}>
            <Typography color="text.secondary" variant="overline">
              {column}
            </Typography>
            <Typography variant="h4">{value}</Typography>
          </Stack>
          <Avatar
            sx={{
              backgroundColor: "var(--mui-palette-primary-main)",
              height: "56px",
              width: "56px",
            }}
          >
            <MonetizationOnIcon />
          </Avatar>
        </Stack>
      </CardContent>
    </Card>
  );
}
