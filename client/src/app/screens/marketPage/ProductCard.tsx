import { Box, Card, CardContent, Chip, Stack, Typography } from "@mui/material";
import GrainIcon from "@mui/icons-material/Grain";
import BoltIcon from "@mui/icons-material/Bolt";
import StorefrontIcon from "@mui/icons-material/Storefront";
import { useTranslation } from "react-i18next";
import { formatWon } from "../../../libs/config";
import { ProductCategory } from "../../../libs/enums/product.enum";
import type { Product } from "../../../libs/types/product";

/** Rasm yo'q — har bir tur uchun o'z rangdagi fon */
const CATEGORY_BG: Record<ProductCategory, string> = {
  [ProductCategory.WHITE_RICE]: "linear-gradient(135deg, #F4EFE2 0%, #E8DFC6 100%)",
  [ProductCategory.BROWN_RICE]: "linear-gradient(135deg, #E9D8BE 0%, #C9A97A 100%)",
  [ProductCategory.GLUTINOUS]: "linear-gradient(135deg, #F7F3F9 0%, #E3DAEA 100%)",
};

export default function ProductCard({ product }: { product: Product }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column", transition: "0.2s", "&:hover": { transform: "translateY(-3px)", boxShadow: "0 10px 24px rgba(0,0,0,0.08)" } }}>
      <Box sx={{ position: "relative", height: 120, background: CATEGORY_BG[product.productCategory], display: "grid", placeItems: "center" }}>
        <GrainIcon sx={{ fontSize: 56, color: "rgba(31,94,59,0.35)" }} />
        <Chip
          size="small"
          label={t(`category.${product.productCategory}`)}
          sx={{ position: "absolute", top: 10, left: 10, bgcolor: "#fff" }}
        />
        {product.productMilledToday && (
          <Chip
            size="small"
            icon={<BoltIcon />}
            label={t("product.milledToday")}
            color="secondary"
            sx={{ position: "absolute", top: 10, right: 10 }}
          />
        )}
      </Box>

      <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column", gap: 1 }}>
        <Typography variant="caption" color="text.secondary">
          {product.productProvince} · {product.productRegion} · {product.productVariety}
        </Typography>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.3 }}>
          {product.productName}
        </Typography>

        <Stack direction="row" sx={{ flexWrap: "wrap", gap: 0.5 }}>
          {product.productCertifications.map((cert) => (
            <Chip key={cert} size="small" variant="outlined" color="success" label={t(`cert.${cert}`)} />
          ))}
        </Stack>

        <Box sx={{ mt: "auto", pt: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 800, color: "primary.main" }}>
            {formatWon(product.productPrice, lang)}
          </Typography>
          {product.productPricePerKg && (
            <Typography variant="body2" color="text.secondary">
              {t("product.perKg", { price: formatWon(product.productPricePerKg, lang) })}
            </Typography>
          )}
        </Box>

        <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", pt: 1, borderTop: "1px dashed #E7E2D6" }}>
          <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
            <StorefrontIcon sx={{ fontSize: 16, color: "text.secondary" }} />
            <Typography variant="caption" color="text.secondary">
              {product.productSellerName}
            </Typography>
          </Stack>
          <Typography variant="caption" color="text.secondary">
            {t("product.stock", { count: product.productLeftCount })}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}
