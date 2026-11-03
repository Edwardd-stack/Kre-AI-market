import { Grid, Skeleton, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import type { Product } from "../../../libs/types/product";
import ProductCard from "./ProductCard";

interface ProductListProps {
  products: Product[];
  loading: boolean;
}

export default function ProductList({ products, loading }: ProductListProps) {
  const { t } = useTranslation();

  if (loading) {
    return (
      <Grid container spacing={2.5}>
        {Array.from({ length: 8 }).map((_, i) => (
          <Grid key={i} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <Skeleton variant="rounded" height={320} />
          </Grid>
        ))}
      </Grid>
    );
  }

  if (!products.length) {
    return (
      <Typography color="text.secondary" sx={{ py: 8, textAlign: "center" }}>
        {t("search.empty")}
      </Typography>
    );
  }

  return (
    <Grid container spacing={2.5}>
      {products.map((product) => (
        <Grid key={product._id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
          <ProductCard product={product} />
        </Grid>
      ))}
    </Grid>
  );
}
