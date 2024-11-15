import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import PageRouter from "./routes/PageRouter";
const THEME = createTheme({
  typography: {
    fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif`,
    fontSize: 16,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
  },
});
function App() {
  return (
    <ThemeProvider theme={THEME}>
      <CssBaseline />
      <PageRouter />
    </ThemeProvider>
  );
}

export default App;
