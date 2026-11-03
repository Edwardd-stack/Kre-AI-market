import { AppBar, Box, Button, Container, Stack, Toolbar, Typography } from "@mui/material";
import GrainIcon from "@mui/icons-material/Grain";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Navbar() {
  const { t } = useTranslation();

  const links = [
    { to: "/", label: t("nav.market") },
    { to: "/prices", label: t("nav.prices") },
  ];

  return (
    <AppBar position="sticky" elevation={0} sx={{ bgcolor: "primary.dark" }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ gap: 3, minHeight: 68 }}>
          <Stack
            component={NavLink}
            to="/"
            direction="row"
            spacing={1}
            sx={{ alignItems: "center", color: "inherit", textDecoration: "none" }}
          >
            <GrainIcon sx={{ color: "secondary.main", fontSize: 30 }} />
            <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: "-0.02em" }}>
              KRE <Box component="span" sx={{ color: "secondary.main" }}>AI</Box> Market
            </Typography>
          </Stack>

          <Stack direction="row" spacing={0.5} sx={{ flexGrow: 1, display: { xs: "none", sm: "flex" } }}>
            {links.map((link) => (
              <Button
                key={link.to}
                component={NavLink}
                to={link.to}
                end
                sx={{
                  color: "rgba(255,255,255,0.75)",
                  "&.active": { color: "#fff", bgcolor: "rgba(255,255,255,0.1)" },
                }}
              >
                {link.label}
              </Button>
            ))}
          </Stack>

          <Box sx={{ ml: "auto" }}>
            <LanguageSwitcher />
          </Box>
        </Toolbar>

        {/* Mobil: menyu pastki qatorda */}
        <Stack direction="row" spacing={1} sx={{ pb: 1, display: { xs: "flex", sm: "none" } }}>
          {links.map((link) => (
            <Button
              key={link.to}
              component={NavLink}
              to={link.to}
              end
              size="small"
              sx={{ color: "rgba(255,255,255,0.75)", "&.active": { color: "#fff" } }}
            >
              {link.label}
            </Button>
          ))}
        </Stack>
      </Container>
    </AppBar>
  );
}
