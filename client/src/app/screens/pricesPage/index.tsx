import { useEffect, useState } from "react";
import { Alert, Box, Container, Skeleton, Stack, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import PriceService from "../../../services/PriceService";
import AiService from "../../../services/AiService";
import { getErrorMessage } from "../../../libs/config";
import type { Lang } from "../../../libs/enums/ai.enum";
import type { PriceHistory } from "../../../libs/types/price";
import type { AiReportResult } from "../../../libs/types/ai";
import PriceChart from "./PriceChart";
import AiReportCard from "./AiReportCard";

const priceService = new PriceService();
const aiService = new AiService();
const PERIODS = [30, 60, 90];

export default function PricesPage() {
  const { t, i18n } = useTranslation();
  const [days, setDays] = useState(30);
  const [prices, setPrices] = useState<PriceHistory[]>([]);
  const [pricesLoading, setPricesLoading] = useState(true);
  const [pricesError, setPricesError] = useState<string | null>(null);

  const [report, setReport] = useState<AiReportResult | null>(null);
  const [reportLoading, setReportLoading] = useState(false);
  const [reportError, setReportError] = useState<string | null>(null);

  /** Davr o'zgarsa — grafik qayta yuklanadi, eski hisobot o'chiriladi */
  useEffect(() => {
    let active = true;
    setPricesLoading(true);
    setPricesError(null);
    setReport(null);
    priceService
      .getPriceHistory(days)
      .then((data) => active && setPrices(data))
      .catch((err) => active && setPricesError(getErrorMessage(err)))
      .finally(() => active && setPricesLoading(false));
    return () => {
      active = false; // tez-tez bosilsa eski javob yangisini bosib ketmasin
    };
  }, [days]);

  /** Til o'zgarsa — hisobot shu tilda bo'lmagani uchun yashiriladi */
  useEffect(() => {
    setReport(null);
  }, [i18n.language]);

  const generateReport = async () => {
    setReportLoading(true);
    setReportError(null);
    try {
      const result = await aiService.report(i18n.language as Lang, days);
      setReport(result);
    } catch (err) {
      setReportError(getErrorMessage(err));
    } finally {
      setReportLoading(false);
    }
  };

  return (
    <Box sx={{ py: 5 }}>
      <Container maxWidth="lg">
        <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ justifyContent: "space-between", alignItems: { md: "flex-end" }, mb: 3 }}>
          <Box>
            <Typography variant="h3" sx={{ fontSize: { xs: 28, md: 36 } }}>
              {t("prices.title")}
            </Typography>
            <Typography color="text.secondary">{t("prices.subtitle")}</Typography>
          </Box>
          <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
            <Typography variant="body2" color="text.secondary">
              {t("prices.period")}
            </Typography>
            <ToggleButtonGroup size="small" exclusive value={days} onChange={(_, v: number | null) => v && setDays(v)}>
              {PERIODS.map((p) => (
                <ToggleButton key={p} value={p} sx={{ px: 2 }}>
                  {t("prices.days", { count: p })}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Stack>
        </Stack>

        <Stack spacing={3}>
          {pricesError && <Alert severity="error">{t("error.title")}: {pricesError}</Alert>}
          {pricesLoading ? <Skeleton variant="rounded" height={410} /> : <PriceChart prices={prices} />}
          <AiReportCard report={report} loading={reportLoading} error={reportError} onGenerate={generateReport} />
        </Stack>
      </Container>
    </Box>
  );
}
