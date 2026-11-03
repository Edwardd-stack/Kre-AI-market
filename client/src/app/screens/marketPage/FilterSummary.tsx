import { Button, Chip, Paper, Stack, Typography } from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { useTranslation } from "react-i18next";
import { formatWon } from "../../../libs/config";
import type { ProductInquiry } from "../../../libs/types/product";

interface FilterSummaryProps {
  query: string;
  filter: ProductInquiry;
  onReset: () => void;
}

/** AI gapdan chiqargan filtrni chip'lar ko'rinishida ko'rsatadi */
export default function FilterSummary({ query, filter, onReset }: FilterSummaryProps) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const chips: string[] = [];
  if (filter.productProvince) chips.push(`${t("filter.productProvince")}: ${filter.productProvince}`);
  if (filter.productVariety) chips.push(`${t("filter.productVariety")}: ${filter.productVariety}`);
  if (filter.productCategory) chips.push(`${t("filter.productCategory")}: ${t(`category.${filter.productCategory}`)}`);
  if (filter.productWeightKg) chips.push(`${t("filter.productWeightKg")}: ${filter.productWeightKg}kg`);
  if (filter.maxPrice) chips.push(`${t("filter.maxPrice")}: ${formatWon(filter.maxPrice, lang)}`);
  if (filter.maxPricePerKg) chips.push(`${t("filter.maxPricePerKg")}: ${formatWon(filter.maxPricePerKg, lang)}`);
  if (filter.productMilledToday) chips.push(t("filter.productMilledToday"));
  filter.productCertifications?.forEach((c) => chips.push(`${t("filter.productCertifications")}: ${t(`cert.${c}`)}`));
  if (filter.order && filter.order !== "createdAt") chips.push(`${t("filter.order")}: ${t(`order.${filter.order}`)}`);

  return (
    <Paper sx={{ p: 2, mb: 3, border: "1px solid", borderColor: "secondary.main", bgcolor: "#FFFBF0" }} elevation={0}>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={1} sx={{ justifyContent: "space-between" }}>
        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
          <AutoAwesomeIcon fontSize="small" sx={{ color: "secondary.main" }} />
          <Typography variant="subtitle2">{t("search.understood")}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic" }}>
            “{query}”
          </Typography>
        </Stack>
        <Button size="small" onClick={onReset}>
          {t("search.reset")}
        </Button>
      </Stack>

      <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1, mt: 1.5 }}>
        {chips.length ? (
          chips.map((chip) => <Chip key={chip} label={chip} color="primary" variant="outlined" />)
        ) : (
          <Typography variant="body2" color="text.secondary">
            {t("search.noFilter")}
          </Typography>
        )}
      </Stack>
    </Paper>
  );
}
