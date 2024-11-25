import { Box, CircularProgress, Stack } from "@mui/material";
import Logo from "../assets/images/logo.png";
export default function LinearBuffer() {
  
  return (
    <Stack
      sx={{
        width: "100%",
        height: "100vh",
        display: "flex",
      }}
      spacing={2}
      alignItems="center"
      justifyContent="center"
    >
      <Box
        component="img"
        src={Logo}
        alt="logo"
        width={100}
        height={100}
        sx={{ borderRadius: "50%" }}
      />
      <CircularProgress size="3rem" />
    </Stack>
  );
}
