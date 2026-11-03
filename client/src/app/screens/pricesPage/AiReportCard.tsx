import { Alert, Box, Button, Card, CardContent, Grid, Skeleton, Stack, Typography } from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import { useTranslation } from "react-i18next";
import { formatWon } from "../../../libs/config";
import type { AiReportResult } from "../../../libs/types/ai";

interface AiReportCardProps {
  report: AiReportResult | null;
  loading: boolean;
  error: string | null;
  onGenerate: () => void;
}

export default function AiReportCard({ report, loading, error, onGenerate }: AiReportCardProps) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  return (
    <Card sx={{ borderColor: "secondary.main" }}>
      <CardContent>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ justifyContent: "space-between", alignItems: { sm: "center" }, mb: 2 }}>
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <AutoAwesomeIcon sx={{ color: "secondary.main" }} />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {t("prices.reportTitle")}
            </Typography>
          </Stack>
          <Button variant="contained" color="secondary" onClick={onGenerate} disabled={loading} startIcon={<AutoAwesomeIcon />}>
            {t("prices.reportButton")}
          </Button>
        </Stack>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{t("error.title")}: {error}</Alert>}

        {loading && (
          <Box>
            <Typography variant="body2" color="secondary.dark" sx={{ fontWeight: 700, mb: 1 }}>
              {t("prices.reportLoading")}
            </Typography>
            <Skeleton height={24} />
            <Skeleton height={24} />
            <Skeleton height={24} width="70%" />
          </Box>
        )}

        {report && !loading && (
          <>
            {/* Raqamlar — serverda hisoblangan */}
            <Grid container spacing={1.5} sx={{ mb: 2.5 }}>
              {report.stats.map((s) => {
                const up = s.changePercent >= 0;
                return (
                  <Grid key={`${s.priceMarketType}_${s.priceGrade}`} size={{ xs: 12, sm: 6, md: 3 }}>
                    <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: "#F7F5EF", height: "100%" }}>
                      <Typography variant="caption" color="text.secondary">
                        {t(`market.${s.priceMarketType}`)} · {t(`grade.${s.priceGrade}`)}
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 800 }}>
                        {formatWon(s.lastPrice, lang)}
                      </Typography>
                      <Stack direction="row" spacing={0.5} sx={{ alignItems: "center", color: up ? "error.main" : "primary.main" }}>
                        {up ? <TrendingUpIcon fontSize="small" /> : <TrendingDownIcon fontSize="small" />}
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                          {up ? "+" : ""}{s.changePercent}%
                        </Typography>
                      </Stack>
                      <Typography variant="caption" color="text.secondary">
                        {t("prices.min")} {formatWon(s.minPrice, lang)} · {t("prices.max")} {formatWon(s.maxPrice, lang)}
                      </Typography>
                    </Box>
                  </Grid>
                );
              })}
            </Grid>

            {/* AI yozgan matn */}
            <Typography sx={{ lineHeight: 1.8, whiteSpace: "pre-line" }}>{report.report}</Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 2 }}>
              ⓘ {t("prices.reportNote")}
            </Typography>
          </>
        )}
      </CardContent>
    </Card>
  );
}
