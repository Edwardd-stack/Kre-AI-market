import { Box, Container, Divider, Link, Stack, Typography } from "@mui/material";
import GrainIcon from "@mui/icons-material/Grain";
import GitHubIcon from "@mui/icons-material/GitHub";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();

  const links = [
    { to: "/", label: t("nav.market") },
    { to: "/prices", label: t("nav.prices") },
    { to: "/support", label: t("nav.support") },
  ];

  return (
    <Box component="footer" sx={{ bgcolor: "primary.dark", color: "rgba(255,255,255,0.75)", mt: "auto", pt: 6, pb: 4 }}>
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={4}
          sx={{ justifyContent: "space-between", alignItems: { md: "flex-start" } }}
        >
          {/* Brend */}
          <Box sx={{ maxWidth: 420 }}>
            <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 1.5 }}>
              <GrainIcon sx={{ color: "secondary.main", fontSize: 34 }} />
              <Typography variant="h5" sx={{ fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>
                KRE <Box component="span" sx={{ color: "secondary.main" }}>AI</Box> Market
              </Typography>
            </Stack>
            <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
              {t("footer.about")}
            </Typography>
          </Box>

          {/* Menyu */}
          <Stack spacing={1.25}>
            {links.map((link) => (
              <Link
                key={link.to}
                component={NavLink}
                to={link.to}
                underline="none"
                sx={{ color: "rgba(255,255,255,0.85)", fontWeight: 600, fontSize: 16, "&:hover": { color: "secondary.main" } }}
              >
                {link.label}
              </Link>
            ))}
          </Stack>

          {/* Texnologiyalar + GitHub */}
          <Stack spacing={1.5} sx={{ alignItems: { md: "flex-end" } }}>
            <Typography variant="body1">{t("footer.stack")}</Typography>
            <Link
              href="https://github.com/Edwardd-stack/Kre-AI-market"
              target="_blank"
              rel="noopener"
              underline="none"
              sx={{ display: "inline-flex", alignItems: "center", gap: 1, color: "#fff", fontWeight: 600, "&:hover": { color: "secondary.main" } }}
            >
              <GitHubIcon fontSize="small" /> Edwardd-stack/Kre-AI-market
            </Link>
          </Stack>
        </Stack>

        <Divider sx={{ my: 3.5, borderColor: "rgba(255,255,255,0.12)" }} />

        <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.5)" }}>
          © {new Date().getFullYear()} KRE AI Market
        </Typography>
      </Container>
    </Box>
  );
}
