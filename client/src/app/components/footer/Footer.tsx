import { Box, Container, Link, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <Box component="footer" sx={{ bgcolor: "primary.dark", color: "rgba(255,255,255,0.7)", mt: "auto", py: 4 }}>
      <Container maxWidth="lg">
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1} sx={{ justifyContent: "space-between" }}>
          <Typography variant="body2">{t("footer.about")}</Typography>
          <Typography variant="body2">{t("footer.stack")}</Typography>
        </Stack>
        <Typography variant="caption" sx={{ display: "block", mt: 2 }}>
          <Link href="https://github.com/Edwardd-stack/Kre-AI-market" target="_blank" color="inherit">
            github.com/Edwardd-stack/Kre-AI-market
          </Link>
        </Typography>
      </Container>
    </Box>
  );
}
