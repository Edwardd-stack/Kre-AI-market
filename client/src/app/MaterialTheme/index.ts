import { createTheme } from "@mui/material/styles";

/** KRE uslubi: chuqur yashil (guruch dalasi) + iliq oltin (pishgan boshoq) */
const theme = createTheme({
  palette: {
    primary: { main: "#1F5E3B", light: "#2F7A51", dark: "#14402A", contrastText: "#FFFFFF" },
    secondary: { main: "#C99A2E", contrastText: "#1B1B1B" },
    background: { default: "#F7F5EF", paper: "#FFFFFF" },
    text: { primary: "#1C2321", secondary: "#5B6461" },
    success: { main: "#2E7D32" },
    error: { main: "#C0392B" },
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: `"Pretendard", "Noto Sans KR", "Inter", system-ui, -apple-system, sans-serif`,
    h1: { fontWeight: 800, letterSpacing: "-0.02em" },
    h2: { fontWeight: 800, letterSpacing: "-0.02em" },
    h3: { fontWeight: 700 },
    button: { textTransform: "none", fontWeight: 700 },
  },
  components: {
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: { root: { border: "1px solid #E7E2D6" } },
    },
    MuiChip: { styleOverrides: { root: { fontWeight: 600 } } },
  },
});

export default theme;
